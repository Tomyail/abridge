import chalk from 'chalk';
import { ConfigLoader, DEFAULT_CONFIG_PATH, registry, mergeConfigs, SyncManager } from '@abridge/core';

export async function runInit() {
  console.log(chalk.blue(`Initializing configuration at ${DEFAULT_CONFIG_PATH}...`));
  try {
    await ConfigLoader.init();
    console.log(chalk.green('✓ Configuration initialized successfully.'));
  } catch (error) {
    console.error(chalk.red('Failed to initialize configuration:'), error);
  }
}

export async function runApply() {
  try {
    const manager = new SyncManager();
    const { status } = await manager.checkStatus();
    if (status === 'outdated') {
      console.log(chalk.blue('☁️ Cloud configuration is newer, auto-pulling...'));
      await manager.pull();
    }

    const config = await ConfigLoader.load();
    const adapters = registry.getAllAdapters();
    
    console.log(chalk.blue('Applying configuration to tools...'));
    
    for (const adapter of adapters) {
      if (await adapter.detect()) {
        console.log(chalk.yellow(`- Applying to ${adapter.name}...`));
        await adapter.apply(config);
        console.log(chalk.green(`  ✓ ${adapter.name} updated.`));
      }
    }
    
    console.log(chalk.green('✓ Configuration applied successfully.'));

    if (config.sync?.enabled) {
      try {
        await manager.push();
        console.log(chalk.gray('(Auto-synced to cloud drive)'));
      } catch (e) {
        console.warn(chalk.yellow('! Auto-sync failed, but local application succeeded.'));
      }
    }
  } catch (error) {
    console.error(chalk.red('Failed to apply configuration:'), error);
  }
}

export async function runImport() {
  try {
    let config = await ConfigLoader.load();
    const adapters = registry.getAllAdapters();
    
    console.log(chalk.blue('Importing configuration from tools...'));
    
    for (const adapter of adapters) {
      if (await adapter.detect()) {
        console.log(chalk.yellow(`- Importing from ${adapter.name}...`));
        const extracted = await adapter.extract();
        config = mergeConfigs(config, extracted);
        console.log(chalk.green(`  ✓ ${adapter.name} data merged.`));
      }
    }
    
    await ConfigLoader.save(config);
    console.log(chalk.green('✓ Configuration imported and saved.'));

    if (config.sync?.enabled) {
      try {
        const manager = new SyncManager();
        await manager.push();
        console.log(chalk.gray('(Auto-synced to cloud drive)'));
      } catch (e) {
        console.warn(chalk.yellow('! Auto-sync failed, but local import succeeded.'));
      }
    }
  } catch (error) {
    console.error(chalk.red('Failed to import configuration:'), error);
  }
}

export async function runStatus() {
  try {
    const manager = new SyncManager();
    const { status } = await manager.checkStatus();
    
    switch (status) {
      case 'up-to-date':
        console.log(chalk.green('✓ Local and cloud configurations are in sync.'));
        break;
      case 'outdated':
        console.log(chalk.yellow('! Cloud configuration is newer. Run "abridge sync pull" to update.'));
        break;
      case 'local-newer':
        console.log(chalk.cyan('! Local configuration is newer. Run "abridge sync push" to update cloud.'));
        break;
      case 'no-cloud':
        console.log(chalk.gray('- Sync not configured or cloud files missing.'));
        break;
    }
  } catch (error) {
    console.error(chalk.red('Failed to check sync status:'), error);
  }
}

export async function runSyncPush() {
  try {
    const manager = new SyncManager();
    console.log(chalk.blue('Pushing configuration to cloud drive...'));
    await manager.push();
    console.log(chalk.green('✓ Configuration pushed successfully.'));
  } catch (error) {
    console.error(chalk.red('Failed to push configuration:'), error);
  }
}

export async function runSyncPull() {
  try {
    const manager = new SyncManager();
    console.log(chalk.blue('Pulling configuration from cloud drive...'));
    const success = await manager.pull();
    if (success) {
      console.log(chalk.green('✓ Configuration pulled successfully. Run "abridge apply" to sync to tools.'));
    } else {
      console.warn(chalk.yellow('! No configuration found in cloud drive.'));
    }
  } catch (error) {
    console.error(chalk.red('Failed to pull configuration:'), error);
  }
}

