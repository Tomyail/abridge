import { type ToolAdapter } from './base';
import { ClaudeCodeAdapter } from './claude';
import { CodexAdapter } from './codex';

export * from './base';
export * from './claude';
export * from './codex';

export class AdapterRegistry {
  private adapters: Map<string, ToolAdapter> = new Map();

  constructor() {
    this.register(new ClaudeCodeAdapter());
    this.register(new CodexAdapter());
  }

  register(adapter: ToolAdapter) {
    this.adapters.set(adapter.name, adapter);
  }

  getAdapter(name: string): ToolAdapter | undefined {
    return this.adapters.get(name);
  }

  getAllAdapters(): ToolAdapter[] {
    return Array.from(this.adapters.values());
  }
}

export const registry = new AdapterRegistry();
