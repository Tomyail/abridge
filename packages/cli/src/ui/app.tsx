
import React, { useState, useEffect, useRef } from 'react';
import { Box, useInput, useApp, type Key } from 'ink';
import { Sidebar } from './sidebar';
import { TerminalPane } from './terminal-pane';
import { processManager } from '@abridge/core';
import { Session } from '@abridge/core';

import { registry } from '@abridge/core';
import type { UnifiedConfig } from '@abridge/core';
import { Text } from 'ink';

interface AppProps {
  config: UnifiedConfig;
}

export const App = ({ config }: AppProps) => {
  const { exit } = useApp();
  const [sessions, setSessions] = useState<Session[]>(processManager.list());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAttached, setIsAttached] = useState(false);
  const [isSelectingTask, setIsSelectingTask] = useState(false);
  
  // Derived state
  const activeSession = sessions[selectedIndex];

  // Subscribe to process updates (Event-Driven)
  useEffect(() => {
    const update = (list: Session[]) => setSessions(list);
    processManager.on('change', update);
    // Initial fetch to be safe
    setSessions(processManager.list());
    return () => {
        processManager.off('change', update);
    };
  }, []);

  // Handle output piping when attached
  useEffect(() => {
    if (isAttached && activeSession) {
      // CLEAR SCREEN on attach to give a clean slate for the PTY
      process.stdout.write('\x1b[2J\x1b[3J\x1b[H');
      
      // Replay history so user sees current state
      process.stdout.write(activeSession.getOutput());

      const disposable = activeSession.onData(data => {
        process.stdout.write(data);
      });
      return () => disposable.dispose();
    }
  }, [isAttached, activeSession]);

  useInput((input, key) => {
    if (isAttached) {
      // Check for Detach: Ctrl+q (0x11) OR (Ctrl + q flag)
      // Ink might parse it as ctrl+q or just give the raw input
      if (input === '\x11' || (key.ctrl && input === 'q')) {
         setIsAttached(false);
         return;
      }

      // Pass raw input to PTY
      if (activeSession) {
        // Fallback for special keys if input is empty
        if (!input) {
            if (key.upArrow) input = '\x1b[A';
            else if (key.downArrow) input = '\x1b[B';
            else if (key.leftArrow) input = '\x1b[D';
            else if (key.rightArrow) input = '\x1b[C';
            else if (key.return) input = '\r';
            else if (key.backspace) input = '\x08';
            else if (key.delete) input = '\x7f';
            else if (key.escape) input = '\x1b';
            else if (key.tab) input = '\t';
        }
        
        if (input) {
             activeSession.write(input);
        }
      }
      return;
    }
    
    // Modal for selecting task
    if (isSelectingTask) {
        if (key.escape || key.q) {
            setIsSelectingTask(false);
            return;
        }
        
        // Number selection (1-9)
        const num = parseInt(input);
        if (!isNaN(num) && num > 0) {
            const adapters = registry.getAllAdapters().filter(a => !!a.getLaunchConfig);
            const agents = config.agents || [];
            
            // Allow selecting from Adapters AND Configured Agents
            // List logic: Adapters first, then Agents
            const totalOptions = adapters.length + agents.length;
            
            if (num <= totalOptions) {
                 if (num <= adapters.length) {
                     // Selected an Adapter
                     const adapter = adapters[num - 1];
                     if (adapter && adapter.getLaunchConfig) {
                        adapter.getLaunchConfig().then(launchConfig => {
                            processManager.spawn(launchConfig.command, launchConfig.args, launchConfig.cwd || process.cwd());
                            setIsSelectingTask(false);
                            setTimeout(() => setSelectedIndex(prev => processManager.list().length - 1), 50);
                        });
                     }
                 } else {
                     // Selected an Agent
                     const agentIndex = num - adapters.length - 1;
                     const agent = agents[agentIndex];
                     if (agent) {
                        processManager.spawn(agent.command, agent.args || [], agent.cwd || process.cwd());
                        setIsSelectingTask(false);
                        setTimeout(() => setSelectedIndex(prev => processManager.list().length - 1), 50);
                     }
                 }
            }
        }
        return;
    }

    // Dashboard Navigation
    if (key.q) {
      exit();
      return;
    }

    if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1));
    }

    if (key.downArrow) {
      setSelectedIndex(prev => (prev < sessions.length - 1 ? prev + 1 : 0));
    }

    if (key.return) {
      if (activeSession) {
        setIsAttached(true);
      }
    }
    
    // Spawn Task Shortcut
    if (input === 't') {
        setIsSelectingTask(true);
    }
  });

  if (isSelectingTask) {
       const adapters = registry.getAllAdapters().filter(a => !!a.getLaunchConfig);
       const agents = config.agents || [];
       
       return (
           <Box borderStyle="double" borderColor="yellow" flexDirection="column" padding={1}>
               <Text bold color="yellow">Select Tool to Launch:</Text>
               <Box flexDirection="column" marginTop={1}>
                   <Text bold underline>Adapters:</Text>
                   {adapters.map((a, i) => (
                       <Text key={a.name}>[{i + 1}] {a.name}</Text>
                   ))}
                   {adapters.length === 0 && <Text dimColor>No adapters available.</Text>}
               </Box>
               
               {agents.length > 0 && (
                   <Box flexDirection="column" marginTop={1}>
                       <Text bold underline>Custom Agents:</Text>
                       {agents.map((a, i) => (
                           <Text key={a.name}>[{adapters.length + i + 1}] {a.name}</Text>
                       ))}
                   </Box>
               )}
               
               <Box marginTop={1}><Text dimColor>Press number to select, Esc to cancel</Text></Box>
           </Box>
       );
  }

  return (
    <Box flexDirection="row" height={30}>
      {!isAttached && ( // Hide Sidebar when attached
         <Sidebar sessions={sessions} selectedIndex={selectedIndex} />
      )}
      <TerminalPane 
        session={activeSession} 
        isAttached={isAttached} 
        onDetach={() => setIsAttached(false)} 
      />
    </Box>
  );
};
