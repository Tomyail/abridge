#!/usr/bin/env bun
import { Command } from 'commander';
import { showWelcomeScreen } from './welcome.js';
import { runInit, runApply, runImport, runStatus, runSyncPush, runSyncPull } from './actions.js';

const program = new Command();

program
  .name('abridge')
  .description('Unified AI Tools Manager')
  .version('0.1.0')
  .action(() => {
    showWelcomeScreen();
  });

program
  .command('init')
  .description('Initialize abridge configuration')
  .action(runInit);

program
  .command('apply')
  .description('Apply configuration to all tools')
  .action(runApply);

program
  .command('import')
  .description('Import configuration from all detected tools')
  .action(runImport);

const sync = program.command('sync').description('Manage cloud drive synchronization');

sync
  .command('push')
  .description('Push local configuration to cloud drive')
  .action(runSyncPush);

sync
  .command('pull')
  .description('Pull configuration from cloud drive')
  .action(runSyncPull);

sync
  .command('status')
  .description('Check synchronization status')
  .action(runStatus);

program.parse();
