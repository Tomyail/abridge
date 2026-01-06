import { describe, expect, it, afterEach } from "bun:test";
import { ConfigLoader, DEFAULT_CONFIG_PATH } from "./loader";
import { rm } from "node:fs/promises";
import { existsSync } from "node:fs";

describe("ConfigLoader", () => {
  const testConfigPath = "./test-config.yaml";

  afterEach(async () => {
    if (existsSync(testConfigPath)) {
      await rm(testConfigPath);
    }
  });

  it("should load default config if file does not exist", async () => {
    const config = await ConfigLoader.load(testConfigPath);
    expect(config.mcp_servers).toEqual([]);
    expect(config.skills).toEqual([]);
    expect(config.sync.enabled).toBe(false);
  });

  it("should save and load config", async () => {
    const testConfig = {
      mcp_servers: [
        {
          name: "test-server",
          command: "node",
          args: ["server.js"],
          env: { KEY: "VALUE" },
          tool_specific: {}
        }
      ],
      skills: [],
      sync: { enabled: true, method: "cloud-drive" as const, path: "/tmp" }
    };

    await ConfigLoader.save(testConfig, testConfigPath);
    expect(existsSync(testConfigPath)).toBe(true);

    const loadedConfig = await ConfigLoader.load(testConfigPath);
    expect(loadedConfig.mcp_servers[0].name).toBe("test-server");
    expect(loadedConfig.sync.enabled).toBe(true);
  });
});
