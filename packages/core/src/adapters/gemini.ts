import { join } from 'path';
import { homedir } from 'os';
import { type ToolAdapter } from './base';
import { type UnifiedConfig } from '../config/schema';

export class GeminiAdapter implements ToolAdapter {
  readonly name = 'gemini';
  readonly configPath = join(homedir(), '.gemini', 'settings.json');

  async detect(): Promise<boolean> {
    const { existsSync } = await import('node:fs');
    return existsSync(this.configPath);
  }

  transform(config: UnifiedConfig): any {
    const mcpServers: Record<string, any> = {};

    for (const server of config.mcp_servers) {
      // Look for tool-specific overrides for 'gemini'
      const toolSpecific = server.tool_specific?.[this.name] || {};
      
      if (server.type === 'stdio' || !server.type) {
        mcpServers[server.name] = {
          command: server.command,
          args: server.args,
          env: Object.keys(server.env).length > 0 ? server.env : undefined,
          ...toolSpecific,
        };
      } else if (server.type === 'http' || server.type === 'remote') {
        // Gemini uses 'url' for SSE
        mcpServers[server.name] = {
          url: server.url,
          ...toolSpecific,
        };
      }
    }

    return mcpServers;
  }

  async apply(config: UnifiedConfig): Promise<void> {
    const file = Bun.file(this.configPath);
    let fullConfig: any = {};
    
    if (await file.exists()) {
      try {
        fullConfig = JSON.parse(await file.text());
      } catch (e) {
        console.warn(`Failed to parse existing config at ${this.configPath}, starting fresh.`);
      }
    }

    fullConfig.mcpServers = this.transform(config);

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
      const mcpServers = toolConfig.mcpServers || {};
      
      const config: Partial<UnifiedConfig> = {
        mcp_servers: []
      };

      for (const [name, server] of Object.entries<any>(mcpServers)) {
        config.mcp_servers?.push({
          name,
          type: 'stdio',
          command: server.command || '',
          args: server.args || [],
          env: server.env || {},
          headers: {},
          tool_specific: {
            [this.name]: Object.fromEntries(
              Object.entries(server).filter(([key]) => !['command', 'args', 'env'].includes(key))
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
