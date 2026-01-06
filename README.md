# Abridge 🌉

[中文版](./README.zh-CN.md)

**Abridge** is a unified configuration management platform designed for developers using multiple Coding Agents. It acts as a bridge between various terminal-based AI agents (such as Claude Code, Codex, Gemini CLI, etc.), allowing you to centrally manage all your MCP (Model Context Protocol) server configurations, skills, and session records.

## 🌟 Key Features

- **Bidirectional Sync**: Effortlessly distribute configurations to multiple tools, and pull/merge existing configurations from tools back into Abridge.
- **Unified MCP Management**: Support for Stdio, HTTP, Local, and Remote MCP protocols. Configure once, use everywhere.
- **Tool Adapters**:
  - ✅ **Claude Code** (Supports the latest `.claude.json` monolithic format)
  - ✅ **Codex** (Supports `.codex/config.toml` format)
  - ✅ **OpenCode** (Supports `~/.config/opencode/opencode.json` format)
  - ✅ **Antigravity** (Supports `~/.gemini/antigravity/mcp_config.json` format)
  - 🏗️ **Gemini CLI / Cursor** (Coming soon)
- **High-Performance Runtime**: Built with [Bun](https://bun.sh/) for blazing-fast response times.
- **Local-First**: All configurations and data are stored locally on your machine, ensuring maximum privacy.

## 🚀 Quick Start

### Installation

#### From GitHub Releases (Recommended)
Download the pre-compiled binary for your platform from the [Releases](https://github.com/your-username/abridge/releases) page:
- `abridge-macos-arm64` (Apple Silicon)
- `abridge-macos-x64` (Intel Mac)
- `abridge-linux-x64`
- `abridge-linux-arm64`

After downloading, move it to your bin folder and make it executable:
```bash
chmod +x abridge-*
sudo mv abridge-* /usr/local/bin/abridge
```

#### From NPM
```bash
npm install -g abridge
```

#### From Source
```bash
git clone https://github.com/your-username/abridge.git
cd abridge
bun install
```

### Usage Guide

1. **Initialize**: Create the default configuration file at `~/.abridge/config.yaml`
   ```bash
   abridge init
   ```

2. **Import Configuration**: Pull your existing MCP servers from installed tools like Claude Code or Codex.
   ```bash
   abridge import
   ```

3. **Edit Configuration**: Modify your MCP servers in `~/.abridge/config.yaml`.

4. **Apply Configuration**: Synchronize the unified configuration back to all supported tools.
   ```bash
   abridge apply
   ```

## 📂 Project Structure

This project uses a Monorepo architecture:

- `packages/cli`: Command-line interface implementation.
- `packages/core`: Core logic, adapter system, configuration parsing, and merging.
- `packages/sdk`: SDK for integration with other tools.

## 🗺️ Roadmap

- [x] Unified config parsing (YAML)
- [x] Claude Code Adapter (Bidirectional)
- [x] Codex Adapter (Bidirectional)
- [x] OpenCode Adapter (Bidirectional)
- [x] Configuration merging logic
- [x] Unified support for HTTP Headers and Remote MCP
- [x] GitHub CI/CD automation for cross-platform distribution
- [ ] Secret Masking (Encrypted storage for API keys/tokens)
- [ ] Unified session history collection and search
- [ ] Multi-device sync (via iCloud/Dropbox)

## 📄 License

[MIT](LICENSE)
