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

program.parse();
