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
      
      // Handle different types of MCP servers
      if (server.type === 'http' || toolSpecific.type === 'http' || server.url) {
        mcpServers[server.name] = {
          type: 'http',
          url: server.url || toolSpecific.url,
          headers: { ...(server.headers || {}), ...(toolSpecific.headers || {}) },
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
            type: 'http',
            url: server.url,
            headers: server.headers || {},
            command: '', 
            args: [],
            env: {},
            tool_specific: {
              [this.name]: Object.fromEntries(
                Object.entries(server).filter(([key]) => !['type', 'url', 'headers'].includes(key))
              )
            }
          });
        } else {
          config.mcp_servers?.push({
            name,
            type: 'stdio',
            command: server.command || '',
            args: server.args || [],
            env: server.env || {},
            headers: {},
            tool_specific: {
              [this.name]: Object.fromEntries(
                Object.entries(server).filter(([key]) => !['command', 'args', 'env', 'type', 'headers'].includes(key))
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

  async launch(): Promise<void> {
    const { spawn } = await import('child_process');
    
    // Explicitly clean up TTY state before handing off
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();

    try {
      const child = spawn('claude', [], { 
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

  async getLaunchConfig(): Promise<{ command: string; args: string[]; cwd?: string }> {
      const { execSync } = await import('child_process');
      const { existsSync, realpathSync } = await import('node:fs');
      const { join } = await import('path');
      const os = await import('os');

      // Helper to try resolving path
      const resolveSafe = (p: string) => {
          if (!existsSync(p)) return null;
          try { return realpathSync(p); } catch { return p; }
      };

      // 1. Check NPM Global
      try {
          const globalRoot = execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
          const npmCli = join(globalRoot, '@anthropic-ai', 'claude-code', 'cli.js');
          if (existsSync(npmCli)) {
              return { command: 'node', args: [npmCli] };
          }
      } catch (e) { /* ignore */ }

      // 2. Check Homebrew (macOS)
      if (process.platform === 'darwin') {
          const prefixes = ['/opt/homebrew', '/usr/local'];
          for (const prefix of prefixes) {
              const bin = join(prefix, 'bin', 'claude');
              const resolved = resolveSafe(bin);
              if (resolved) return { command: resolved, args: [] };
          }
      }

      // 3. Check Native Installer (~/.local/bin/claude)
      const localBin = join(os.homedir(), '.local', 'bin', 'claude');
      const resolvedLocal = resolveSafe(localBin);
      if (resolvedLocal) return { command: resolvedLocal, args: [] };

      // 4. Check PATH
      try {
          const pathBin = execSync('which claude', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
          if (pathBin && existsSync(pathBin)) {
               return { command: pathBin, args: [] };
          }
      } catch (e) { /* ignore */ }

      // 5. Fallback
      return {
          command: 'npx',
          args: ['claude', 'code'], 
      };
  }
}
