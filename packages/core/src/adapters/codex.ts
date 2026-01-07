import { join } from 'path';
import { homedir } from 'os';
import { type ToolAdapter } from './base';
import { type UnifiedConfig } from '../config/schema';
import { parse, stringify } from 'smol-toml';

export class CodexAdapter implements ToolAdapter {
  readonly name = 'codex';
  readonly configPath = join(homedir(), '.codex', 'config.toml');

  async detect(): Promise<boolean> {
    const { existsSync } = await import('node:fs');
    const dir = join(homedir(), '.codex');
    return existsSync(dir);
  }

  transform(config: UnifiedConfig): any {
    const mcpServers: Record<string, any> = {};

    for (const server of config.mcp_servers) {
      const toolSpecific = server.tool_specific?.[this.name] || {};
      
      if (server.type === 'stdio') {
        mcpServers[server.name] = {
          type: 'stdio',
          command: server.command,
          args: server.args,
          env: Object.keys(server.env).length > 0 ? server.env : undefined,
          ...toolSpecific,
        };
      } else {
        // Assume 'sse' or 'http' (remote)
        mcpServers[server.name] = {
          type: 'sse', 
          url: server.url,
          headers: { ...(server.headers || {}), ...(toolSpecific.headers || {}) },
          ...toolSpecific,
        };
      }
    }

    return mcpServers;
  }

  async apply(config: UnifiedConfig): Promise<void> {
    const file = Bun.file(this.configPath);
    let fullConfig: any = {};
    
    let existingMcpServers: any = {};

    if (await file.exists()) {
      try {
        const text = await file.text();
        fullConfig = parse(text);
        existingMcpServers = fullConfig.mcp_servers || {};
      } catch (e) {
        console.warn(`Failed to parse existing config at ${this.configPath}, starting fresh.`);
      }
    }

    const newMcpServers = this.transform(config);

    // Merge strategy: Preserve existing environment variables if not specified in new config
    // This allows tool-managed auth tokens (like GITHUB_TOKEN) to survive 'abridge apply'
    for (const [name, newServer] of Object.entries<any>(newMcpServers)) {
      const oldServer = existingMcpServers[name];
      if (oldServer && oldServer.env) {
        newServer.env = { ...oldServer.env, ...(newServer.env || {}) };
      }
    }

    fullConfig.mcp_servers = newMcpServers;

    await Bun.write(this.configPath, stringify(fullConfig));
  }

  async extract(): Promise<Partial<UnifiedConfig>> {
    const file = Bun.file(this.configPath);
    if (!(await file.exists())) {
      return {};
    }

    try {
      const content = await file.text();
      const toolConfig = parse(content) as any;
      const mcpServers = toolConfig.mcp_servers || {};
      
      const config: Partial<UnifiedConfig> = {
        mcp_servers: []
      };

      for (const [name, server] of Object.entries<any>(mcpServers)) {
        config.mcp_servers?.push({
          name,
          type: server.type || (server.url ? 'http' : 'stdio'),
          url: server.url,
          headers: server.headers || {},
          command: server.command || '',
          args: server.args || [],
          env: server.env || {},
          tool_specific: {
            [this.name]: Object.fromEntries(
              Object.entries(server).filter(([key]) => !['command', 'args', 'env', 'type', 'url', 'headers'].includes(key))
            )
          }
        });
      }

      return config;
    } catch (error) {
      console.warn(`Failed to extract config from ${this.name}:`, error);
      return {};
    }
  }
}
