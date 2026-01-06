#!/usr/bin/env bun
import { Command } from 'commander';
import chalk from 'chalk';
import { ConfigLoader, DEFAULT_CONFIG_PATH } from '@abridge/core';

const program = new Command();

program
  .name('abridge')
  .description('Unified AI Tools Manager')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize abridge configuration')
  .action(async () => {
    console.log(chalk.blue(`Checking configuration at ${DEFAULT_CONFIG_PATH}...`));
    try {
      const config = await ConfigLoader.load();
      await ConfigLoader.save(config);
      console.log(chalk.green('✓ Configuration initialized successfully.'));
    } catch (error) {
      console.error(chalk.red('Failed to initialize configuration:'), error);
    }
  });

import { registry, mergeConfigs } from '@abridge/core';

program
  .command('apply')
  .description('Apply configuration to all tools')
  .action(async () => {
    try {
      const manager = new SyncManager();
      
      // Auto-pull if cloud is newer
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
        } else {
          console.log(chalk.gray(`- ${adapter.name} not detected, skipping.`));
        }
      }
      
      console.log(chalk.green('✓ Configuration applied successfully.'));

      // Auto-sync push if enabled
      if (config.sync?.enabled) {
        try {
          const manager = new SyncManager();
          await manager.push();
          console.log(chalk.gray('(Auto-synced to cloud drive)'));
        } catch (e) {
          console.warn(chalk.yellow('! Auto-sync failed, but local application succeeded.'));
        }
      }
    } catch (error) {
      console.error(chalk.red('Failed to apply configuration:'), error);
    }
  });

program
  .command('import')
  .description('Import configuration from all detected tools')
  .action(async () => {
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
    } catch (error) {
      console.error(chalk.red('Failed to import configuration:'), error);
    }
  });

import { SyncManager } from '@abridge/core';

const sync = program.command('sync').description('Manage cloud drive synchronization');

sync
  .command('push')
  .description('Push local configuration to cloud drive')
  .action(async () => {
    try {
      const manager = new SyncManager();
      console.log(chalk.blue('Pushing configuration to cloud drive...'));
      await manager.push();
      console.log(chalk.green('✓ Configuration pushed successfully.'));
    } catch (error) {
      console.error(chalk.red('Failed to push configuration:'), error);
    }
  });

sync
  .command('pull')
  .description('Pull configuration from cloud drive')
  .action(async () => {
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
  });

sync
  .command('status')
  .description('Check synchronization status')
  .action(async () => {
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
  });

program.parse();
