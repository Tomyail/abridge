#!/usr/bin/env bun
import './polyfill';
import { Command } from 'commander';

import { showWelcomeScreen } from './welcome.js';
import { runInit, runApply, runImport, runStatus, runSyncPush, runSyncPull, runUi } from './actions.js';

const program = new Command();

program
  .name('abridge')
  .description('Unified AI Tools Manager')
  .version('0.1.0')
  .action(async () => {
    while (true) {
      const action = await showWelcomeScreen();
      
      if (action.type === 'exit') {
        process.exit(0);
      }
      
      if (action.type === 'ui') {
        const { runUi } = await import('./actions.js');
        await runUi();
      }
      
      if (action.type === 'launch') {
        const { runLaunch } = await import('./actions.js');
        await runLaunch(action.toolId);
        // Loop continues, showing welcome screen again
      }
      
      if (action.type === 'run') {
         // Handle other commands if migrated to return actions
         // Currently welcome.tsx handles them directly for init/import etc.
         // But we can migrate them here later for consistency.
      }
    }
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

program
  .command('ui')
  .description('Open Workspace Dashboard')
  .action(runUi);

program.parse();
