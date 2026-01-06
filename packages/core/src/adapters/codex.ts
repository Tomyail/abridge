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
      
      mcpServers[server.name] = {
        type: server.type,
        url: server.url,
        headers: { ...(server.headers || {}), ...(toolSpecific.headers || {}) },
        command: server.command,
        args: server.args,
        env: Object.keys(server.env).length > 0 ? server.env : undefined,
        ...toolSpecific,
      };
    }

    return mcpServers;
  }

  async apply(config: UnifiedConfig): Promise<void> {
    const file = Bun.file(this.configPath);
    let fullConfig: any = {};
    
    if (await file.exists()) {
      try {
        fullConfig = parse(await file.text());
      } catch (e) {
        console.warn(`Failed to parse existing config at ${this.configPath}, starting fresh.`);
      }
    }

    fullConfig.mcp_servers = this.transform(config);

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
