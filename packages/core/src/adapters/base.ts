import { type UnifiedConfig } from '../config/schema';

export interface ToolAdapter {
  readonly name: string;
  readonly configPath: string;
  
  /**
   * Transforms the unified config into the tool-specific configuration format.
   */
  transform(config: UnifiedConfig): any;
  
  /**
   * Applies the configuration to the tool's config file.
   */
  apply(config: UnifiedConfig): Promise<void>;
  
  /**
   * Detects if the tool is installed on the system.
   */
  detect(): Promise<boolean>;

  /**
   * Extracts current configuration from the tool and converts it to partial unified config.
   */
  extract(): Promise<Partial<UnifiedConfig>>;

  /**
   * Launches the tool interactively.
   * If implemented, this tool will appear in the /launch menu.
   */
  launch?(): Promise<void>;

  /**
   * Returns configuration for launching via PTY manager.
   */
  getLaunchConfig?(): Promise<{ command: string; args: string[]; cwd?: string }>;
}
