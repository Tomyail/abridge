import { type UnifiedConfig, type McpServer } from '../config/schema';

export function mergeConfigs(current: UnifiedConfig, incoming: Partial<UnifiedConfig>): UnifiedConfig {
  const merged: UnifiedConfig = { ...current };

  if (incoming.mcp_servers) {
    const existingServers = new Map(current.mcp_servers.map(s => [s.name, s]));
    
    for (const incomingServer of incoming.mcp_servers) {
      const existing = existingServers.get(incomingServer.name);
      if (existing) {
        // Merge server info
        existingServers.set(incomingServer.name, {
          ...existing,
          type: incomingServer.type || existing.type,
          url: incomingServer.url || existing.url,
          headers: { ...existing.headers, ...incomingServer.headers },
          command: incomingServer.command || existing.command,
          args: incomingServer.args || existing.args,
          env: { ...existing.env, ...incomingServer.env },
          tool_specific: {
            ...existing.tool_specific,
            ...incomingServer.tool_specific
          }
        });
      } else {
        existingServers.set(incomingServer.name, incomingServer as McpServer);
      }
    }
    
    merged.mcp_servers = Array.from(existingServers.values());
  }

  // Add more merge logic for skills etc later
  return merged;
}
