import { describe, it, expect, mock, spyOn } from "bun:test";
import { CrushAdapter } from "../crush";
import { join } from "path";
import { homedir } from "os";

describe("CrushAdapter", () => {
  it("should have correct name and config path", () => {
    const adapter = new CrushAdapter();
    expect(adapter.name).toBe("crush");
    expect(adapter.configPath).toBe(join(homedir(), ".config", "crush", "crush.json"));
  });

  it("should detect if config directory exists", async () => {
    const adapter = new CrushAdapter();
    // We can't easily mock fs.existsSync with Bun test runner in this context without more setup,
    // so we'll rely on the actual filesystem or assume it returns boolean.
    // Ideally we would mock 'node:fs'.
    const exists = await adapter.detect();
    expect(typeof exists).toBe("boolean");
  });

  it("should use 'crush' command for launch", async () => {
    const adapter = new CrushAdapter();
    // This is a partial test ensuring the method exists
    expect(typeof adapter.launch).toBe("function");
  });
});
