import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import type { SerializedSession } from '@abridge/core';

interface TerminalPaneProps {
  preview: string;
  isAttached: boolean;
  onDetach: () => void;
}

export const TerminalPane = ({ preview, isAttached, onDetach }: TerminalPaneProps) => {
  // We no longer need to poll for output locally; the parent (or daemon event) provides the snapshot.
  
  if (isAttached) {
    return (
      <Box flex={1}>
        <Text>Attached... (Press Ctrl+q to detach)</Text>
      </Box>
    );
  }

  return (
    <Box borderStyle="single" borderColor="green" flexDirection="column" flexGrow={1} paddingX={1}>
        <Text>{preview || 'Output Preview (Read-Only - Press Enter to Attach, Ctrl+q to Detach)'}</Text>
    </Box>
  );
};
