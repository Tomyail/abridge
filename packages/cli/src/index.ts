#!/usr/bin/env bun
import './polyfill';
import { showWelcomeScreen } from './welcome';
import { program } from 'commander';
import { version } from '../package.json';
import { runInit, runApply, runImport, runStatus, runSyncPush, runSyncPull, runUi, runLaunch } from './actions';
import { registry, ConfigLoader, DEFAULT_CONFIG_PATH, DaemonServer } from '@abridge/core';
import fs from 'fs';

// const program = new Command(); // This line is removed as `program` is now imported directly.

program
  .name('abridge')
  .description('Unified AI Tools Manager')
  .version('0.1.0')
  .action(async () => {
    // Default action: Connect to daemon and show UI
    // If we want the welcome screen to be "client-server" aware, we pass the client.
    
    // For now, let's keep the existing loop but use the DaemonClient inside `runUi` / `runLaunch`
    // Or we could initialize the client here?
    
    while (true) {
      const action = await showWelcomeScreen(); 
      // ... same loop ...
      
      if (action.type === 'ui') {
        const { runUi } = await import('./actions.js');
        await runUi();
      }

      // ... match other actions ...
      if (action.type === 'exit') {
         process.exit(0);
      }
      if (action.type === 'launch') {
         const { runLaunch } = await import('./actions.js');
         await runLaunch(action.toolId);
      }
    }
  });

program
  .command('daemon')
  .description('Start the background process supervisor (Internal use)')
  .action(async () => {
      const { DaemonServer } = await import('@abridge/core');
      const server = new DaemonServer();
      server.start();
      // Keep process alive
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
