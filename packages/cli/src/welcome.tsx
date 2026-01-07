/**
 * Welcome screen implementation using Ink (React-based TUI)
 */
import React, { useState } from 'react';
import { render, Box, Text, Newline, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { registry } from '@abridge/core';
import { runInit, runApply, runImport, runStatus, runSyncPush, runSyncPull } from './actions.js';

const COMMANDS = [
  { cmd: 'launch', desc: 'Launch tools (e.g. Claude Code)' },
  { cmd: 'init', desc: 'Initialize configuration' },
  { cmd: 'import', desc: 'Import from tools' },
  { cmd: 'apply', desc: 'Apply configuration' },
  { cmd: 'status', desc: 'Check sync status' },
  { cmd: 'push', desc: 'Push to cloud' },
  { cmd: 'pull', desc: 'Pull from cloud' },
  { cmd: 'help', desc: 'Show help' },
  { cmd: 'ui', desc: 'Open Workspace Dashboard' },
  { cmd: 'exit', desc: 'Exit' },
];

export type AppAction = 
  | { type: 'exit' }
  | { type: 'launch'; toolId: string }
  | { type: 'ui' } // New action
  | { type: 'run'; cmd: string };

interface LaunchableTool {
  name: string;
  id: string;
}

const getLaunchableTools = (): LaunchableTool[] => {
  return registry.getAllAdapters()
    .filter(adapter => typeof adapter.launch === 'function')
    .map(adapter => ({
      name: adapter.name,
      id: adapter.name 
    }));
};

const WelcomeScreen = ({ onAction }: { onAction: (action: AppAction) => void }) => {
  const [tools] = useState(getLaunchableTools());
  const [query, setQuery] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [isLaunchMode, setIsLaunchMode] = useState(false);
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);
  const [inputKey, setInputKey] = useState(0); // Used to reset TextInput cursor

  let suggestions: { cmd: string, desc: string }[] = [];
  if (!isLaunchMode && query.startsWith('/')) {
    const inputCmd = query.slice(1).toLowerCase();
    
    // 1. Standard commands
    suggestions = COMMANDS.filter((c) => c.cmd.startsWith(inputCmd));

    // 2. Launch arguments
    if (inputCmd.startsWith('launch ')) {
      const arg = inputCmd.slice(7).trim(); // remove "launch "
      const toolMatches = tools.filter(t => 
         t.id.includes(arg) || t.name.toLowerCase().includes(arg)
      );
      
      const toolSuggestions = toolMatches.map(t => ({
         cmd: `launch ${t.id}`, 
         desc: `Launch ${t.name}`
      }));
      
      suggestions = [...suggestions, ...toolSuggestions];
    }
  }

  useInput((_input: string, key) => {
    if (key.escape) {
      if (isLaunchMode) {
        setIsLaunchMode(false);
        setQuery('');
      } else {
        onAction({ type: 'exit' });
      }
    }

    if (isLaunchMode) {
       if (key.upArrow) {
         setSelectedToolIndex((prev: number) => (prev > 0 ? prev - 1 : tools.length - 1));
       }
       if (key.downArrow) {
         setSelectedToolIndex((prev: number) => (prev < tools.length - 1 ? prev + 1 : 0));
       }
       if (key.return) {
          const toolId = tools[selectedToolIndex].id;
          setIsLaunchMode(false);
          setQuery(''); // Reset for next render
          onAction({ type: 'launch', toolId });
       }
       return;
    }

    if (key.tab && suggestions.length > 0) {
      const currentSuggestion = suggestions[suggestionIndex];
      if (currentSuggestion) {
        setQuery('/' + currentSuggestion.cmd);
        setSuggestionIndex((suggestionIndex + 1) % suggestions.length);
        setInputKey((prev: number) => prev + 1); // Force remount to move cursor to end
      }
    }

    if (key.upArrow && suggestions.length > 0) {
      setSuggestionIndex((prev: number) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    }

    if (key.downArrow && suggestions.length > 0) {
      setSuggestionIndex((prev: number) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    }
  });

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSuggestionIndex(0);
  };

  const handleCommand = async (cmd: string, args: string[] = []) => {
    switch (cmd) {
      case 'launch':
        if (args.length > 0) {
          const toolName = args.join(' ').toLowerCase(); 
          const tool = tools.find(t => t.id === toolName || t.name.toLowerCase().includes(toolName));
          if (tool) {
            onAction({ type: 'launch', toolId: tool.id });
          } else {
             console.log(`\nTool '${toolName}' not found. Entering launch mode...\n`);
             setIsLaunchMode(true);
             setQuery('');
             return; // Don't clear query
          }
        } else {
          setIsLaunchMode(true);
          setQuery(''); 
          return; // Don't clear query
        }
        break;
      case 'init':
        await runInit();
        break;
      case 'import':
        await runImport();
        break;
      case 'apply':
        await runApply();
        break;
      case 'status':
        await runStatus();
        break;
      case 'push':
        await runSyncPush();
        break;
      case 'pull':
        await runSyncPull();
        break;
      case 'help':
        console.log('\nAvailable commands: /launch, /init, /import, /apply, /status, /push, /pull, /help, /exit\n');
        break;
      case 'exit':
      case 'quit':
        onAction({ type: 'exit' });
        return;
      default:
        console.log(`\nUnknown command: /${cmd}. Type /help for available commands.\n`);
        break;
    }
    setQuery('');
  };

  const handleSubmit = async (value: string) => {
    const command = value.trim().toLowerCase();
    
    if (command === '/exit' || command === '/quit') {
      onAction({ type: 'exit' });
      return;
    }
    
    if (isLaunchMode) return;

    if (command.startsWith('/')) {
      const parts = command.slice(1).split(' ');
      const cmdName = parts[0];
      const args = parts.slice(1);
      if (cmdName) {
         await handleCommand(cmdName, args);
      }
    } else if (command.length > 0) {
      setQuery('');
    }
  };

  return (
    <Box flexDirection="column" paddingX={2}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          ╔════════════════════════════════════════════════════╗
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          ║             🌉  Abridge  -  Agent Bridge            ║
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          ╚════════════════════════════════════════════════════╝
        </Text>
      </Box>
      <Newline />
      <Box marginBottom={1}>
        <Text dimColor>
          Unified AI Tools Manager - Manage your MCP configurations
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text dimColor>
          across Claude Code, Codex, OpenCode, and more
        </Text>
      </Box>
      <Newline />
      
      <Box borderStyle="round" paddingX={1} borderColor={isLaunchMode ? "magenta" : "green"}>
        <Box marginRight={1}>
          <Text bold color={isLaunchMode ? "magenta" : "green"}>{isLaunchMode ? "🚀" : "❯"}</Text>
        </Box>
        {isLaunchMode ? (
           <Text>Select tool to launch (Up/Down/Enter)</Text>
        ) : (
          <TextInput
            key={inputKey.toString()}
            value={query}
            onChange={handleQueryChange}
            onSubmit={handleSubmit}
            placeholder="input / "
          />
        )}
      </Box>

      {isLaunchMode && (
        <Box flexDirection="column" marginTop={1} paddingLeft={1}>
          {tools.map((t, i) => (
             <Box key={t.id}>
               <Text color={i === selectedToolIndex ? 'magenta' : 'dimColor'}>
                 {i === selectedToolIndex ? '▸ ' : '  '}
                 <Text bold color={i === selectedToolIndex ? 'magenta' : 'white'}>
                   {t.name}
                 </Text>
               </Text>
             </Box>
          ))}
        </Box>
      )}

      {suggestions.length > 0 && (
        <Box flexDirection="column" marginTop={1} paddingLeft={1}>
          {suggestions.map((s, i) => (
            <Box key={s.cmd}>
              <Text color={i === suggestionIndex ? 'cyan' : 'dimColor'}>
                {i === suggestionIndex ? '▸ ' : '  '}
                <Text bold color={i === suggestionIndex ? 'cyan' : 'white'}>
                  /{s.cmd}
                </Text>{' '}
                <Text dimColor>- {s.desc}</Text>
              </Text>
            </Box>
          ))}
        </Box>
      )}

      <Newline />

      <Box>
        <Text dimColor>
          Type <Text color="yellow" bold>/</Text> for commands, Esc to quit
        </Text>
      </Box>
    </Box>
  );
};

export const showWelcomeScreen = async (): Promise<AppAction> => {
  return new Promise((resolve) => {
    const { unmount } = render(<WelcomeScreen onAction={(action) => {
      setTimeout(() => {
        unmount();
        resolve(action);
      }, 50);
    }} />);
  });
};
