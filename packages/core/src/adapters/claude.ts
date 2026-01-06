import { join } from 'path';
import { homedir } from 'os';
import { type ToolAdapter } from './base';
import { type UnifiedConfig } from '../config/schema';

export class ClaudeCodeAdapter implements ToolAdapter {
  readonly name = 'claude-code';
  // Check both legacy and new monolithic path
  readonly configPath = join(homedir(), '.claude.json');
  readonly legacyPath = join(homedir(), '.claude', 'config.json');

  async detect(): Promise<boolean> {
    const { existsSync } = await import('node:fs');
    return existsSync(this.configPath) || existsSync(this.legacyPath);
  }

  private async getActiveConfigPath(): Promise<string> {
    const { existsSync } = await import('node:fs');
    if (existsSync(this.configPath)) return this.configPath;
    return this.legacyPath;
  }

  transform(config: UnifiedConfig): any {
    const mcpServers: Record<string, any> = {};

    for (const server of config.mcp_servers) {
      const toolSpecific = server.tool_specific?.[this.name] || {};
      
      // Handle different types of MCP servers (stdio is default)
      if (toolSpecific.type === 'http' || (toolSpecific.url && !server.command)) {
        mcpServers[server.name] = {
          type: 'http',
          url: toolSpecific.url,
          headers: toolSpecific.headers || {},
          ...toolSpecific,
        };
      } else {
        mcpServers[server.name] = {
          type: 'stdio',
          command: server.command,
          args: server.args,
          env: server.env,
          ...toolSpecific,
        };
      }
    }

    return mcpServers;
  }

  async apply(config: UnifiedConfig): Promise<void> {
    const path = await this.getActiveConfigPath();
    const file = Bun.file(path);
    let fullConfig: any = {};
    
    if (await file.exists()) {
      try {
        fullConfig = JSON.parse(await file.text());
      } catch (e) {
        console.warn(`Failed to parse existing config at ${path}, starting fresh.`);
      }
    }

    const mcpServers = this.transform(config);
    
    // In monolithic .claude.json, mcpServers is top-level
    if (path.endsWith('.claude.json')) {
      fullConfig.mcpServers = mcpServers;
    } else {
      // Legacy style often wrapped in an object
      fullConfig = { mcpServers };
    }

    await Bun.write(path, JSON.stringify(fullConfig, null, 2));
  }

  async extract(): Promise<Partial<UnifiedConfig>> {
    const path = await this.getActiveConfigPath();
    const file = Bun.file(path);
    if (!(await file.exists())) {
      return {};
    }

    try {
      const content = await file.text();
      const toolConfig = JSON.parse(content);
      // It handles both { mcpServers: ... } and monolithic structure
      // In monolithic .claude.json, mcpServers is a top-level property
      const mcpServers = toolConfig.mcpServers;
      
      if (!mcpServers || typeof mcpServers !== 'object') return {};

      const config: Partial<UnifiedConfig> = {
        mcp_servers: []
      };

      for (const [name, server] of Object.entries<any>(mcpServers)) {
        if (server.type === 'http') {
          config.mcp_servers?.push({
            name,
            command: '', 
            args: [],
            env: {},
            tool_specific: {
              [this.name]: { ...server }
            }
          });
        } else {
          config.mcp_servers?.push({
            name,
            command: server.command || '',
            args: server.args || [],
            env: server.env || {},
            tool_specific: {
              [this.name]: Object.fromEntries(
                Object.entries(server).filter(([key]) => !['command', 'args', 'env'].includes(key))
              )
            }
          });
        }
      }

      return config;
    } catch (error) {
      console.warn(`Failed to extract config from ${this.name}:`, error);
      return {};
    }
  }
}
