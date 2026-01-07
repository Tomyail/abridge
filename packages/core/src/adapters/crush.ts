import { join } from 'path';
import { homedir } from 'os';
import { type ToolAdapter } from './base';
import { type UnifiedConfig } from '../config/schema';

export class CrushAdapter implements ToolAdapter {
  readonly name = 'crush';
  readonly configPath = join(homedir(), '.config', 'crush', 'crush.json');

  async detect(): Promise<boolean> {
    const { existsSync } = await import('node:fs');
    const dir = join(homedir(), '.config', 'crush');
    return existsSync(dir);
  }

  // Crush uses a different format, but for now we assume it might support `mcp_servers` or similar in future
  // or we map it to `providers` if applicable.
  // For this initial implementation, we'll focus on launch() and basic config stubbing.
  // Real config sync would require mapping unified config to Crush's `providers` array.
  
  transform(config: UnifiedConfig): any {
    // Placeholder: Crush config structure is different (providers array).
    // We need more research to map MCP servers to Crush providers properly.
    // For now, we return empty object to avoid breaking.
    return {}; 
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

    // Logic to apply unified config to Crush config would go here.
    // For now, we perform a no-op update to ensure file exists if needed.
    // fullConfig.mcp_servers = this.transform(config); 

    // Ensure directory exists
    const dir = join(homedir(), '.config', 'crush');
    const { mkdirSync, existsSync } = await import('node:fs');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

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
      // Logic to extract unified config from Crush config would go here.
      return { mcp_servers: [] };
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
      // Trying 'crush' command. User might need to alias it or have it in PATH.
      // Based on charmbracelet tools, binary is usually 'crush'.
      const child = spawn('crush', [], { 
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
      return {
          command: 'crush',
          args: [],
      };
  }
}
