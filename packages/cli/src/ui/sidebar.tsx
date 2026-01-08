import React from 'react';
import { Box, Text } from 'ink';
import type { SerializedSession } from '@abridge/core';

interface SidebarProps {
  sessions: SerializedSession[];
  selectedIndex: number;
}

export const Sidebar = ({ sessions, selectedIndex }: SidebarProps) => {
  return (
    <Box flexDirection="column" width={30} paddingRight={1} borderStyle="single" borderColor="cyan">
      <Box marginBottom={1}>
        <Text bold>Processes</Text>
      </Box>
      
      {sessions.length === 0 ? (
        <Text dimColor>No active processes</Text>
      ) : (
        sessions.map((session, index) => {
          const isSelected = index === selectedIndex;
          const statusIcon = session.metadata.status === 'running' ? '🟢' : '⚪️';
          
          return (
            <Box key={session.id}>
              <Text color={isSelected ? 'magenta' : 'white'}>
                {isSelected ? '▸ ' : '  '}
                {statusIcon} {session.metadata.title}
              </Text>
            </Box>
          );
        })
      )}

      <Box marginTop={1}>
        <Text dimColor>
          [t] New Task
          {'\n'}[Enter] Attach
          {'\n'}[q] Quit (when detached)
        </Text>
      </Box>
    </Box>
  );
};
