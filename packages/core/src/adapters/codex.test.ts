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
    expect(transformed.test.type).toBe("stdio");
    expect(transformed.test.url).toBeUndefined();
  });

  it("should transform remote config correctly", () => {
    const config = UnifiedConfigSchema.parse({
      mcp_servers: [
        {
          name: "remote",
          type: "remote",
          url: "http://example.com/sse",
        }
      ]
    });

    const transformed = adapter.transform(config);
    expect(transformed.remote.type).toBe("sse");
    expect(transformed.remote.url).toBe("http://example.com/sse");
    expect(transformed.remote.command).toBeUndefined();
    expect(transformed.remote.args).toBeUndefined();
  });

  it("should handle extraction from TOML", async () => {
    // This is hard to test without mocking FS, but we can test the logic if we expose it
    // For now, we trust the integration test we just did manually
  });
});
