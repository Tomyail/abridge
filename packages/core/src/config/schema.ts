import { z } from 'zod';

export const McpServerSchema = z.object({
  name: z.string().describe('Unique identifier for the MCP server'),
  type: z
    .enum(['stdio', 'http', 'local', 'remote'])
    .optional()
    .default('stdio')
    .describe('Server type: stdio(command-line), http(HTTP connection), local(local file), remote(remote proxy)'),
  command: z.string().optional().default('').describe('Command to start the server (for stdio type, e.g., npx, node)'),
  args: z.array(z.string()).optional().default([]).describe('Command line arguments array (for stdio type)'),
  env: z.record(z.string()).optional().default({}).describe('Environment variables (for stdio type)'),
  url: z.string().optional().describe('Server URL (for http/remote type)'),
  headers: z.record(z.string()).optional().default({}).describe('HTTP request headers (for http/remote type)'),
  tool_specific: z.record(z.record(z.any())).optional().default({}).describe('Tool-specific configuration overrides (e.g., { "claude-code": { "timeout": 30000 } })'),
});

export const SkillSchema = z.object({
  name: z.string().describe('Unique identifier for the skill'),
  path: z.string().describe('Absolute path to the skill folder'),
  enabled_for: z.array(z.string()).optional().default([]).describe('List of tools that can use this skill (empty means all tools)'),
});

export const SyncMethodSchema = z.enum(['cloud-drive']).describe('Sync method: cloud-drive (iCloud/Dropbox)');

export const SyncSchema = z.object({
  enabled: z.boolean().default(false).describe('Enable cloud synchronization'),
  method: SyncMethodSchema.optional().default('cloud-drive').describe('Synchronization method configuration'),
  path: z.string().optional().describe('Custom sync path (leave empty to auto-detect iCloud/Dropbox)'),
});

export const UnifiedConfigSchema = z.object({
  mcp_servers: z.array(McpServerSchema).optional().default([]).describe('MCP server configuration list'),
  skills: z.array(SkillSchema).optional().default([]).describe('Skills configuration list'),
  sync: SyncSchema.optional().default({ enabled: false }).describe('Cloud sync configuration'),
});

export type UnifiedConfig = z.infer<typeof UnifiedConfigSchema>;
export type McpServer = z.infer<typeof McpServerSchema>;
export type Skill = z.infer<typeof SkillSchema>;
