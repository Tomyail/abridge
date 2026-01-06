import { type ToolAdapter } from './base';
import { ClaudeCodeAdapter } from './claude';

export * from './base';
export * from './claude';

export class AdapterRegistry {
  private adapters: Map<string, ToolAdapter> = new Map();

  constructor() {
    this.register(new ClaudeCodeAdapter());
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
