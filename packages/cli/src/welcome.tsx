#!/usr/bin/env bun
import React, { useState, useEffect } from 'react';
import { render, Box, Text, Newline, useInput } from 'ink';

const WelcomeScreen = () => {
  const [selected, setSelected] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelected((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (key.downArrow) {
      setSelected((prev) => (prev < 4 ? prev + 1 : prev));
    } else if (key.return) {
      handleSelection(selected);
      process.exit(0);
    } else if (key.escape || input === 'q') {
      process.exit(0);
    }
  });

  const handleSelection = (index: number) => {
    switch (index) {
      case 0:
        console.log('\nRunning: abridge init\n');
        break;
      case 1:
        console.log('\nRunning: abridge import\n');
        break;
      case 2:
        console.log('\nRunning: abridge apply\n');
        break;
      case 3:
        console.log('\nRunning: abridge sync status\n');
        break;
      case 4:
        console.log('\nExiting...\n');
        break;
    }
  };

  const options = [
    { label: 'Initialize configuration', cmd: 'init' },
    { label: 'Import from tools', cmd: 'import' },
    { label: 'Apply configuration', cmd: 'apply' },
    { label: 'Check sync status', cmd: 'sync status' },
    { label: 'Exit', cmd: '' },
  ];

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
      <Box marginBottom={1}>
        <Text bold color="yellow">Select an action:</Text>
      </Box>
      <Newline />
      {options.map((option, index) => (
        <Box key={index}>
          <Text
            color={selected === index ? 'green' : 'white'}
            bold={selected === index}
          >
            {selected === index ? '▸ ' : '  '}
            {index + 1}. {option.label}
          </Text>
        </Box>
      ))}
      <Newline />
      <Box>
        <Text dimColor>
          Use ↑/↓ to navigate, Enter to select, q/Esc to quit
        </Text>
      </Box>
    </Box>
  );
};

export const showWelcomeScreen = () => {
  render(<WelcomeScreen />);
};
