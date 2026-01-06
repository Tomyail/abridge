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

program.parse();
