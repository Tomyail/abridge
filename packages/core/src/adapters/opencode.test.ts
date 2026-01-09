import { describe, expect, it } from "bun:test";
import { OpenCodeAdapter } from "./opencode";
import { UnifiedConfigSchema } from "../config/schema";

describe("OpenCodeAdapter", () => {
  const adapter = new OpenCodeAdapter();

  it("should transform unified config to OpenCode format (Local/Stdio)", () => {
    const config = UnifiedConfigSchema.parse({
      mcp_servers: [
        {
          name: "test-local",
          type: "stdio",
          command: "node",
          args: ["index.js"],
          env: { DEBUG: "true" }
        }
      ]
    });

    const transformed = adapter.transform(config);
    expect(transformed["test-local"]).toBeDefined();
    // OpenCode uses array command format
    expect(transformed["test-local"].type).toBe("local");
    expect(transformed["test-local"].command).toEqual(["node", "index.js"]);
    expect(transformed["test-local"].environment).toEqual({ DEBUG: "true" });
  });

  it("should transform unified config to OpenCode format (Remote)", () => {
    const config = UnifiedConfigSchema.parse({
      mcp_servers: [
        {
          name: "test-remote",
          type: "remote",
          url: "http://localhost:8080/sse",
          headers: { "X-Test": "123" }
        }
      ]
    });

    const transformed = adapter.transform(config);
    expect(transformed["test-remote"]).toBeDefined();
    expect(transformed["test-remote"].type).toBe("remote");
    expect(transformed["test-remote"].url).toBe("http://localhost:8080/sse");
    expect(transformed["test-remote"].headers).toEqual({ "X-Test": "123" });
  });
});
