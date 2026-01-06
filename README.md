# Abridge 🌉

**Abridge** 是一个专为开发者打造的统一 Coding Agents 配置管理平台。它充当了不同终端编程代理（如 Claude Code, Codex, Gemini CLI 等）之间的桥梁，让你能够在一个地方统一管理所有的 MCP 服务器配置、技能（Skills）和会话记录。

## 🌟 核心特性

- **双向同步 (Bidirectional Sync)**：不仅能将配置分发到各个工具，还能从已有的工具中反向拉取配置并合并。
- **统一 MCP 管理**：支持 Stdio 和 HTTP 协议的 MCP 服务器，一次配置，全局生效。
- **工具支持**：
  - ✅ **Claude Code** (支持最新的 `.claude.json` 单体配置格式)
  - ✅ **Codex** (支持 `.codex/config.toml` 配置格式)
  - 🏗️ **OpenCode / Gemini CLI** (开发中)
- **高性能运行时**：基于 [Bun](https://bun.sh/) 开发，响应极快。
- **本地优先**：所有配置和数据均保存在本地，保护隐私。

## 🚀 快速上手

### 安装

目前项目处于早期开发阶段，可以通过源码链接使用：

```bash
# 克隆仓库
git clone https://github.com/your-username/abridge.git
cd abridge

# 安装依赖
bun install

# 链接 CLI 到全局
cd packages/cli
bun link
```

### 使用指南

1. **初始化**：创建默认配置文件 `~/.abridge/config.yaml`
   ```bash
   abridge init
   ```

2. **拉取配置**：从已安装的 Claude Code 或 Codex 中导入你现有的 MCP 服务器
   ```bash
   abridge import
   ```

3. **编辑配置**：在 `~/.abridge/config.yaml` 中添加或修改 MCP 服务器。

4. **发分配置**：将统一后的配置同步到所有支持的工具中
   ```bash
   abridge apply
   ```

## 📂 项目结构

本项目采用 Monorepo 架构：

- `packages/cli`: 命令行工具实现。
- `packages/core`: 核心逻辑、适配器系统、配置解析与合并。
- `packages/sdk`: 供其他工具集成的 SDK。

## 🗺️ 路线图

- [x] 统一配置读取与解析 (YAML)
- [x] Claude Code 适配器 (双向)
- [x] Codex 适配器 (双向)
- [x] 配置自动合并逻辑
- [ ] 敏感信息加密存储 (Secret Masking)
- [ ] 会话记录统一采集与检索
- [ ] 多设备同步 (基于 iCloud/Dropbox)

## 📄 开源协议

[MIT](LICENSE)
