import { describe, expect, it } from "bun:test";
import { GeminiAdapter } from "./gemini";
import { UnifiedConfigSchema } from "../config/schema";

describe("GeminiAdapter", () => {
  const adapter = new GeminiAdapter();

  it("should transform unified config to Gemini format (Stdio)", () => {
    const config = UnifiedConfigSchema.parse({
      mcp_servers: [
        {
          name: "test-stdio",
          type: "stdio",
          command: "bun",
          args: ["run", "server.ts"],
          env: { ENV: "PROD" }
        }
      ]
    });

    const transformed = adapter.transform(config);
    expect(transformed["test-stdio"]).toBeDefined();
    expect(transformed["test-stdio"].command).toBe("bun");
    expect(transformed["test-stdio"].args).toEqual(["run", "server.ts"]);
    expect(transformed["test-stdio"].env).toEqual({ ENV: "PROD" });
    // Should NOT have url
    expect(transformed["test-stdio"].url).toBeUndefined();
  });

  it("should transform unified config to Gemini format (Remote)", () => {
    const config = UnifiedConfigSchema.parse({
      mcp_servers: [
        {
          name: "test-remote",
          type: "http",
          url: "https://mcp.example.com",
          headers: { "Authorization": "token" }
        }
      ]
    });

    const transformed = adapter.transform(config);
    expect(transformed["test-remote"]).toBeDefined();
    expect(transformed["test-remote"].url).toBe("https://mcp.example.com");
    expect(transformed["test-remote"].headers).toEqual({ "Authorization": "token" });
    // Should NOT have command/args
    expect(transformed["test-remote"].command).toBeUndefined();
  });
});
