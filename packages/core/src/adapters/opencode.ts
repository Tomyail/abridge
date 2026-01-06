import { join } from 'path';
import { homedir } from 'os';
import { type ToolAdapter } from './base';
import { type UnifiedConfig } from '../config/schema';

export class OpenCodeAdapter implements ToolAdapter {
  readonly name = 'opencode';
  readonly configPath = join(homedir(), '.config', 'opencode', 'opencode.json');

  async detect(): Promise<boolean> {
    const { existsSync } = await import('node:fs');
    const dir = join(homedir(), '.config', 'opencode');
    return existsSync(dir);
  }

  transform(config: UnifiedConfig): any {
    const mcp: Record<string, any> = {};

    for (const server of config.mcp_servers) {
      const toolSpecific = server.tool_specific?.[this.name] || {};
      
      // OpenCode prefers array command format
      // If tool-specific has type 'remote', use that
      if (toolSpecific.type === 'remote' || toolSpecific.url) {
        mcp[server.name] = {
          type: 'remote',
          url: toolSpecific.url,
          ...toolSpecific,
        };
      } else {
        mcp[server.name] = {
          type: 'local',
          command: [server.command, ...(server.args || [])],
          env: Object.keys(server.env).length > 0 ? server.env : undefined,
          ...toolSpecific,
        };
      }
    }

    return mcp;
  }

  async apply(config: UnifiedConfig): Promise<void> {
    const file = Bun.file(this.configPath);
    let fullConfig: any = {
      "$schema": "https://opencode.ai/config.json"
    };
    
    if (await file.exists()) {
      try {
        fullConfig = JSON.parse(await file.text());
      } catch (e) {
        console.warn(`Failed to parse existing config at ${this.configPath}, starting fresh.`);
      }
    }

    fullConfig.mcp = this.transform(config);

    await Bun.write(this.configPath, JSON.stringify(fullConfig, null, 2));
  }

  async extract(): Promise<Partial<UnifiedConfig>> {
    const file = Bun.file(this.configPath);
    if (!(await file.exists())) {
      return {};
    }

    try {
      const content = await file.text();
      const toolConfig = JSON.parse(content);
      const mcpServers = toolConfig.mcp || {};
      
      const config: Partial<UnifiedConfig> = {
        mcp_servers: []
      };

      for (const [name, server] of Object.entries<any>(mcpServers)) {
        if (server.type === 'remote') {
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
          // Local server: command is often an array [cmd, ...args]
          const cmdArray = Array.isArray(server.command) ? server.command : [server.command];
          config.mcp_servers?.push({
            name,
            command: cmdArray[0] || '',
            args: cmdArray.slice(1),
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
