import { z } from 'zod';

export const McpServerSchema = z.object({
  name: z.string(),
  type: z.enum(['stdio', 'http', 'local', 'remote']).optional().default('stdio'),
  command: z.string().optional().default(''),
  args: z.array(z.string()).optional().default([]),
  env: z.record(z.string()).optional().default({}),
  url: z.string().optional(),
  headers: z.record(z.string()).optional().default({}),
  tool_specific: z.record(z.record(z.any())).optional().default({}),
});

export const SkillSchema = z.object({
  name: z.string(),
  path: z.string(),
  enabled_for: z.array(z.string()).optional().default([]),
});

export const SyncMethodSchema = z.enum(['cloud-drive']);

export const SyncSchema = z.object({
  enabled: z.boolean().default(false),
  method: SyncMethodSchema.optional().default('cloud-drive'),
  path: z.string().optional(),
});

export const UnifiedConfigSchema = z.object({
  mcp_servers: z.array(McpServerSchema).optional().default([]),
  skills: z.array(SkillSchema).optional().default([]),
  sync: SyncSchema.optional().default({ enabled: false }),
});

export type UnifiedConfig = z.infer<typeof UnifiedConfigSchema>;
export type McpServer = z.infer<typeof McpServerSchema>;
export type Skill = z.infer<typeof SkillSchema>;
