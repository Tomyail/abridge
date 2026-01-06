import { describe, expect, it } from "bun:test";
import { ClaudeCodeAdapter } from "./claude";
import { UnifiedConfigSchema } from "../config/schema";

describe("ClaudeCodeAdapter", () => {
  const adapter = new ClaudeCodeAdapter();

  it("should transform unified config to Claude format", () => {
    const config = UnifiedConfigSchema.parse({
      mcp_servers: [
        {
          name: "test",
          command: "node",
          args: ["test.js"],
          env: { FOO: "BAR" }
        }
      ]
    });

    const transformed = adapter.transform(config);
    expect(transformed.mcpServers.test).toBeDefined();
    expect(transformed.mcpServers.test.command).toBe("node");
    expect(transformed.mcpServers.test.args).toEqual(["test.js"]);
    expect(transformed.mcpServers.test.env).toEqual({ FOO: "BAR" });
  });

  it("should handle tool-specific overrides", () => {
    const config = UnifiedConfigSchema.parse({
      mcp_servers: [
        {
          name: "overridden",
          command: "node",
          tool_specific: {
            "claude-code": {
              command: "bun"
            }
          }
        }
      ]
    });

    const transformed = adapter.transform(config);
    expect(transformed.mcpServers.overridden.command).toBe("bun");
  });
});
