import React, { useState, useEffect, useRef } from 'react';
import { Box, useInput, useApp, type Key } from 'ink';
import { Sidebar } from './sidebar';
import { TerminalPane } from './terminal-pane';
import { processManager, type DaemonClient, type SerializedSession, registry, type UnifiedConfig } from '@abridge/core';
import type { Socket } from 'net';
import { Text } from 'ink';

interface AppProps {
  config: UnifiedConfig;
  client: DaemonClient;
  initialTool?: string;
}

export const App = ({ config, client, initialTool }: AppProps) => {
  const { exit } = useApp();
  const [sessions, setSessions] = useState<SerializedSession[]>([]);
  const hasLaunchedRef = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAttached, setIsAttached] = useState(false);
  const [isSelectingTask, setIsSelectingTask] = useState(false);
  
  // Derived state
  const activeSession = sessions[selectedIndex];
  
  // Subscribe to process updates (Event-Driven)
  useEffect(() => {
    const update = (list: SerializedSession[]) => setSessions(list);
    client.on('change', update);
    // Initial fetch
    client.list().then(setSessions).catch(console.error);
    return () => {
        client.off('change', update);
    };
  }, [client]);

  // Auto-switch to new session
  const prevSessionsLengthRef = useRef(0);
  useEffect(() => {
     if (sessions.length > prevSessionsLengthRef.current) {
         setSelectedIndex(sessions.length - 1);
     }
     prevSessionsLengthRef.current = sessions.length;
  }, [sessions]);

  // Handle Initial Launch
  useEffect(() => {
      if (initialTool && !hasLaunchedRef.current) {
          hasLaunchedRef.current = true;
          
          const spawnTool = async () => {
              const adapters = registry.getAllAdapters();
              const agents = config.agents || [];
              
              // 1. Try Adapters
              const adapter = adapters.find(a => a.name === initialTool);
              if (adapter && adapter.getLaunchConfig) {
                  const launchConfig = await adapter.getLaunchConfig();
                  await client.spawn(launchConfig.command, launchConfig.args, launchConfig.cwd || process.cwd());
                  return;
              }
              
              // 2. Try Agents
              const agent = agents.find(a => a.name === initialTool);
              if (agent) {
                  await client.spawn(agent.command, agent.args || [], agent.cwd || process.cwd());
                  return;
              }
              
              console.warn(`Tool "${initialTool}" not found for auto-launch.`);
          };
          
          spawnTool().catch(console.error);
      }
  }, [initialTool, client, config]);


  useInput((input, key) => {
    if (isAttached) {
      // CHECK FOR DETACH
      if (input === '\x11' || (key.ctrl && input === 'q')) {
         setIsAttached(false);
         return;
      }

      // If attached, pass EVERYTHING to the socket if it exists
      // We can't access `socket` here easily via closure because `useInput` closure 
      // might be stale? No, it should be fine if we use a ref or just rely on state?
      // Actually `useInput` callback runs on every key. 
      // The socket is internal to the effect... tricky.
      // We need to store the active socket in a Ref.
    }
    
    // ... (rest of logic) ...
  });
  
  // REFACTOR: We need a Ref for the socket to write to it from useInput
  const activeSocketRef = useRef<Socket | null>(null);
  
  useEffect(() => {
    if (isAttached && activeSession) {
         client.attach(activeSession.id).then(sock => {
            activeSocketRef.current = sock;
            // CLEAR SCREEN on attach
            process.stdout.write('\x1b[2J\x1b[3J\x1b[H');
            
            // Pipe output
            sock.on('data', d => process.stdout.write(d));
            
            // Clean up:
            sock.on('close', () => {
                if (isAttached) setIsAttached(false);
            });
         }).catch(err => {
             console.error("Failed to attach:", err);
             setIsAttached(false);
         });
         
         return () => {
             activeSocketRef.current?.destroy();
             activeSocketRef.current = null;
         };
    }
  }, [isAttached, activeSession?.id, client]);

  useInput((input, key) => {
     if (isAttached) {
         if (input === '\x11' || (key.ctrl && input === 'q')) {
             setIsAttached(false);
             return;
         }
         
         const sock = activeSocketRef.current;
         if (sock && !sock.destroyed) {
            if (!input) {
                // ... key mapping ...
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
            if (input) sock.write(input);
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
            const totalOptions = adapters.length + agents.length;
            
            if (num <= totalOptions) {
                 if (num <= adapters.length) {
                     const adapter = adapters[num - 1];
                     if (adapter && adapter.getLaunchConfig) {
                        adapter.getLaunchConfig().then(launchConfig => {
                            client.spawn(launchConfig.command, launchConfig.args, launchConfig.cwd || process.cwd());
                            setIsSelectingTask(false);
                        });
                     }
                 } else {
                     const agentIndex = num - adapters.length - 1;
                     const agent = agents[agentIndex];
                     if (agent) {
                        client.spawn(agent.command, agent.args || [], agent.cwd || process.cwd());
                        setIsSelectingTask(false);
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
    
    // Kill Task Shortcut
    if (input === 'x') {
        if (activeSession) {
            client.kill(activeSession.id).catch(console.error);
        }
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
  
  // NEED TO UPDATE TerminalPane to assume string preview, AND Sidebar to use SerializedSession
  // But wait, TerminalPane expects a `Session` object with `term` prop?
  // Previous TerminalPane used `session.term` for "virtual preview"?
  // Ah, `TerminalPane` uses `session.getOutput()` usually.
  // But `session.term` was used for... what?
  // Phase 2 implementation used `getOutput()` which scraped `session.term`.
  // Now `getOutput()` is gone, we have `session.preview`.
  
  // So I need to update `Sidebar` and `TerminalPane` signatures too.
  
  return (
    <Box flexDirection="row" height={30}>
      {!isAttached && ( // Hide Sidebar when attached
         <Sidebar sessions={sessions as any} selectedIndex={selectedIndex} /> 
      )}
      <TerminalPane 
        preview={activeSession?.preview || ''} 
        isAttached={isAttached} 
        onDetach={() => setIsAttached(false)} 
      />
    </Box>
  );
};
