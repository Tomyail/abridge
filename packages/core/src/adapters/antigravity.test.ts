import { describe, expect, it } from "bun:test";
import { AntigravityAdapter } from "./antigravity";
import { UnifiedConfigSchema } from "../config/schema";

describe("AntigravityAdapter", () => {
  const adapter = new AntigravityAdapter();

  it("should transform unified config to Antigravity format (Stdio)", () => {
    const config = UnifiedConfigSchema.parse({
      mcp_servers: [
        {
          name: "test-stdio",
          type: "stdio",
          command: "python",
          args: ["main.py"],
          env: { KEY: "VALUE" }
        }
      ]
    });

    const transformed = adapter.transform(config);
    expect(transformed["test-stdio"]).toBeDefined();
    expect(transformed["test-stdio"].command).toBe("python");
    expect(transformed["test-stdio"].args).toEqual(["main.py"]);
    expect(transformed["test-stdio"].env).toEqual({ KEY: "VALUE" });
  });

  it("should transform unified config to Antigravity format (Remote)", () => {
    const config = UnifiedConfigSchema.parse({
      mcp_servers: [
        {
          name: "test-remote",
          type: "remote", // or http
          url: "https://api.example.com",
          headers: { Authorization: "Bearer token" }
        }
      ]
    });

    const transformed = adapter.transform(config);
    expect(transformed["test-remote"]).toBeDefined();
    expect(transformed["test-remote"].serverUrl).toBe("https://api.example.com");
    expect(transformed["test-remote"].headers).toEqual({ Authorization: "Bearer token" });
  });

  it("should handle tool-specific overrides", () => {
    const config = UnifiedConfigSchema.parse({
      mcp_servers: [
        {
          name: "overridden",
          type: "stdio",
          command: "node",
          tool_specific: {
            antigravity: {
              timeout: 5000
            }
          }
        }
      ]
    });

    const transformed = adapter.transform(config);
    expect(transformed.overridden.timeout).toBe(5000);
  });
});
