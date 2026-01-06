import { join } from 'path';
import { homedir } from 'os';
import { type UnifiedConfig } from '../config/schema';
import { ConfigLoader } from '../config/loader';

export interface SyncMetadata {
  last_modified: string;
  machine_id: string;
  version: string;
}

export class SyncManager {
  private localConfigPath = join(homedir(), '.abridge', 'config.yaml');
  
  constructor() {}

  /**
   * Push local config to cloud drive
   */
  async push(): Promise<void> {
    const config = await ConfigLoader.load();
    if (!config.sync?.enabled || !config.sync.path) {
      throw new Error('Sync is not enabled or sync path is not configured.');
    }

    const cloudPath = this.resolvePath(config.sync.path);
    const { mkdir } = await import('node:fs/promises');
    await mkdir(cloudPath, { recursive: true });

    const targetFile = join(cloudPath, 'config.yaml');
    const metadataFile = join(cloudPath, 'sync_metadata.json');

    const { statSync } = await import('node:fs');
    const localStat = statSync(this.localConfigPath);

    const metadata: SyncMetadata = {
      last_modified: localStat.mtime.toISOString(),
      machine_id: await this.getMachineId(),
      version: '1.0.0',
    };

    // Load config and remove device-specific sync.path before pushing
    const { stringify } = await import('yaml');
    const configForCloud = { ...config };
    if (configForCloud.sync) {
      // Remove device-specific path from sync config
      const { path, ...syncWithoutPath } = configForCloud.sync;
      configForCloud.sync = syncWithoutPath;
    }
    const cloudContent = stringify(configForCloud);

    await Bun.write(targetFile, cloudContent);
    await Bun.write(metadataFile, JSON.stringify(metadata, null, 2));
  }

  /**
   * Pull config from cloud drive to local
   */
  async pull(): Promise<boolean> {
    const config = await ConfigLoader.load();
    if (!config.sync?.enabled || !config.sync.path) {
      throw new Error('Sync is not enabled or sync path is not configured.');
    }

    const cloudPath = this.resolvePath(config.sync.path);
    const cloudFile = join(cloudPath, 'config.yaml');
    const metadataFile = join(cloudPath, 'sync_metadata.json');

    if (!(await Bun.file(cloudFile).exists())) {
      return false;
    }

    // Preserve local sync.path
    const localSyncPath = config.sync.path;

    // Parse cloud config and merge with local sync.path
    const { parse, stringify } = await import('yaml');
    const cloudContent = await Bun.file(cloudFile).text();
    const cloudConfig = parse(cloudContent);

    // Restore device-specific sync.path
    if (cloudConfig.sync && localSyncPath) {
      cloudConfig.sync.path = localSyncPath;
    }

    await Bun.write(this.localConfigPath, stringify(cloudConfig));
    return true;
  }

  /**
   * Check if cloud has newer config
   */
  async checkStatus(): Promise<{ status: 'up-to-date' | 'outdated' | 'local-newer' | 'no-cloud' }> {
    const config = await ConfigLoader.load();
    if (!config.sync?.enabled || !config.sync.path) {
      return { status: 'no-cloud' };
    }

    const cloudPath = this.resolvePath(config.sync.path);
    const metadataFile = join(cloudPath, 'sync_metadata.json');

    if (!(await Bun.file(metadataFile).exists())) {
      return { status: 'no-cloud' };
    }

    try {
      const cloudMetadata: SyncMetadata = JSON.parse(await Bun.file(metadataFile).text());
      const localStat = await import('node:fs').then(fs => fs.statSync(this.localConfigPath));
      
      const cloudTime = new Date(cloudMetadata.last_modified).getTime();
      const localTime = localStat.mtime.getTime();

      if (cloudTime > localTime + 1000) { // 1s buffer for FS precision
        return { status: 'outdated' };
      } else if (localTime > cloudTime + 1000) {
        return { status: 'local-newer' };
      }
      return { status: 'up-to-date' };
    } catch (e) {
      return { status: 'no-cloud' };
    }
  }

  private resolvePath(p: string): string {
    if (p.startsWith('~/')) {
      return join(homedir(), p.slice(2));
    }
    return p;
  }

  private async getMachineId(): Promise<string> {
    const { hostname } = await import('node:os');
    return hostname();
  }
}
