
import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Session } from '@abridge/core';

interface TerminalPaneProps {
  session: Session | undefined;
  isAttached: boolean;
  onDetach: () => void;
}

export const TerminalPane = ({ session, isAttached, onDetach }: TerminalPaneProps) => {
  const [output, setOutput] = useState('');

  // Periodically refresh the view when NOT attached (Preview Mode)
  useEffect(() => {
    if (!session) return;
    if (isAttached) return; // Attached mode doesn't use this view loop

    const timer = setInterval(() => {
      // Get output for preview
      const logs = session.getOutput();
      setOutput(logs);
    }, 100);

    return () => clearInterval(timer);
  }, [session, isAttached]);

  // Handle Input when Attached
  // NOTE: Ink's useInput only works when Node's stdin IS in raw mode.
  // But when we "Attach", we want to pipe stdin DIRECTLY to pty.
  // So likely the logic should be in the parent (App.tsx) to completely bypass Ink.
  
  if (!session) {
    return (
      <Box borderStyle="single" borderColor="gray" flex={1} alignItems="center" justifyContent="center">
        <Text dimColor>Select a process to view logs</Text>
      </Box>
    );
  }

  if (isAttached) {
    return (
      <Box flex={1}>
        <Text>Attached to {session.metadata.title}... (Press Ctrl+q to detach)</Text>
      </Box>
    );
  }

  return (
    <Box borderStyle="single" borderColor="green" flexDirection="column" flexGrow={1} paddingX={1}>
        <Text>{session ? session.getOutput() : 'Output Preview (Read-Only - Press Enter to Attach, Ctrl+q to Detach)'}</Text>
    </Box>
  );
};
