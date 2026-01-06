#!/usr/bin/env bun
import React, { useState } from 'react';
import { render, Box, Text, Newline, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { runInit, runApply, runImport, runStatus, runSyncPush, runSyncPull } from './actions.js';

const COMMANDS = [
  { cmd: 'init', desc: 'Initialize configuration' },
  { cmd: 'import', desc: 'Import from tools' },
  { cmd: 'apply', desc: 'Apply configuration' },
  { cmd: 'status', desc: 'Check sync status' },
  { cmd: 'push', desc: 'Push to cloud' },
  { cmd: 'pull', desc: 'Pull from cloud' },
  { cmd: 'help', desc: 'Show help' },
  { cmd: 'exit', desc: 'Exit' },
];

const WelcomeScreen = () => {
  const [query, setQuery] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const suggestions = query.startsWith('/')
    ? COMMANDS.filter((c) => c.cmd.startsWith(query.slice(1)))
    : [];

  useInput((input, key) => {
    if (key.escape) {
      process.exit(0);
    }

    if (key.tab && suggestions.length > 0) {
      const currentSuggestion = suggestions[suggestionIndex];
      if (currentSuggestion) {
        setQuery('/' + currentSuggestion.cmd);
        setSuggestionIndex((suggestionIndex + 1) % suggestions.length);
      }
    }

    if (key.upArrow && suggestions.length > 0) {
      setSuggestionIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    }

    if (key.downArrow && suggestions.length > 0) {
      setSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    }
  });

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSuggestionIndex(0);
  };

  const handleSubmit = async (value: string) => {
    const command = value.trim().toLowerCase();
    
    if (command === '/exit' || command === '/quit') {
      process.exit(0);
    }

    if (command.startsWith('/')) {
      await handleCommand(command.slice(1));
    } else if (command.length > 0) {
      setQuery('');
    }
  };


  const handleCommand = async (cmd: string) => {
    switch (cmd) {
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
        console.log('\nAvailable commands: /init, /import, /apply, /status, /push, /pull, /help, /exit\n');
        break;
      default:
        console.log(`\nUnknown command: /${cmd}. Type /help for available commands.\n`);
        break;
    }
    setQuery('');
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
      
      <Box borderStyle="round" paddingX={1} borderColor="green">
        <Box marginRight={1}>
          <Text bold color="green">❯</Text>
        </Box>
        <TextInput
          value={query}
          onChange={handleQueryChange}
          onSubmit={handleSubmit}
          placeholder="input / "
        />
      </Box>

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

export const showWelcomeScreen = () => {
  render(<WelcomeScreen />);
};
