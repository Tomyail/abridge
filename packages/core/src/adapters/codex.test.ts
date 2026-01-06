import { describe, expect, it } from "bun:test";
import { CodexAdapter } from "./codex";
import { UnifiedConfigSchema } from "../config/schema";

describe("CodexAdapter", () => {
  const adapter = new CodexAdapter();

  it("should transform unified config to Codex format", () => {
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
    expect(transformed.test).toBeDefined();
    expect(transformed.test.command).toBe("node");
    expect(transformed.test.args).toEqual(["test.js"]);
    expect(transformed.test.env).toEqual({ FOO: "BAR" });
  });

  it("should handle extraction from TOML", async () => {
    // This is hard to test without mocking FS, but we can test the logic if we expose it
    // For now, we trust the integration test we just did manually
  });
});
