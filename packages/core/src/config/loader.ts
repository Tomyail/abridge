import { parse } from 'yaml';
import { UnifiedConfigSchema, type UnifiedConfig } from './schema';
import { join } from 'path';
import { homedir } from 'os';

export const DEFAULT_CONFIG_DIR = join(homedir(), '.abridge');
export const DEFAULT_CONFIG_PATH = join(DEFAULT_CONFIG_DIR, 'config.yaml');

export class ConfigLoader {
  static async load(path: string = DEFAULT_CONFIG_PATH): Promise<UnifiedConfig> {
    try {
      const file = Bun.file(path);
      const exists = await file.exists();

      if (!exists) {
        return UnifiedConfigSchema.parse({}); // Return default empty config
      }

      const content = await file.text();
      const rawConfig = parse(content);
      return UnifiedConfigSchema.parse(rawConfig || {});
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load config at ${path}: ${error.message}`);
      }
      throw error;
    }
  }

  static async save(config: UnifiedConfig, path: string = DEFAULT_CONFIG_PATH): Promise<void> {
    try {
      const { stringify } = await import('yaml');
      const yamlContent = stringify(config);
      
      // Ensure directory exists
      const dir = path.substring(0, path.lastIndexOf('/'));
      if (dir) {
        const mkdir = await import('node:fs/promises').then(m => m.mkdir);
        await mkdir(dir, { recursive: true });
      }

      await Bun.write(path, yamlContent);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to save config at ${path}: ${error.message}`);
      }
      throw error;
    }
  }
}
