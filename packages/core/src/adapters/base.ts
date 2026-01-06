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
}
