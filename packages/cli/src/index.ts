#!/usr/bin/env bun
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('abridge')
  .description('Unified AI Tools Manager')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize abridge configuration')
  .action(() => {
    console.log(chalk.green('Initializing abridge...'));
  });

program.parse();
