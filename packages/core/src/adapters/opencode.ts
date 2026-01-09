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
      
      if (server.type === 'remote' || server.type === 'http' || toolSpecific.type === 'remote' || server.url) {
        const serverConfig: any = {
          type: 'remote',
          url: server.url || toolSpecific.url,
        };

        if (server.headers && Object.keys(server.headers).length > 0) {
          serverConfig.headers = { ...server.headers };
        }

        // Only allow specific properties for remote
        if (toolSpecific.enabled !== undefined) serverConfig.enabled = toolSpecific.enabled;
        if (toolSpecific.timeout !== undefined) serverConfig.timeout = toolSpecific.timeout;
        if (toolSpecific.oauth !== undefined) serverConfig.oauth = toolSpecific.oauth;

        mcp[server.name] = serverConfig;
      } else {
        const serverConfig: any = {
          type: 'local',
          command: [server.command, ...(server.args || [])],
        };
        
        // OpenCode uses 'environment' not 'env'
        if (server.env && Object.keys(server.env).length > 0) {
          serverConfig.environment = server.env;
        }

        // Only allow specific properties for local
        if (toolSpecific.enabled !== undefined) serverConfig.enabled = toolSpecific.enabled;
        if (toolSpecific.timeout !== undefined) serverConfig.timeout = toolSpecific.timeout;
        
        mcp[server.name] = serverConfig;
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
        const toolSpecific: any = {};
        if (server.enabled !== undefined) toolSpecific.enabled = server.enabled;
        if (server.timeout !== undefined) toolSpecific.timeout = server.timeout;

        if (server.type === 'remote') {
          if (server.oauth !== undefined) toolSpecific.oauth = server.oauth;

          config.mcp_servers?.push({
            name,
            type: 'remote',
            url: server.url,
            headers: server.headers || {},
            command: '',
            args: [],
            env: {},
            tool_specific: { [this.name]: toolSpecific }
          });
        } else {
          const cmdArray = Array.isArray(server.command) ? server.command : [server.command];
          config.mcp_servers?.push({
            name,
            type: 'stdio',
            command: cmdArray[0] || '',
            args: cmdArray.slice(1),
            env: server.environment || server.env || {},
            headers: {},
            tool_specific: { [this.name]: toolSpecific }
          });
        }
      }

      return config;
    } catch (error) {
      console.warn(`Failed to extract config from ${this.name}:`, error);
      return {};
    }
  }

  async launch(): Promise<void> {
    const { spawn } = await import('child_process');
    
    // Explicitly clean up TTY state before handing off
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();

    try {
      const child = spawn('opencode', [], { 
        stdio: 'inherit',
        env: process.env 
      });
      
      await new Promise<void>((resolve, reject) => {
        child.on('exit', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Process exited with code ${code}`));
        });
        child.on('error', reject);
      });
      console.clear(); 
    } catch (e) {
      console.error(`Failed to launch ${this.name}`, e);
      throw e;
    }
  }
}
