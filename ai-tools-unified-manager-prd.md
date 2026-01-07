---
created_at: 2025-01-06 10:30:00
updated_at: 2026-01-06 15:35:00
publish: false
slug: abridge
description: 统一管理多个 Coding Agents 的配置和会话记录的平台
aliases:
  - Abridge
  - Agent 配置同步工具
  - MCP 统一配置
tags:
  - product
  - agents
  - coding-agents
  - mcp
  - config-sync
  - prd
---

# Abridge PRD

## 1. 项目概述

### 产品定义

### 产品定义

一个 AI 原生的 Workspace Manager，类似于 "Lazygit for AI Agents" 或 "Tmux for Coding"。它不仅统一管理多个终端编程代理（Claude Code、Codex、OpenCode、Crush 等）的配置，还提供一个强大的 TUI Dashboard 来管理这些工具的生命周期、进程切换和上下文协作。

### 背景：Coding Agents 生态现状

随着 Coding Agents（终端编程代理）的快速发展，开发者的工作环境中往往需要同时使用多个智能编程助手：

- **Claude Code** - Anthropic 的官方 CLI 工具，深度集成 Claude 模型
- **Codex** - OpenAI 的代码生成工具
- **OpenCode** - 开源的终端编程代理
- **Gemini CLI** - Google Gemini 的命令行工具
- 其他新兴 AI 编程助手

这些 Agent 各自独立、配置不互通、数据不共享，给开发者带来了显著的管理负担。

### 核心痛点

#### 痛点一：配置管理复杂

每个 Agent 都有独立的配置体系：
- MCP (Model Context Protocol) 服务器配置无法共享
- Skills、插件配置各自为政
- 环境变量和 API Key 管理分散
- 修改一个配置需要在多个工具中重复操作

**结果**：配置维护成本高，容易出错，阻碍工具快速切换。

#### 痛点二：会话记录分散

各工具保存会话记录的方式完全不同：
- Claude Code 使用特定的会话存储格式
- 其他工具各有不同的日志和缓存机制
- 历史对话难以跨工具检索
- 无法统一查看和管理所有 AI 交互记录

**结果**：之前的对话难以查找，知识积累无法有效利用。

### 产品愿景

**短期目标**：构建一个 "Lazygit 风格" 的 TUI 工作台，实现多 Agent 的并行运行、快速切换和统一配置。

**长期愿景**：推动 Coding Agents 生态的标准化，让开发者能够自由选择和组合不同的编程代理，而不被配置和数据格式所束缚。

### 为什么开源

- **透明性**：配置和数据管理需要用户完全掌控
- **社区驱动**：Coding Agents 生态变化快，社区能快速适配新 Agent
- **质量保证**：代码公开可审计，增强用户信任
- **协作效率**：便于与大模型协作开发和迭代

### 灵感来源

本项目受到 [happy-cli](https://github.com/slopus/happy-cli) 的启发，该项目展示了如何解析和统一 Claude Code 的会话历史。我们在此基础上扩展到多工具场景。

## 2. 目标用户与使用场景

### 主要用户画像

#### 重度 AI 工具用户

**特征**：
- 每天使用多个 AI CLI 工具进行开发
- 熟悉 Claude Code、Codex、Copilot CLI 等工具的使用
- 愿意尝试新兴的 AI 编程工具
- 追求极致的开发效率

**需求**：
- 快速在不同工具间切换
- 统一管理和复用配置
- 高效检索历史对话

#### 工具评估者与技术爱好者

**特征**：
- 持续关注 Coding Agents 生态的发展
- 频繁评估和测试新的编程代理
- 可能是技术博客作者或开源贡献者

**需求**：
- 低成本地接入新 Agent
- 对比不同编程代理的效果
- 保留评估过程中的对话记录

#### 跨设备开发者

**特征**：
- 在多台电脑上工作（办公室 + 家里）
- 使用 macOS 或 Linux 系统
- 通过网盘或云服务同步配置

**需求**：
- 配置在设备间自动同步
- 会话记录可跨设备访问
- 避免重复配置工作

### 核心使用场景

#### 场景一：日常开发中的工具切换

**背景**：开发者在同一个项目中使用多个 AI 工具完成不同任务。

**流程**：
1. 上午使用 Claude Code 进行架构设计和代码实现
2. 下午使用 Codex 进行代码调试和优化
3. 晚上用 Gemini CLI 查询文档和示例

**痛点**：
- 每个工具的 MCP 服务器配置需要单独设置
- 相同的技能和插件需要在各工具中重复配置
- 切换工具时需要调整环境和配置

**价值**：
- 一次配置，所有工具生效
- 工具切换无缝衔接

#### 场景二：查找历史对话记录

**背景**：开发者记得几天前和某个 AI 工具讨论过一个技术方案，但忘记具体细节。

**流程**：
1. 使用统一检索界面搜索关键词
2. 系统返回所有相关对话（跨工具）
3. 用户查看完整对话历史和上下文

**痛点**：
- 不知道是用哪个工具进行的对话
- 各工具的会话记录格式不同，难以统一查找
- 找到记录后无法恢复到原工具继续对话

**价值**：
- 跨工具统一检索
- 保留完整上下文（包括使用的模型、工具调用等）

#### 场景三：多设备配置同步

**背景**：开发者在办公室 Mac 和家里 Mac 上工作，希望配置保持一致。

**流程**：
1. 在办公室电脑添加一个新的 MCP 服务器配置
2. 配置自动同步到网盘（iCloud/Dropbox）
3. 回家后，家里电脑自动应用新配置

**痛点**：
- 手动复制配置容易出错
- 容易遗漏某些配置项
- 难以追踪配置变更历史

**价值**：
- 配置自动同步，减少人工干预
- 支持冲突检测和合并

#### 场景四：评估新 Agent

**背景**：开发者看到一个新的编程代理发布，想要尝试。

**流程**：
1. 下载并安装新工具
2. 通过统一平台为新 Agent 生成配置
3. 直接使用已有配置开始体验
4. 会话记录自动被平台捕获

**价值**：
- 降低新 Agent 的尝试成本
- 评估数据统一管理
- 便于后续对比和选择

### 非目标用户与场景

#### 明确排除的场景：

- **单一 Agent 用户**：只使用一个编程代理的开发者，不需要配置共享功能
- **纯 GUI 用户**：不使用 CLI 工具的用户不在目标范围内
- **Windows 用户（一期）**：一期优先支持 macOS 和 Linux
- **企业级权限管理**：暂不考虑团队协作、权限控制等企业场景

### 市场潜力

随着 Coding Agents 的普及，目标用户群体正在快速增长：
- Claude Code、OpenCode 等工具的用户量持续上升
- 开发者对编程代理的依赖度越来越高
- 开发者对编程代理的依赖度越来越高
- 多 Agent 共存将成为常态，且并发使用需求增加（同时跑 Codex 和 Claude）

### 场景五：多任务并行 (New)

**背景**：开发者正在用 Claude Code 重构代码（耗时任务），突然需要用 Crush 快速查询一个 CVE 漏洞。

**流程**：
1. 在 Abridge TUI 中，将正在运行的 Claude Code 挂起/后台运行。
2. 快速 Launch 一个 Crush 会话进行查询。
3. 查询完毕，一键切换回 Claude Code 继续重构。

**价值**：
- 类似 Tmux 的会话管理体验
- 避免中断心流
- 充分利用 AI 等待时间

## 3. 核心功能需求

本章节详细描述产品的核心功能模块。功能分为三个优先级：
- **P0**：MVP 必须功能
- **P1**：重要功能，一期或二期实现
- **P2**：增强功能，后续版本考虑

### 3.1 统一配置管理 [P0]

#### 功能描述

提供一个统一的配置文件来定义所有 Coding Agents 共享的配置，主要是 MCP 服务器配置和 Skills 配置。

#### 详细需求

**配置文件格式**
```yaml
# ~/.abridge/config.yaml
mcp_servers:
  - name: filesystem
    command: npx
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"]
    env:
      PATH: /usr/local/bin:/usr/bin

  - name: github
    command: npx
    args: ["-y", "@modelcontextprotocol/server-github"]
    # 工具特定的配置覆盖
    tool_specific:
      claude-code:
        timeout: 30000
      codex:
        timeout: 60000

skills:
  - name: doc-coauthoring
    path: ~/.claude/skills/doc-coauthoring
    enabled_for: [claude-code, codex]
```

**核心能力**
- 配置文件的语法验证
- 配置项的类型检查
- 循环引用检测
- 配置文件热重载（监听文件变化）
- 配置版本管理（保留最近 N 个版本）
- 配置差异对比（`abridge config diff`）

**用户价值**
- 一次配置，多处生效
- 配置即代码，便于版本控制
- 减少 90% 的重复配置工作

### 3.2 配置适配和分发 [P0]

#### 功能描述

将统一配置自动转换为各 Agent 所需的配置格式，并写入到正确的位置。

#### 详细需求

**适配器架构**

```typescript
interface ToolAdapter {
  name: string;                    // 工具名称
  configPath: string;              // 配置文件路径
  transform(config: UnifiedConfig): ToolConfig;  // 转换函数
  apply(config: ToolConfig): Promise<void>;      // 应用配置
  detect(): Promise<boolean>;      // 检测工具是否安装
}
```

**支持的工具（一期）**
1. **Claude Code**
   - 配置路径：`~/.claude/config.json`
   - 格式：MCP 标准格式
   - 特殊处理：skills 配置

2. **Codex**
   - 配置路径：待调研
   - 格式：待研究
   - 特殊处理：待确认

**核心能力**
- 自动检测已安装的 AI 工具
- 仅为已安装工具生成配置
- 配置应用前备份原配置
- 配置冲突时提示用户
- 支持干运行模式（dry-run）
- 配置回滚功能

**用户价值**
- 无需手动编辑各工具配置
- 降低配置错误风险
- 工具安装/卸载时自动处理

### 3.3 会话记录采集 [P0]

#### 功能描述

从各 Agent 的会话存储中提取对话记录，并转换为统一的数据模型。

#### 详细需求

**统一会话数据模型**

```typescript
interface UnifiedSession {
  id: string;
  tool: 'claude-code' | 'codex' | 'gemini-cli';
  startTime: ISO8601Timestamp;
  endTime?: ISO8601Timestamp;
  model: string;
  messages: Message[];
  context?: {
    workingDirectory?: string;
    gitBranch?: string;
    environmentVariables?: Record<string, string>;
  };
  metadata?: {
    tokensUsed?: number;
    cost?: number;
    toolsInvoked?: string[];
  };
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: ISO8601Timestamp;
  toolCalls?: ToolCall[];
}
```

**采集策略**
- **增量采集**：定期扫描新的会话记录
- **全量采集**：首次运行或用户手动触发
- **实时采集（可选）**：Hook 工具的日志输出

**Claude Code 采集（一期优先）**
- 会话存储位置：待调研（可能是 `~/.claude/sessions/` 或数据库）
- 解析方式：参考 happy-cli 的实现
- 支持的内容：对话历史、工具调用、文件操作

**Codex 采集（二期）**
- 会话存储位置：待调研
- 解析方式：待研究

**核心能力**
- 采集进度显示
- 采集错误重试机制
- 采集日志记录
- 支持手动触发采集
- 采集性能优化（大量会话时）

### 3.4 会话记录存储 [P0]

#### 功能描述

将采集的会话记录持久化存储，支持高效的查询和检索。

#### 详细需求

**存储方案**
- **数据库**：SQLite（轻量、无需独立服务）
- **存储位置**：`~/.abridge/sessions.db`
- **索引**：对时间、工具、模型、消息内容建立全文索引

**数据表设计**

```sql
-- 会话表
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  tool TEXT NOT NULL,
  start_time INTEGER NOT NULL,
  end_time INTEGER,
  model TEXT,
  working_directory TEXT,
  -- 其他字段...
);

-- 消息表
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- 全文搜索索引
CREATE VIRTUAL TABLE sessions_fts USING fts5(
  content, session_id
);
```

**核心能力**
- 数据加密（可选，使用 SQLCipher）
- 自动压缩旧数据
- 数据库备份和恢复
- 存储空间管理（可配置保留策略）
- 数据库迁移和版本管理

**性能目标**
- 支持 10,000+ 会话记录
- 查询响应时间 < 500ms
- 数据库大小 < 100MB（未压缩）

### 3.5 跨工具检索 [P0]

#### 功能描述

提供强大的搜索功能，让用户能够快速找到需要的历史对话。

#### 详细需求

**搜索模式**

1. **全文搜索**
   ```bash
   abridge search "React hooks 最佳实践"
   ```

2. **高级筛选**
   ```bash
   abridge search "API 设计" \
     --tool claude-code \
     --after "2025-01-01" \
     --before "2025-01-31" \
     --model claude-sonnet-4
   ```

3. **组合查询**
   ```bash
   abridge search "docker" --tool claude-code --tag "重要"
   ```

**搜索结果**

```
🔍 找到 3 条相关会话

[1] 2025-01-05 14:30  Claude Code (sonnet-4)
    讨论了 Docker Compose 的多阶段构建优化
    ~/projects/myapp/

    > 用户: 如何优化 Docker 镜像大小？
    > Claude: 你可以使用多阶段构建...

[2] 2025-01-03 10:15  Claude Code (haiku-3)
    Docker 容器启动失败的排查
    ~/projects/microservice/

    > 用户: 容器一启动就退出了...
```

**核心能力**
- 关键词高亮显示
- 相关度排序
- 模糊搜索（容错）
- 搜索历史记录
- 搜索结果导出
- 语义搜索（P2，使用向量化）

### 3.6 会话记录管理 [P1]

#### 功能描述

提供会话记录的查看、标记、导出和删除功能。

#### 详细需求

**查看会话详情**
```bash
abridge show <session-id>
```

显示完整对话历史，包括：
- 用户消息和 AI 回复
- 工具调用详情
- 文件操作记录
- Token 使用统计

**会话标记**
```bash
# 标记为重要
abridge tag <session-id> --add "重要"

# 添加自定义标签
abridge tag <session-id> --add "bug修复" --add "性能优化"

# 查看所有标签
abridge tags --list
```

**导出功能**
```bash
# 导出为 Markdown
abridge export <session-id> --format markdown --output session.md

# 导出多条会话
abridge export --tag "重要" --format json --output important_sessions.json
```

**删除功能**
```bash
# 删除单个会话
abridge delete <session-id>

# 批量删除
abridge delete --before "2024-01-01"  # 删除旧会话
abridge delete --tool "old-tool"      # 删除某工具的所有会话
```

**核心能力**
- 敏感信息检测（API Key、密码等）
- 删除前确认提示
- 软删除（可恢复）
- 永久删除选项

### 3.7 多设备同步 [P1]

#### 功能描述

通过网盘同步配置文件，实现多设备间的配置一致性。

#### 详细需求

**同步方案**

一期不使用自建服务器，直接利用网盘同步：

```yaml
# ~/.abridge/config.yaml
sync:
  enabled: true
  method: "cloud-drive"
  path: "~/Library/Mobile Documents/com~apple~CloudDocs/abridge"
  # 支持: iCloud Drive, Dropbox, Google Drive, OneDrive
```

**同步内容**
- 统一配置文件（`config.yaml`）
- 配置版本历史
- 不包括：会话记录（太大，且通常设备特定）

**冲突处理**
- 自动合并策略：时间戳新的优先
- 冲突提示：当两台设备同时修改时
- 手动解决：`abridge sync resolve`

**同步命令**
```bash
# 手动触发同步
abridge sync

# 查看同步状态
abridge sync status

# 配置同步路径
abridge sync configure --path ~/Dropbox/abridge
```

**核心能力**
- 同步状态监控
- 自动后台同步（可选）
- 同步日志记录
- 网络异常处理

### 3.8 CLI 工具 [P0]

#### 功能描述

提供命令行界面作为主要的交互方式。

#### 详细需求

**命令结构**

```bash
abridge                          # 显示帮助和概览
abridge init                     # 初始化配置
abridge config <subcommand>      # 配置管理
abridge apply                    # 应用配置到所有工具
abridge collect                  # 采集会话记录
abridge search <query>           # 搜索会话
abridge show <id>                # 显示会话详情
abridge export <id>              # 导出会话
abridge tag <id>                 # 管理标签
abridge delete <id>              # 删除会话
abridge sync <subcommand>        # 多设备同步
abridge status                   # 显示系统状态
abridge doctor                   # 诊断和故障排除
```

**配置管理命令**

```bash
# 验证配置
abridge config validate

# 查看配置
abridge config show

# 编辑配置（打开默认编辑器）
abridge config edit

# 查看配置差异
abridge config diff

# 回滚到上一版本
abridge config rollback
```

**状态查看**

```bash
$ abridge status

✅ 配置文件: 有效
✅ Claude Code: 已应用最新配置
✅ Codex: 未安装
❌ Gemini CLI: 配置应用失败
📊 会话记录: 1,234 条 (最新: 2 分钟前)
💾 数据库大小: 45.2 MB
🔄 同步: 已同步到 iCloud
```

**核心能力**
- 彩色输出和格式化
- 进度条显示
- 交互式确认
- 详细日志模式（`--verbose`）
- 命令自动补全（bash/zsh/fish）
- 全局配置选项（`--config`, `--dry-run`）

### 3.9 TUI 界面 [P0] (Implemented)

#### 功能描述

提供终端用户界面（TUI），提供更友好的交互体验。

#### 详细需求

**主界面布局**

```
┌─────────────────────────────────────────────────────────────┐
│  Abridge v0.2.0 (Workspace Mode)                            │
├─────────────┬───────────────────────────────────────────────┤
│ 1. 运行中   │  >_ Claude Code (Project A) - 运行中...       │
│  * Claude   │  ┌─────────────────────────────────────────┐  │
│    Code     │  │ Me: Add auth middleware                 │  │
│  - Crush    │  │ AI: working on it...                    │  │
│             │  │ [Generating file...]                    │  │
│ 2. 工具箱   │  └─────────────────────────────────────────┘  │
│             │                                               │
│             │  [Enter] 接入会话  [Space] 切换侧边栏         │
│             │  [t] 启动新任务                               │
│             │                                               │
├─────────────┼───────────────────────────────────────────────┤
│ 3. 状态     │  [x] Config Synced                            │
│    CPU: 23% │  [i] 2 Agents Running                         │
└─────────────┴───────────────────────────────────────────────┘

[1-9] 切换面板  [?/] 搜索  [t] 新建终端  [q] 退出
│                                                               │
│  📊 概览                                                     │
│  ┌─────────────┬─────────────┬─────────────┐                │
│  │ 工具数量: 6 │ 会话: 4     │ 同步: ✅    │                │
│  └─────────────┴─────────────┴─────────────┘                │
│                                                               │
│  🔧 已安装的工具                                             │
│  ● Claude Code    ✅ 配置已应用                              │
│  ● Crush          ✅ 配置支持                                │
│                                                               │
│  [q] 退出  [c] 配置  [?] 帮助                               │
└─────────────────────────────────────────────────────────────┘
```

**核心功能**
- 键盘快捷键导航 ([1-9] 切换任务)
- 实时状态更新 (Event-driven)
- 交互式配置并启动 (Launch Menu)
- 会话浏览和搜索
- 主题支持（Ink TUI）

**技术栈**
- TypeScript + Node.js
- TUI 框架：Ink + React
- PTY 管理：node-pty / bun-pty

### 3.10 Web UI [P2]

#### 功能描述

提供基于浏览器的管理界面（可选功能）。

#### 详细需求

**功能范围**
- 所有 CLI 功能的可视化版本
- 更直观的配置编辑界面
- 会话记录的可视化展示
- 统计图表（使用趋势、工具分布等）
- 本地运行，无需部署到服务器

**技术方案**
- 使用 Tauri 或 Electron 打包
- 本地 HTTP 服务器
- 或使用静态生成 + 本地文件打开

**实现时机**
- 在 CLI 和 TUI 稳定后再考虑
- 可能作为独立的扩展项目

### 3.11 扩展性设计 [P1]

#### 功能描述

提供插件系统，允许社区贡献新工具的适配器。

#### 详细需求

**插件接口**

```typescript
interface ToolAdapterPlugin {
  name: string;
  version: string;

  // 必须实现的方法
  detect(): Promise<boolean>;
  collectSessions(): Promise<Session[]>;
  transformConfig(config: UnifiedConfig): ToolConfig;

  // 可选的元数据
  author?: string;
  description?: string;
  homepage?: string;
}
```

**插件加载**

```bash
# 安装插件
abridge plugin install @abridge/adapter-cursor

# 列出插件
abridge plugin list

# 卸载插件
abridge plugin uninstall @abridge/adapter-cursor
```

**核心能力**
- 插件沙箱隔离
- 插件版本管理
- 插件依赖管理
- 插件测试框架

**社区贡献**
- 完善的插件开发文档
- 插件模板和脚手架
- 插件示例和最佳实践

### 3.12 差异化同步策略 [P1]

#### 功能描述

随着接入工具的增加，用户需要针对不同工具配置不同的 MCP 服务器或参数。差异化同步允许用户精细控制配置的分发逻辑。

#### 详细需求

**1. 显式包含/排除 (Include/Exclude Control)**
- 在 `mcp_servers` 的定义中增加 `only` 和 `ignore` 字段。
- `only`: (字符串数组) 该服务器仅同步到指定的工具。
- `ignore`: (字符串数组) 该服务器在指定工具中被忽略。

**2. 环境参数覆盖 (Tool-specific Overrides)**
- 增强 `tool_specific` 字段的覆盖逻辑。
- 在应用（Apply）配置时，如果 `tool_specific[toolName]` 下存在核心配置字段（如 `args`, `env`, `url`），适配器应优先使用这些覆盖值，而非全局默认值。

**3. 基于能力的选择性同步 (Capability-based Filtering)**
- Abridge 自动通过适配器感知工具的能力。
- 例如：如果一个 Server 的 `type` 是 `remote/http`，而某个适配器声明不支持 HTTP 传输，则同步时自动跳过该工具。

#### 用户价值
- **性能优化**：避免在所有工具中加载不必要的或重型的 MCP 服务器。
- **环境隔离**：区分 CLI 和 GUI 工具的使用场景，提供更贴合工具特性的配置。
- **灵活性**：支持复杂的跨工具工作流。

- **灵活性**：支持复杂的跨工具工作流。

### 3.13 进程管理与多任务 [P0] (New)

#### 功能描述

Abridge 作为所有 AI Agent 的守护进程（Supervisor），负责管理它们的生命周期。支持类似 Tmux 的会话分离（Detach）和接入（Attach）。

#### 详细需求

**1. 进程生命周期管理**
- **Launch**: 启动一个新的 Agent 进程（如 `claude`），分配唯一的 Session ID 和 PTY。
- **Background**: 将当前前台运行的 Agent 切换到后台，释放终端控制权给 TUI。
- **Foreground (Attach)**: 将后台运行的 Agent 重新接管当前终端输入输出。
- **Terminate**: 强行结束某个 Agent 进程。

**2. PTY 虚拟终端池**
- 维护一个 PTY 池，每个运行中的 Agent 占用一个 PTY。
- TUI 负责渲染 PTY 的输出缓冲区（类似 Tmux 的 Viewport）。
- 支持 xterm-256color 和键盘事件透传。

**3. 快捷键交互**
- 全局快捷键（如 `Ctrl+a`）呼出 TUI 仪表盘。
- `Ctrl+a d`: Detach 当前会话，回到仪表盘。
- `Ctrl+a [1-9]`: 快速切换到指定编号的 Agent。

**4. 状态持久化**
- 即使退出 Abridge CLI，后台 Agent 进程可配置为保持运行（类似 `tmux-server`）。
- 再次运行 `abridge` 自动恢复连接。

#### 用户价值
- **任务概览 (Visibility)**：解决 "忘了哪个窗口在跑什么" 的痛点。一眼看到所有 Agent 的实时状态（Thinking/Writing/Idle）和任务摘要。
- **并行工作**：同时运行多个耗时任务（如一个 Agent 在重构，另一个在生成文档），并通过 TUI 快速切换。
- **上下文保护**：不会因为误触或终端关闭而丢失正在运行的 Agent 上下文。

### 4.1 整体架构设计

#### 架构设计理念

参考 [OpenCode](https://github.com/anomalyco/opencode) 的客户端-服务器架构，本项目采用**统一后端 + 多客户端**的架构设计。

**核心优势**：
- ✅ 业务逻辑集中，避免在多个客户端重复实现
- ✅ 支持多种前端（CLI、TUI、Web、Desktop）共享同一套核心逻辑
- ✅ 实时通信能力，支持会话流式传输
- ✅ 便于远程访问和移动端支持（未来）

#### 架构分层

```
┌─────────────────────────────────────────────────────────────────┐
│                        客户端层                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  CLI Client  │  │  TUI Client  │  │   Web/Desktop (P2)   │  │
│  │  (Commander) │  │  (OpenTUI)   │  │   (React/Tauri)      │  │
│  │              │  │              │  │                      │  │
│  │ - 命令行交互 │  │ - 终端界面   │  │ - 可视化界面         │  │
│  │ - 快速操作   │  │ - 实时更新   │  │ - 图表统计           │  │
│  │ - 脚本友好   │  │ - 键盘快捷键 │  │ - 移动端支持         │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   SDK Layer     │  ← 统一的客户端 SDK
                    │   (TypeScript)  │
                    │ - 类型安全的 API │
                    │ - 自动重连      │
                    │ - 事件订阅      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  API Gateway    │  ← HTTP/SSE/WebSocket
                    │   (Hono)        │
                    │ - REST API      │
                    │ - Server Events │
                    │ - WebSocket     │
                    │ - CORS 安全     │
                    └────────┬────────┘
                             │
┌─────────────────────────────────────────────────────────────────┐
│                        核心服务层                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │  Config Manager  │  │ Session Manager  │  │  Sync Manager  │ │
│  │  - 验证          │  │  - 采集          │  │  - 冲突处理    │ │
│  │  - 版本管理      │  │  - 存储          │  │  - 网盘同步    │ │
│  │  - 转换分发      │  │  - 检索          │  │                │ │
│  └──────────────────┘  └──────────────────┘  └────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                        适配器层                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  |Claude Code│  │  Codex   │  │  Gemini  │  │  Plugin System   │ │
│  │ Adapter  │  │ Adapter  │  │ Adapter  │  │  (社区扩展)       │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                        存储层                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │ SQLite Database  │  │  File System     │  │  Cloud Drive   │ │
│  │ (Sessions)       │  │  (Configs)       │  │  (Sync)        │ │
│  └──────────────────┘  └──────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### 客户端-服务器通信

**通信协议**：

1. **REST API** - 命令式操作
   ```typescript
   // 示例 API
   GET    /api/config        // 获取配置
   POST   /api/config/apply  // 应用配置
   GET    /api/sessions      // 列出会话
   POST   /api/search        // 搜索会话
   ```

2. **Server-Sent Events (SSE)** - 实时事件推送
   ```typescript
   // 用于推送配置变更、采集进度等
   GET /api/events
   ```

3. **WebSocket** (可选) - 双向实时通信
   ```typescript
   // 用于 TUI 的实时交互
   WS /api/ws
   ```

**客户端 SDK 设计**：

```typescript
// packages/sdk/src/index.ts
export function createAIClient(options: {
  baseURL: string
  fetch?: typeof fetch
}) {
  return {
    // 配置管理
    config: {
      get: () => fetchGET('/api/config'),
      apply: () => fetchPOST('/api/config/apply'),
      validate: () => fetchPOST('/api/config/validate'),
    },

    // 会话管理
    sessions: {
      list: () => fetchGET('/api/sessions'),
      search: (query) => fetchPOST('/api/search', { query }),
      get: (id) => fetchGET(`/api/sessions/${id}`),
    },

    // 实时事件
    events: {
      subscribe: (callback) => {
        const eventSource = new EventSource('/api/events')
        eventSource.onmessage = (e) => callback(JSON.parse(e.data))
        return eventSource.close
      },
    },
  }
}
```

#### 核心组件说明

**1. Config Manager（配置管理器）**
- 读取和解析统一配置文件
- 验证配置的语法和语义
- 维护配置版本历史
- 提供配置差异对比

**2. Session Manager（会话管理器）**
- 从各工具采集会话记录
- 统一数据模型转换
- 存储到数据库
- 提供搜索和查询接口

**3. Sync Manager（同步管理器）**
- 监听配置文件变化
- 同步到网盘指定目录
- 检测和解决冲突
- 提供同步状态查询

**4. Tool Adapters（工具适配器）**
- 抽象接口：`detect()`, `transformConfig()`, `applyConfig()`, `collectSessions()`
- 每个工具一个适配器实现
- 插件化加载机制

### 4.2 技术栈评估标准

#### 评估维度

1. **开发效率**
   - 语言学习曲线
   - 生态系统成熟度
   - 可用的库和框架
   - 开发工具支持

2. **性能和资源**
   - 启动速度（CLI 工具要求快速响应）
   - 内存占用
   - CPU 使用率
   - 数据库查询性能

3. **可维护性**
   - 代码可读性
   - 类型安全
   - 测试覆盖率
   - 文档质量

4. **用户体验**
   - 跨平台支持（macOS/Linux 优先）
   - 安装便捷性
   - 错误提示友好度
   - 升级机制

5. **社区和生态**
   - 社区活跃度
   - 问题解决速度
   - 长期维护保证
   - 贡献者数量

### 4.3 语言和运行时选择

#### 候选方案对比

**方案 A：TypeScript + Node.js**

| 优势 | 劣势 |
|------|------|
| ✅ 生态成熟，npm 包丰富 | ❌ 启动速度较慢（但可接受） |
| ✅ 类型安全 + JavaScript 灵活性 | ❌ 内存占用相对较高 |
| ✅ happy-cli 等参考项目都是 TS | ❌ 需要用户安装 Node.js |
| ✅ 社区活跃，问题易解决 | |
| ✅ 开发效率高，调试工具完善 | |
| ✅ 跨平台支持良好 | |

**方案 B：TypeScript + Bun**

| 优势 | 劣势 |
|------|------|
| ✅ 兼容 Node.js 生态 | ⚠️ 较新，生态不如 Node 成熟 |
| ✅ 启动速度更快 | ⚠️ 某些原生模块可能不兼容 |
| ✅ 内置包管理器，无需 npm | ⚠️ 社区相对较小 |
| ✅ 内存占用更低 | ⚠️ 长期稳定性待验证 |
| ✅ 原生支持 TypeScript | |

**方案 C：Rust**

| 优势 | 劣势 |
|------|------|
| ✅ 极致性能，启动速度快 | ❌ 学习曲线陡峭 |
| ✅ 内存占用极低 | ❌ 开发效率较低 |
| ✅ 单二进制分发，无需运行时 | ❌ AI 工具生态大多是 TS/JS |
| ✅ 类型安全极强 | ❌ 不利于参考 happy-cli 等项目 |
| ✅ 跨平台编译友好 | |

#### 推荐方案（待确认）

**推荐：TypeScript + Bun**

**理由**：
1. **性能优势**：Bun 的启动速度和内存占用优于 Node.js，对 CLI 工具友好
2. **生态兼容**：完全兼容 Node.js npm 包，可使用成熟的库
3. **开发效率**：TypeScript 提供类型安全，Bun 内置 TypeScript 支持
4. **参考价值**：happy-cli 等项目可直接参考
5. **未来适应性**：如遇到兼容性问题，可降级到 Node.js

**备选方案**：如果 Bun 稳定性出现问题，使用 TypeScript + Node.js LTS

### 4.4 核心技术栈

#### CLI 框架

**候选：**
- [Commander.js](https://github.com/tj/commander.js) - 成熟稳定
- [Clack](https://github.com/natemoo-re/clack) - 现代化，交互体验好
- [Oclif](https://github.com/oclif/oclif) - 功能强大，但可能过重

**推荐**：Commander.js + Clack 组合
- Commander.js 处理命令解析
- Clack 处理交互式提示和输出美化

#### TUI 框架

**候选：**
- [Blessed](https://github.com/chjj/blessed) - 功能强大，学习曲线陡
- [Ink](https://github.com/vadimdemedes/ink) - React 风格，更现代
- [Terminal-kit](https://github.com/cronvel/terminal-kit) - 功能全面

**推荐**：Ink
- React 风格的组件化开发
- TypeScript 支持好
- 社区活跃，维护良好
- 与 happy-cli 使用的技术栈一致

#### 数据库

**方案：SQLite**

**理由**：
- 轻量级，无需独立服务
- 单文件存储，便于管理
- 支持全文搜索（FTS5）
- 跨平台兼容性好
- 可选加密（SQLCipher）

**库选择**：
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - 同步 API，性能好
- 或 [sql.js](https://github.com/sql-js/sql.js) - 纯 JS，但性能稍差

#### 配置文件格式

**方案：YAML**

**理由**：
- 可读性好，易于编辑
- 支持注释
- 生态成熟（js-yaml 库）
- 比 JSON 更用户友好

**库选择**：
- [js-yaml](https://github.com/nodeca/js-yaml)

### 4.5 项目结构设计

#### Monorepo 组织

采用 monorepo 结构，使用 **TurboRepo** 或 **Bun workspaces** 管理多包依赖。

```
abridge/
├── packages/
│   ├── core/                   # 核心服务（服务器端）
│   │   ├── src/
│   │   │   ├── config/         # 配置管理
│   │   │   │   ├── parser.ts
│   │   │   │   ├── validator.ts
│   │   │   │   ├── version.ts
│   │   │   │   └── transformer.ts
│   │   │   │
│   │   │   ├── session/        # 会话管理
│   │   │   │   ├── collector.ts
│   │   │   │   ├── storage.ts
│   │   │   │   ├── searcher.ts
│   │   │   │   └── models.ts
│   │   │   │
│   │   │   ├── sync/           # 多设备同步
│   │   │   │   ├── watcher.ts
│   │   │   │   ├── merger.ts
│   │   │   │   └── transporter.ts
│   │   │   │
│   │   │   ├── adapters/       # 工具适配器
│   │   │   │   ├── base.ts
│   │   │   │   ├── claude-code.ts
│   │   │   │   ├── codex.ts
│   │   │   │   └── registry.ts
│   │   │   │
│   │   │   ├── server/         # API 服务器
│   │   │   │   ├── index.ts     # Hono app
│   │   │   │   ├── routes/      # API 路由
│   │   │   │   │   ├── config.ts
│   │   │   │   │   ├── sessions.ts
│   │   │   │   │   └── events.ts
│   │   │   │   └── middleware/  # 中间件
│   │   │   │
│   │   │   └── utils/          # 工具函数
│   │   │       ├── logger.ts
│   │   │       ├── errors.ts
│   │   │       └── platform.ts
│   │   │
│   │   └── package.json
│   │
│   ├── sdk/                    # 客户端 SDK
│   │   ├── src/
│   │   │   ├── client.ts       # 主客户端
│   │   │   ├── types.ts        # 类型定义
│   │   │   └── generated/      # 自动生成的 API
│   │   └── package.json
│   │
│   ├── cli/                    # CLI 客户端
│   │   ├── src/
│   │   │   ├── commands/       # 命令实现
│   │   │   │   ├── init.ts
│   │   │   │   ├── config.ts
│   │   │   │   ├── search.ts
│   │   │   │   └── ...
│   │   │   ├── ui/             # CLI 输出格式化
│   │   │   │   └── formatter.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── tui/                    # TUI 客户端
│   │   ├── src/
│   │   │   ├── screens/        # 屏幕组件
│   │   │   │   ├── home.ts
│   │   │   │   ├── search.ts
│   │   │   │   └── config.ts
│   │   │   ├── components/     # 可复用组件
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── web/                    # Web 客户端 (P2)
│       ├── src/
│       │   ├── pages/          # 页面
│       │   ├── components/     # 组件
│       │   └── App.tsx
│       └── package.json
│
├── tests/                      # 测试
│   ├── unit/                   # 单元测试
│   ├── integration/            # 集成测试
│   └── e2e/                    # E2E 测试
│
├── docs/                       # 文档
│   ├── api.md                  # API 文档
│   ├── architecture.md         # 架构文档
│   └── contributing.md         # 贡献指南
│
├── schemas/                    # 配置模式
│   └── config.schema.json
│
├── package.json                # Root package.json
├── turbo.json                 # TurboRepo 配置
├── tsconfig.json
├── bun.lockb
├── README.md
└── LICENSE
```

#### 包依赖关系

```json
// package.json (root)
{
  "name": "abridge",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  }
}

// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

#### 各包职责

| 包名 | 职责 | 依赖 |
|------|------|------|
| `core` | 核心服务和业务逻辑 | - |
| `sdk` | 类型安全的客户端 SDK | `core` |
| `cli` | 命令行客户端 | `sdk` |
| `tui` | 终端用户界面 | `sdk` |
| `web` | Web 界面 | `sdk` |

### 4.6 数据模型设计

#### 配置数据模型

```typescript
interface UnifiedConfig {
  version: string;                    // 配置版本
  mcp_servers: MCPServerConfig[];
  skills: SkillConfig[];
  sync?: SyncConfig;
  tools?: ToolSpecificConfigs;
}

interface MCPServerConfig {
  name: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
  tool_specific?: ToolSpecificOverrides;
}

interface SkillConfig {
  name: string;
  path: string;
  enabled_for?: string[];            // 工具列表
}

interface SyncConfig {
  enabled: boolean;
  method: 'cloud-drive';
  path: string;
  auto_sync?: boolean;
  conflict_resolution?: 'newest' | 'manual';
}
```

#### 会话数据模型

```typescript
interface Session {
  id: string;                        // 唯一标识
  tool: ToolName;
  start_time: number;                // Unix timestamp
  end_time?: number;
  model: string;
  directory?: string;
  messages: Message[];
  tags?: string[];
  metadata?: SessionMetadata;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  tool_calls?: ToolCall[];
}

interface ToolCall {
  name: string;
  arguments: unknown;
  result?: unknown;
}
```

### 4.7 测试策略

#### 测试层次

**1. 单元测试（覆盖率目标 > 80%）**
- 配置解析和验证逻辑
- 数据模型转换
- 搜索算法
- 各工具适配器的核心逻辑

**2. 集成测试**
- 完整的 CLI 命令流程
- 配置应用流程
- 会话采集和存储流程
- 多设备同步流程（使用模拟网盘）

**3. E2E 测试**
- 真实环境下的完整用户场景
- 多工具协同工作
- 性能和压力测试

#### 测试工具

- **测试框架**：[Bun test](https://bun.sh/docs/test) 或 [Vitest](https://vitest.dev/)
- **Mock 工具**：[tinyspy](https://github.com/tinylibs/tinyspy)
- **覆盖率**：Bun 内置或 [c8](https://github.com/bcoe/c8)

### 4.8 性能优化策略

#### 启动速度优化

1. **懒加载**：非核心模块按需加载
2. **代码分割**：CLI 命令独立打包
3. **缓存预热**：常用配置缓存在内存中

#### 数据库优化

1. **索引优化**：为常用查询字段建立索引
2. **查询优化**：使用 prepared statements
3. **批量操作**：采集时批量写入数据库
4. **连接池**：复用数据库连接

#### 内存优化

1. **流式处理**：大文件使用流式读取
2. **分页查询**：搜索结果分页返回
3. **定期清理**：旧数据自动归档或删除

### 4.9 安全和隐私

#### 配置安全

1. **权限检查**：配置文件权限设置为 600
2. **敏感信息**：API Key 等加密存储
3. **配置验证**：防止路径遍历等攻击

#### 会话隐私

1. **敏感信息过滤**：自动检测和标记敏感内容
2. **本地优先**：数据不上传到任何服务器
3. **加密选项**：可选的数据库加密
4. **删除确认**：删除操作需要明确确认

#### 插件安全

1. **沙箱隔离**：插件在受限环境中运行
2. **权限声明**：插件声明需要的权限
3. **签名验证**：可选的插件签名验证

### 4.10 部署和分发

#### 发布渠道

1. **npm**：主要发布渠道
   ```bash
   npm install -g abridge
   ```

2. **Homebrew（可选）**：macOS 用户友好
   ```bash
   brew install abridge
   ```

3. **二进制分发（可选）**：
   - 使用 Bun 的单文件打包
   - 或使用 pkg/nexe 打包

#### 安装脚本

提供安装脚本，自动检测环境并选择最佳安装方式：

```bash
curl -sSL https://get.aihub.dev | sh
```

#### 更新机制

1. **版本检查**：定期检查新版本
2. **自动更新提示**：显示更新提示
3. **平滑升级**：数据库自动迁移

## 5. 工具适配计划

### 5.1 适配器架构设计

#### 统一适配器接口

所有工具适配器必须实现以下接口：

```typescript
interface ToolAdapter {
  // 基础信息
  readonly name: string;
  readonly version: string;
  readonly displayName: string;

  // 工具检测
  detect(): Promise<boolean>;                    // 工具是否已安装

  // 配置管理
  getConfigPath(): string;                       // 配置文件路径
  parseConfig(raw: string): ToolConfig;          // 解析现有配置
  transformConfig(config: UnifiedConfig): ToolConfig;  // 转换配置
  applyConfig(config: ToolConfig): Promise<void>;       // 应用配置
  validateConfig(config: ToolConfig): ValidationResult; // 验证配置

  // 会话管理
  getSessionPath(): string[];                    // 会话存储路径（可能多个）
  collectSessions(options: CollectOptions): Promise<Session[]>; // 采集会话
  parseSession(raw: unknown): Session;           // 解析单个会话

  // 工具生命周期
  install?(config: ToolConfig): Promise<void>;   // 可选：安装钩子
  uninstall?(): Promise<void>;                   // 可选：卸载钩子
}

interface CollectOptions {
  since?: Date;    // 增量采集的起始时间
  limit?: number;  // 最大采集数量
}
```

#### 适配器注册机制

```typescript
class AdapterRegistry {
  private adapters: Map<string, ToolAdapter> = new Map();

  register(adapter: ToolAdapter): void {
    this.adapters.set(adapter.name, adapter);
  }

  get(name: string): ToolAdapter | undefined {
    return this.adapters.get(name);
  }

  async detectInstalled(): Promise<ToolAdapter[]> {
    const results = await Promise.all(
      Array.from(this.adapters.values()).map(async (adapter) => ({
        adapter,
        installed: await adapter.detect()
      }))
    );
    return results.filter(r => r.installed).map(r => r.adapter);
  }
}
```

### 5.2 Claude Code 适配器（一期优先）

#### 基本信息

| 属性 | 值 |
|------|-----|
| 工具名称 | `claude-code` |
| 官方文档 | https://docs.anthropic.com/en/docs/claude-code |
| 配置路径 | `~/.claude/config.json` |
| 会话路径 | 待调研（可能是 `~/.claude/sessions/` 或数据库） |

#### 配置适配

**Claude Code 配置格式（MCP 标准）**：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"],
      "env": {
        "PATH": "/usr/local/bin:/usr/bin"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```

**转换逻辑**：

```typescript
// 统一配置 → Claude Code 配置
function transformToClaudeCode(config: UnifiedConfig): ClaudeCodeConfig {
  const mcpServers: Record<string, MCPServer> = {};

  for (const server of config.mcp_servers) {
    mcpServers[server.name] = {
      command: server.command,
      args: server.args || [],
      env: server.env || {},
      // 应用 tool_specific 覆盖
      ...(server.tool_specific?.['claude-code'] || {})
    };
  }

  return { mcpServers };
}
```

**Skills 配置处理**：

Claude Code 支持 Skills（类似本项目的插件），需要：
1. 检查 `enabled_for` 是否包含 `claude-code`
2. 将 Skills 路径添加到配置中
3. 可能需要复制或链接 Skills 文件

#### 会话采集

**参考项目**：[happy-cli](https://github.com/slopus/happy-cli)

**待调研事项**：
1. 会话存储格式（JSON/SQLite/其他）
2. 存储位置和文件命名规则
3. 增量采集策略（文件监听或定期扫描）
4. 会话包含的完整字段

**初步实现计划**：

```typescript
class ClaudeCodeAdapter implements ToolAdapter {
  async collectSessions(options: CollectOptions): Promise<Session[]> {
    // 1. 读取会话目录
    const sessionPath = path.join(homedir(), '.claude', 'sessions');
    const files = await readdir(sessionPath);

    // 2. 过滤和排序（增量采集）
    const relevantFiles = files
      .filter(f => options.since ? this.getFileTime(f) > options.since : true)
      .sort((a, b) => this.getFileTime(b) - this.getFileTime(a))
      .slice(0, options.limit || Infinity);

    // 3. 解析每个会话
    const sessions: Session[] = [];
    for (const file of relevantFiles) {
      const raw = await readFile(path.join(sessionPath, file), 'utf-8');
      sessions.push(this.parseSession(raw));
    }

    return sessions;
  }

  parseSession(raw: string): Session {
    // 参考 happy-cli 的解析逻辑
    // TODO: 具体实现待调研
    const data = JSON.parse(raw);
    return {
      id: data.id,
      tool: 'claude-code',
      start_time: data.startTime,
      model: data.model,
      messages: data.conversation,
      // ... 其他字段
    };
  }
}
```

#### 特殊处理

1. **权限问题**：Claude Code 的配置和会话可能需要特定权限
2. **并发访问**：Claude Code 运行时，避免同时修改配置
3. **版本兼容性**：处理不同版本的 Claude Code

### 5.3 Codex 适配器（一期）

#### 基本信息

| 属性 | 值 |
|------|-----|
| 工具名称 | `codex` |
| 配置路径 | **待调研** |
| 会话路径 | **待调研** |

#### 待调研事项

1. **Codex 的配置文件位置和格式**
   - 是否支持 MCP？
   - 配置文件路径
   - 配置文件格式（JSON/YAML/其他）

2. **Codex 的会话存储机制**
   - 是否保存历史会话？
   - 存储位置和格式
   - 如何解析会话数据

3. **Codex 的安装和运行机制**
   - 如何检测 Codex 是否已安装
   - 运行时环境要求

#### 调研计划

**Phase 1：基础调研**（1-2天）
- 安装和运行 Codex
- 查找配置文件位置
- 了解配置文件格式

**Phase 2：会话调研**（2-3天）
- 定位会话存储位置
- 分析会话存储格式
- 编写解析原型

**Phase 3：适配器实现**（3-5天）
- 实现配置转换
- 实现会话采集
- 测试和验证

#### 预期挑战

1. **Codex 可能不支持 MCP**：需要寻找替代配置方案
2. **Codex 可能不保存会话**：可能需要通过日志或 Hook 方式采集
3. **文档不足**：可能需要通过试验和逆向工程

### 5.4 其他工具适配（后续版本）

#### Gemini CLI

**优先级**：P2（二期或后续）

**待调研**：
- Gemini CLI 是否有正式发布版本
- 配置和会话机制
- MCP 支持情况

#### GitHub Copilot CLI (OpenCode)

**优先级**：P2

**挑战**：
- Copilot CLI 可能主要围绕 GitHub Copilot，而非通用 AI 助手
- 需要确认是否有本地配置和会话管理

#### 新兴 Agent

**扩展性设计**：
- 通过插件系统支持新 Agent
- 社区贡献适配器
- 提供适配器开发文档和工具

### 5.5 适配器开发指南

#### 开发流程

1. **调研阶段**
   - 安装和熟悉目标 Agent
   - 阅读官方文档
   - 定位配置和会话存储位置

2. **原型阶段**
   - 编写配置转换脚本
   - 编写会话解析脚本
   - 验证可行性

3. **实现阶段**
   - 实现 `ToolAdapter` 接口
   - 编写单元测试
   - 编写集成测试

4. **测试阶段**
   - 测试配置应用
   - 测试会话采集
   - 测试边缘情况

5. **文档阶段**
   - 编写适配器文档
   - 提供使用示例
   - 记录已知问题

#### 测试策略

**单元测试**：
- 配置转换逻辑
- 会话解析逻辑
- 错误处理

**集成测试**：
- 完整的配置应用流程
- 完整的会话采集流程
- 与真实工具的交互

**Mock 数据**：
- 提供标准测试数据集
- 覆盖常见和边缘情况

### 5.6 适配器维护计划

#### 版本兼容性

1. **目标工具版本跟踪**
   - 记录适配器测试过的工具版本
   - 关注工具的重大更新
   - 及时适配不兼容的变更

2. **向后兼容**
   - 尽量支持多个工具版本
   - 提供版本检测和适配
   - 废弃旧版本前提前通知

#### Bug 修复

1. **错误报告机制**
   - GitHub Issues
   - 错误日志收集
   - 用户反馈渠道

2. **修复优先级**
   - P0：数据丢失或损坏
   - P1：功能不可用
   - P2：边缘情况
   - P3：优化和改进

#### 持续改进

1. **性能优化**
   - 采集速度优化
   - 内存占用优化
   - 错误恢复优化

2. **用户体验**
   - 错误提示改进
   - 进度显示优化
   - 文档完善

## 6. MVP 功能范围

### 6.1 MVP 目标

**核心目标**：验证产品核心价值，解决用户最痛的问题，获得早期反馈。

**验证假设**：
1. 用户确实需要统一管理多个 AI 工具的配置
2. 跨工具检索会话记录有实际价值
3. 配置同步能提升多设备用户的使用体验

### 6.2 Phase 1：MVP 功能清单

#### 必须完成（P0）

**1. 统一配置管理**
- ✅ 统一配置文件（YAML 格式）
- ✅ 配置验证（语法和类型检查）
- ✅ 配置应用（Claude Code）
- ⚠️ 配置应用（Codex，待调研后决定）
- ✅ 配置版本管理
- ✅ 配置差异对比

**2. Claude Code 适配**
- ✅ 工具检测
- ✅ MCP 服务器配置转换
- ✅ 配置应用
- ✅ 会话采集（基于 happy-cli 的研究）
- ✅ 增量采集
- ⚠️ Skills 配置（如果时间允许）

**3. 会话记录存储和检索**
- ✅ SQLite 数据库存储
- ✅ 全文搜索（FTS5）
- ✅ 基础筛选（时间、工具）
- ✅ 会话详情查看
- ✅ 搜索结果展示

**4. CLI 工具**
- ✅ 核心命令：`init`, `config`, `search`, `show`
- ✅ 命令行参数解析
- ✅ 彩色输出和格式化
- ✅ 错误提示和日志
- ✅ 帮助文档

**5. 基础设施**
- ✅ 项目结构搭建
- ✅ 单元测试框架
- ✅ 构建和打包流程
- ✅ 版本管理
- ✅ README 文档

#### 暂缓实现（P1 - 一期后期）

- TUI 界面
- 多设备同步
- Codex 完整适配（待调研完成）
- 会话标记和导出
- 配置热重载

#### 不在 MVP 范围内（P2）

- Web UI
- 插件系统
- 其他工具适配（Gemini CLI、Copilot CLI）
- 语义搜索
- 数据加密
- 性能优化

### 6.3 MVP 功能详细规格

#### CLI 命令清单（Phase 1）

```bash
# 初始化
abridge init                          # 创建默认配置文件

# 配置管理
abridge config show                   # 显示当前配置
abridge config validate               # 验证配置
abridge config apply                  # 应用配置到所有工具
abridge config diff                   # 显示与工具配置的差异

# 会话管理
abridge collect                       # 采集会话记录
abridge search <query>                # 搜索会话
abridge show <session-id>             # 显示会话详情

# 系统命令
abridge status                        # 显示系统状态
abridge doctor                        # 诊断问题
abridge --version                     # 显示版本
abridge --help                        # 显示帮助
```

#### 配置文件规格（Phase 1）

```yaml
# ~/.abridge/config.yaml
version: "1.0.0"

# MCP 服务器配置
mcp_servers:
  - name: filesystem
    command: npx
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"]

  - name: github
    command: npx
    args: ["-y", "@modelcontextprotocol/server-github"]

# 数据库配置
database:
  path: ~/.abridge/sessions.db
  # 不支持加密（MVP）

# 同步配置（MVP 不实现）
# sync:
#   enabled: false
```

#### 会话搜索规格（Phase 1）

**支持的搜索模式**：
- 简单关键词搜索
- 时间范围筛选
- 工具筛选

**不支持的搜索**（后续版本）：
- 标签筛选（MVP 无标签功能）
- 模糊搜索
- 语义搜索

**示例**：
```bash
# 简单搜索
abridge search "docker"

# 时间筛选
abridge search "api" --after "2025-01-01"

# 工具筛选
abridge search "react" --tool claude-code
```

### 6.4 MVP 验收标准

#### 功能完整性

- [ ] Claude Code 配置可以成功应用
- [ ] 可以搜索到 Claude Code 的历史会话
- [ ] 配置验证能捕获常见错误
- [ ] 所有命令都有帮助文档
- [ ] 错误提示清晰且可操作

#### 性能标准

- [ ] `abridge search` 在 1000 条会话下 < 1 秒
- [ ] `abridge collect` 增量采集 < 5 秒
- [ ] CLI 启动时间 < 500ms
- [ ] 内存占用 < 100MB（空闲时）

#### 稳定性标准

- [ ] 单元测试覆盖率 > 70%
- [ ] 核心流程有集成测试
- [ ] 没有已知的 P0/P1 Bug
- [ ] 配置错误不会导致程序崩溃

#### 文档标准

- [ ] README 包含安装和使用说明
- [ ] 有 3-5 个使用示例
- [ ] 已知限制和问题有说明
- [ ] 贡献指南初稿

### 6.5 MVP 发布计划

#### 开发阶段（4-6 周）

**Week 1-2：基础架构**
- 项目结构搭建
- CLI 框架集成
- 配置解析和验证
- 单元测试框架

**Week 3：配置管理**
- Claude Code 适配器
- 配置转换逻辑
- 配置应用功能
- 集成测试

**Week 4：会话管理**
- 会话采集（参考 happy-cli）
- 数据库设计实现
- 搜索功能实现
- 性能优化

**Week 5：完善和测试**
- 错误处理完善
- 边缘情况处理
- 文档编写
- Bug 修复

**Week 6：发布准备**
- 打包和发布流程
- README 完善
- Beta 测试
- 正式发布 v0.1.0

#### 发布后的迭代

**v0.2.0（MVP 后 2-4 周）**
- Codex 适配（如果调研成功）
- TUI 界面基础版本
- 多设备同步

**v0.3.0（MVP 后 1-2 月）**
- 插件系统
- 更多工具适配
- 会话导出功能

### 6.6 MVP 后续路线图

#### 短期（3 个月内）

1. **完善核心功能**
   - TUI 界面
   - 多设备同步
   - Codex 完整支持

2. **提升用户体验**
   - 更好的错误提示
   - 进度条和加载动画
   - 配置向导

3. **扩展 Agent 支持**
   - Gemini CLI（如果已发布）
   - 其他新兴编程代理

#### 中期（6 个月内）

1. **插件生态**
   - 插件系统
   - 插件开发文档
   - 社区贡献指南

2. **高级功能**
   - 语义搜索
   - 会话标记和分类
   - 数据分析和统计

3. **跨平台支持**
   - Windows 支持
   - Linux 发行版适配

#### 长期（1 年+）

1. **产品化**
   - Web UI
   - 移动端（可能）
   - 企业功能（团队协作）

2. **生态建设**
   - 与 Agent 作者合作
   - 推动配置标准化
   - 建立最佳实践

3. **商业化探索**
   - 付费功能（可选）
   - 企业支持
   - 培训和咨询

### 6.7 成功指标

#### 用户增长

- **MVP 发布后 1 个月**：50+ GitHub Stars
- **MVP 发布后 3 个月**：200+ GitHub Stars
- **实际用户**：至少 10 个活跃用户（通过反馈或 Issues 判断）

#### 使用数据

- **平均每周采集**：至少 5 次会话采集
- **搜索频率**：平均每周至少 2 次搜索
- **配置应用**：平均每月至少 1 次配置变更

#### 社区反馈

- **Issues 数量**：至少 5 个反馈 Issues
- **Pull Requests**：至少 1 个社区贡献
- **正面反馈**：至少 3 个用户表示有用

#### 技术指标

- **Bug 报告**：P0/P1 Bug < 3 个
- **性能**：90% 的搜索 < 1 秒
- **稳定性**：崩溃率 < 1%

## 7. 非功能需求

### 7.1 性能要求

#### 响应时间

| 操作 | 目标 | 可接受 |
|------|------|--------|
| CLI 启动 | < 300ms | < 500ms |
| 配置验证 | < 100ms | < 200ms |
| 配置应用 | < 2s | < 5s |
| 会话搜索（1000条） | < 500ms | < 1s |
| 会话采集（增量） | < 3s | < 10s |
| 会话详情查看 | < 200ms | < 500ms |

#### 资源占用

| 指标 | 空闲 | 运行中 | 峰值 |
|------|------|--------|------|
| 内存占用 | < 50MB | < 150MB | < 300MB |
| CPU 使用 | < 1% | < 20% | < 80% |
| 磁盘占用（程序） | < 10MB | - | - |
| 数据库大小（1000会话） | < 50MB | - | - |

#### 并发支持

- 支持单用户多实例并发（不同终端）
- 文件锁机制防止配置冲突
- 数据库连接池支持并发查询

### 7.2 可靠性要求

#### 错误处理

1. **优雅降级**
   - 配置应用失败不影响其他工具
   - 会话采集失败记录日志，不中断流程
   - 搜索失败提供有意义的错误提示

2. **数据完整性**
   - 配置应用前自动备份
   - 数据库事务保证
   - 崩溃恢复机制

3. **错误恢复**
   - 配置版本回滚
   - 数据库修复工具（`abridge doctor --fix`）
   - 采集失败自动重试（最多 3 次）

#### 数据安全

1. **备份机制**
   - 配置自动备份（保留最近 5 个版本）
   - 数据库定期备份（可选）
   - 导出功能作为备份手段

2. **数据迁移**
   - 版本升级时自动迁移数据库
   - 迁移失败回滚机制
   - 迁移前强制备份

### 7.3 兼容性要求

#### 操作系统支持

| 操作系统 | 版本 | MVP | 后续 |
|----------|------|-----|------|
| macOS | 12+ (Monterey) | ✅ | - |
| Linux | Ubuntu 20.04+, Debian 11+ | ✅ | - |
| Windows | 10/11 | ❌ | v0.3.0+ |

#### 运行时要求

- **Node.js**：18.0.0+ 或 **Bun**：1.0.0+
- **磁盘空间**：至少 100MB 可用空间
- **网络**：安装时需要，运行时可选（某些功能）

#### AI 工具版本

- **Claude Code**：最新正式版（向后兼容 2 个大版本）
- **Codex**：待调研后确定

### 7.4 可维护性要求

#### 代码质量

- TypeScript 严格模式
- 单元测试覆盖率 > 70%
- ESLint + Prettier 统一代码风格
- 类型覆盖率 100%

#### 文档要求

1. **代码文档**
   - 公共 API 必须有 JSDoc 注释
   - 复杂逻辑必须有注释说明
   - README 包含快速开始指南

2. **架构文档**
   - 架构设计文档
   - 适配器开发指南
   - 贡献指南

3. **变更日志**
   - 遵循 [Keep a Changelog](https://keepachangelog.com/)
   - 每个版本记录变更内容
   - 标记 Breaking Changes

#### 日志和监控

1. **日志级别**
   - DEBUG：详细调试信息
   - INFO：一般信息（默认）
   - WARN：警告信息
   - ERROR：错误信息

2. **日志位置**
   - `~/.abridge/logs/`
   - 按日期分割日志文件
   - 自动清理 30 天前的日志

3. **诊断工具**
   - `abridge doctor`：诊断常见问题
   - `abridge status`：显示系统状态
   - `--verbose` 模式：详细日志输出

### 7.5 安全性要求

#### 配置安全

1. **文件权限**
   - 配置文件权限：600（仅用户可读写）
   - 数据库权限：600
   - 日志文件权限：644

2. **敏感信息**
   - 检测配置中的 API Key、密码等
   - 提示用户加密或使用环境变量
   - 导出时过滤敏感信息

#### 数据隐私

1. **本地优先**
   - 所有数据默认存储在本地
   - 不主动上传任何数据到远程
   - 明确提示用户哪些操作涉及网络

2. **会话数据**
   - 敏感内容自动检测
   - 可选的数据库加密
   - 安全删除选项

3. **插件安全**
   - 插件沙箱隔离
   - 权限声明和审查
   - 可选的签名验证

#### 依赖安全

1. **依赖扫描**
   - 使用 npm audit 定期扫描
   - CI/CD 集成安全检查
   - 及时更新有漏洞的依赖

2. **供应链安全**
   - 使用 npm 的 `package-lock` 或 bun lockb
   - 验证依赖完整性
   - 限制依赖来源（仅 npm 官方源）

### 7.6 可用性要求

#### 用户界面

1. **CLI 体验**
   - 清晰的命令结构
   - 有帮助的错误提示
   - 彩色输出提升可读性
   - 自动补全支持（bash/zsh/fish）

2. **文档质量**
   - 快速开始（5 分钟内上手）
   - 常见问题解答
   - 示例代码
   - 视频教程（可选）

3. **国际化**
   - MVP 仅支持英文
   - 后续考虑多语言支持
   - 日期时间格式本地化

#### 学习曲线

- **新手友好**：默认配置开箱即用
- **高级功能**：提供详细文档
- **渐进式复杂度**：从简单到高级

### 7.7 可扩展性要求

#### 插件系统（P1）

1. **插件接口**
   - 清晰的插件 API
   - 插件生命周期管理
   - 依赖和版本管理

2. **插件发现**
   - npm 插件命名规范
   - 插件搜索和安装
   - 插件更新机制

#### 工具适配

1. **适配器框架**
   - 统一的适配器接口
   - 适配器开发工具
   - 测试框架

2. **社区贡献**
   - 贡献指南
   - 插件模板
   - 最佳实践文档

### 7.8 测试要求

#### 测试覆盖率

| 类型 | 目标 | 最低 |
|------|------|------|
| 单元测试 | > 80% | > 70% |
| 集成测试 | 核心流程 100% | 主要流程 > 80% |
| E2E 测试 | 关键场景 | - |

#### 测试类型

1. **单元测试**
   - 配置解析和验证
   - 数据转换逻辑
   - 搜索算法
   - 工具函数

2. **集成测试**
   - 配置应用流程
   - 会话采集流程
   - 搜索和查询流程
   - 多工具协同

3. **E2E 测试**
   - 完整用户场景
   - 跨平台兼容性
   - 性能测试
   - 压力测试

### 7.9 部署要求

#### 安装方式

1. **npm 安装**（主要）
   ```bash
   npm install -g abridge
   ```

2. **安装脚本**
   ```bash
   curl -sSL https://get.aihub.dev | sh
   ```

3. **手动安装**
   - 下载二进制
   - 解压到 PATH

#### 更新机制

1. **版本检查**
   - 定期检查（每周一次）
   - 可配置关闭

2. **更新提示**
   - 显示新版本信息
   - 提供更新命令

3. **自动更新**
   - 可选的自动更新
   - 默认手动确认

#### 卸载清理

1. **完整卸载**
   - 删除程序文件
   - 询问是否删除配置和数据
   - 清理环境变量和自动补全

2. **保留选项**
   - 仅卸载程序
   - 保留用户数据

## 8. 开源项目规划

### 8.1 开源协议

**选择协议**：MIT License

**理由**：
- 最宽松的开源协议，允许任意使用
- 便于商业使用和二次开发
- 社区接受度高
- 与 happy-cli 等参考项目一致

**协议要点**：
- ✅ 允许商业使用
- ✅ 允许修改和分发
- ✅ 允许私用
- ⚠️ 需要包含版权声明和许可证
- ❌ 不提供任何担保

### 8.2 项目结构

#### 仓库组织

```
github.com/your-username/abridge/
├── .github/
│   ├── workflows/           # CI/CD
│   ├── ISSUE_TEMPLATE/      # Issue 模板
│   └── PULL_REQUEST_TEMPLATE.md
├── src/                     # 源代码
├── tests/                   # 测试
├── docs/                    # 文档
├── examples/                # 示例配置
├── .gitignore
├── LICENSE
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── package.json
```

#### 分支策略

- `main`：稳定版本，仅接受经过测试的 PR
- `develop`：开发分支
- `feature/*`：功能分支
- `fix/*`：Bug 修复分支
- `release/*`：发布分支

### 8.3 社区建设

#### 贡献指南

**CONTRIBUTING.md 内容**：
1. 如何开始贡献
2. 开发环境设置
3. 代码风格指南
4. 提交规范（Conventional Commits）
5. Pull Request 流程
6. 代码审查标准

#### Issue 模板

**Bug 报告**：
- 问题描述
- 复现步骤
- 期望行为
- 环境信息（OS、Node 版本等）
- 日志和截图

**功能请求**：
- 功能描述
- 使用场景
- 可能的实现方案
- 是否愿意贡献

**适配器请求**：
- 工具名称和版本
- 配置文件位置和格式
- 会话存储机制
- 是否愿意开发

#### Pull Request 模板

- PR 描述
- 相关 Issue
- 变更类型（feat/fix/docs/refactor）
- 测试情况
- 截图（如果适用）

### 8.4 发布流程

#### 版本号规范

遵循 [Semantic Versioning](https://semver.org/)：
- **MAJOR.MINOR.PATCH**（如 0.1.0）
- MAJOR：不兼容的 API 变更
- MINOR：向后兼容的功能新增
- PATCH：向后兼容的 Bug 修复

#### 发布检查清单

- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] CHANGELOG 已更新
- [ ] 版本号已更新
- [ ] package.json 已更新
- [ ] Git tag 已创建
- [ ] npm publish 成功
- [ ] GitHub Release 已发布

#### 更新公告

每次发布包含：
- 主要功能亮点
- Breaking Changes
- 已知问题
- 升级指南

### 8.5 路线图透明化

#### 公开路线图

维护 `ROADMAP.md`：
- 当前正在开发的功能
- 下一个版本的计划
- 长期愿景
- 社区投票功能优先级

#### Milestone 使用

- 每个版本创建一个 Milestone
- 关联相关 Issues 和 PRs
- 追踪进度

#### 定期更新

- 每月发布社区更新
- 汇总本月进展
- 感谢贡献者
- 下月计划

### 8.6 沟通渠道

#### 官方渠道

1. **GitHub Issues**：主要沟通渠道
   - Bug 报告
   - 功能请求
   - 问题讨论

2. **GitHub Discussions**（可选）：
   - 使用问题
   - 最佳实践分享
   - 社区交流

3. **文档**：
   - README
   - 官方文档（可能用 Vercel/Netlify 托管）
   - API 文档

#### 社交媒体（可选）

- Twitter/X：更新公告
- Dev.to：技术文章
- YouTube：教程视频

### 8.7 贡献者激励

#### 贡献者认可

1. **README 贡献者列表**
2. **CHANGELOG 感谢**
3. **GitHub Contributors 页面**
4. **贡献者徽章**（ Shields.io）

#### 贡献者权益

1. **决策参与**：核心贡献者参与技术决策
2. **早期访问**：新功能的早期测试权限
3. **优先支持**：问题和反馈优先处理

### 8.8 商业化考虑

#### 原则

**保持开源核心**：
- 核心功能永远开源免费
- 社区驱动的开发模式

**可选的商业服务**（未来）：
- 企业支持服务
- 定制开发
- 培训和咨询
- 托管服务（如果需要云功能）

#### 商标保护

- 保护项目名称和 Logo
- 允许在注明来源的情况下使用
- 防止恶意抢注

### 8.9 法律事项

#### 知识产权

- 确保所有代码有清晰版权
- 第三方代码遵守其协议
- 依赖库协议兼容性检查

#### 隐私政策

即使是本地工具，也应提供：
- 数据收集声明（声明不收集）
- 数据存储说明
- 用户权利说明

#### 责任限制

- MIT 协议的免责声明
- 明确项目按"原样"提供
- 不保证适用性和无错误

## 9. 待研究事项

### 9.1 技术调研

#### Claude Code 会话存储

**调研目标**：
- 会话存储位置
- 存储格式和结构
- 增量采集策略
- 并发访问处理

**调研方法**：
1. 阅读 Claude Code 文档
2. 查看 `~/.claude/` 目录结构
3. 分析 happy-cli 源代码
4. 实验和验证

**预期输出**：
- 会话存储格式文档
- 采集实现方案
- 潜在问题和解决方案

#### Codex 配置和会话

**调研目标**：
- Codex 是否支持 MCP
- 配置文件位置和格式
- 会话记录机制
- 是否适合适配

**调研方法**：
1. 安装和运行 Codex
2. 查找配置文件
3. 测试配置修改
4. 分析会话存储

**决策点**：
- 如果 Codex 不适合 MVP，是否推迟到二期？
- 或者降低支持级别（仅配置，不会话）？

#### 技术栈验证

**调研目标**：
- Bun 的稳定性和兼容性
- better-sqlite3 在 Bun 上的支持
- Ink + Bun 的兼容性

**验证方法**：
1. 创建 Bun 测试项目
2. 测试关键库的兼容性
3. 性能基准测试
4. 评估开发体验

**决策标准**：
- 如果 Bun 有重大问题，降级到 Node.js LTS
- 保持代码可移植性

### 9.2 产品调研

#### 竞品分析

**分析对象**：
1. happy-cli - 会话管理参考
2. MCP Inspector - 配置管理参考
3. 其他 AI 工具管理工具

**分析维度**：
- 功能对比
- 技术方案
- 用户体验
- 社区活跃度

**输出**：
- 差异化分析
- 可借鉴的设计
- 避免的陷阱

#### 用户调研

**调研方法**：
1. 发布想法到社交媒体（Twitter/X、Hacker News）
2. 在 Reddit、Discord 等社区讨论
3. 询问身边开发者

**调研问题**：
- 你使用哪些 AI 工具？
- 最大的痛点是什么？
- 会愿意尝试这个工具吗？
- 期望的优先功能是什么？

### 9.3 设计调研

#### 配置文件设计

**调研目标**：
- MCP 协议标准配置
- 各工具的配置差异
- 统一配置的最佳实践

**关键问题**：
1. 配置文件格式：YAML vs JSON vs TOML
2. 配置文件位置：`~/.abridge/` vs `~/.config/abridge/`
3. 环境变量支持：如何优雅地处理
4. 配置继承：是否需要多个配置文件

**原型测试**：
- 创建示例配置文件
- 测试可读性和可写性
- 收集反馈

#### CLI 设计

**参考项目**：
- GitHub CLI (gh)
- Vercel CLI
- happy-cli
- Claude Code CLI

**设计要素**：
- 命令结构
- 参数命名
- 输出格式
- 错误提示
- 帮助文档

**可用性测试**：
- 让朋友试用原型
- 观察使用过程
- 收集困惑点

### 9.4 实施调研

#### 开发工具链

**调研内容**：
- Bun 或 Node.js 开发体验
- TypeScript 配置优化
- 测试框架选择
- 构建工具选择

**决策**：
- 确定最终技术栈
- 配置开发环境
- 编写开发指南

#### CI/CD 设计

**调研内容**：
- GitHub Actions 配置
- 自动化测试流程
- 发布自动化
- 跨平台测试

**目标**：
- 每次提交自动测试
- PR 自动检查
- 发布半自动化

### 9.5 调研时间表

| 调研项 | 优先级 | 预计时间 | 负责人 |
|--------|--------|----------|--------|
| Claude Code 会话存储 | P0 | 2-3 天 | 待定 |
| Bun 技术栈验证 | P0 | 1-2 天 | 待定 |
| Codex 调研 | P1 | 3-5 天 | 待定 |
| 竞品分析 | P1 | 2-3 天 | 待定 |
| 用户调研 | P1 | 持续 | 待定 |
| 配置设计 | P0 | 1-2 天 | 待定 |
| CLI 设计 | P1 | 1-2 天 | 待定 |

### 9.6 调研成果管理

#### 文档化

每个调研项需要产出：
1. 调研报告（Markdown）
2. 关键发现和结论
3. 推荐方案或决策
4. 未解决问题

#### 跟踪机制

- 在 GitHub Issues 跟踪调研进度
- 标记 `research` 标签
- 调研完成后关闭 Issue

#### 知识沉淀

- 调研报告存入 `docs/research/`
- 建立知识库
- 便于后续查阅

## 10. AI 协作开发指南

### 10.1 为何需要这个章节

**本 PRD 的特殊之处**：
- 主要读者是**大模型**，用于协作开发
- 需要让 AI 快速理解项目意图
- 便于在对话中引用 PRD 内容

### 10.2 如何使用本 PRD 与 AI 协作

#### 在 Claude Code 中使用

**完整引用**：
```
请阅读 /path/to/ai-tools-unified-manager-prd.md，然后帮我实现 Claude Code 适配器的配置转换功能
```

**章节引用**：
```
参考 PRD 第 5.2 节 "Claude Code 适配器"，帮我实现 transformConfig 方法
```

**问题定位**：
```
根据 PRD 第 7.1 节 "性能要求"，CLI 启动时间目标是什么？
```

#### 在其他 AI 工具中使用

**GitHub Copilot**：
- 将 PRD 添加到工作区
- Copilot 会自动参考上下文

**ChatGPT/Claude Web**：
- 复制相关章节到对话
- 或上传整个文档

### 10.3 PRD 文档结构说明

#### 章节导航

| 章节 | 内容 | 适用场景 |
|------|------|----------|
| 1. 项目概述 | 产品定义、痛点、愿景 | 快速了解项目 |
| 2. 目标用户 | 用户画像、使用场景 | 理解需求 |
| 3. 核心功能 | 详细功能规格 | 实现功能 |
| 4. 技术方案 | 架构、技术栈 | 技术决策 |
| 5. 工具适配 | 适配器接口、实现 | 开发适配器 |
| 6. MVP 范围 | 功能清单、验收标准 | 迭代规划 |
| 7. 非功能需求 | 性能、安全、兼容性 | 质量保证 |
| 8. 开源规划 | 协议、社区、流程 | 开源运营 |
| 9. 待研究 | 调研事项 | 前期准备 |
| 10. AI 协作 | 本章节 | 与 AI 协作 |

#### 关键术语

| 术语 | 定义 |
|------|------|
| MCP | Model Context Protocol，模型上下文协议 |
| Adapter | 适配器，连接 AI 工具和本项目的桥梁 |
| Session | 会话，用户与 AI 工具的对话记录 |
| Config | 配置，MCP 服务器和工具的设置 |
| TUI | Terminal User Interface，终端用户界面 |

### 10.4 与 AI 协作的最佳实践

#### 提示词技巧

1. **明确引用章节**
   ```
   根据 PRD 第 3.1 节，帮我实现配置验证功能
   ```

2. **提供上下文**
   ```
   我正在开发 abridge 项目的会话搜索功能。
   参考 PRD 第 3.5 节和第 4.6 节的数据模型，
   帮我设计搜索 API
   ```

3. **指定约束条件**
   ```
   按照 PRD 第 7.1 节的性能要求，优化搜索查询
   ```

#### 迭代开发流程

1. **需求确认**
   ```
   根据 PRD 第 6.3 节的 MVP 规格清单，
   我们应该先实现哪个命令？
   ```

2. **设计讨论**
   ```
   PRD 第 4.5 节的项目结构是否合理？
   有没有需要调整的地方？
   ```

3. **代码实现**
   ```
   按照 PRD 第 5.2 节的接口定义，
   实现 ClaudeCodeAdapter 类
   ```

4. **测试验证**
   ```
   根据 PRD 第 6.4 节的验收标准，
   检查实现是否满足要求
   ```

### 10.5 常见协作场景

#### 场景 1：开始新功能

```
我要开始实现会话搜索功能。
请阅读 PRD 第 3.5 节 "跨工具检索"，
帮我：
1. 设计搜索 API
2. 实现 CLI 命令
3. 编写单元测试
```

#### 场景 2：调试问题

```
配置应用失败了。根据 PRD 第 3.2 节，
配置适配应该怎么做？
帮我排查问题：
1. 检查配置转换逻辑
2. 验证配置文件权限
3. 查看错误日志
```

#### 场景 3：技术决策

```
PRD 第 4.3 节推荐使用 Bun，
但我发现 better-sqlite3 不兼容。
根据第 9.3 节的调研要求，
帮我：
1. 分析问题
2. 提出替代方案
3. 更新技术决策
```

#### 场景 4：代码审查

```
请根据 PRD 第 7.5 节的安全要求，
审查这段配置解析代码：
[paste code]
重点关注：
1. 敏感信息处理
2. 路径遍历防护
3. 错误处理
```

### 10.6 保持 PRD 同步

#### 更新原则

1. **实现后更新**
   - 功能实现后，更新相关章节
   - 标记为"已实现"

2. **决策记录**
   - 技术决策记录到 PRD
   - 理由和依据要清晰

3. **问题跟踪**
   - 未解决的问题记录到"待研究事项"
   - 已解决的问题归档

#### 版本管理

- PRD 版本与项目版本同步
- 保留历史版本
- 使用 Git 追踪变更

### 10.7 给 AI 的建议

#### 理解优先级

- P0 功能优先实现
- P1 功能在一期后期或二期
- P2 功能长期规划

#### 遵循规范

- 遵循 TypeScript 严格模式
- 遵循测试覆盖率要求
- 遵循代码风格指南

#### 提问策略

- 如果 PRD 信息不足，明确指出需要什么
- 提供多个方案供选择
- 说明每个方案的优缺点

#### 持续学习

- 参考 PRD 第 5.5 节的适配器开发指南
- 学习 happy-cli 和 OpenCode 的实现
- 关注 Coding Agents 生态发展

---

## 附录

### A. 参考资料

1. **参考项目**
   - [happy-cli](https://github.com/slopus/happy-cli) - 会话管理灵感
   - [MCP Inspector](https://github.com/modelcontextprotocol/inspector) - MCP 协议参考
   - [Commander.js](https://github.com/tj/commander.js) - CLI 框架
   - [Ink](https://github.com/vadimdemedes/ink) - TUI 框架

2. **技术文档**
   - [Model Context Protocol](https://modelcontextprotocol.io/)
   - [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
   - [Semantic Versioning](https://semver.org/)
   - [Conventional Commits](https://www.conventionalcommits.org/)

3. **最佳实践**
   - [12 Factor App](https://12factor.net/)
   - [Command Line Interface Guidelines](https://clig.dev/)
   - [Awesome CLI](https://github.com/agarrharr/awesome-cli)

### B. 快速命令参考

```bash
# 安装
npm install -g abridge

# 初始化
abridge init

# 配置管理
abridge config show
abridge config validate
abridge config apply
abridge config diff

# 会话管理
abridge collect
abridge search <query>
abridge show <session-id>

# 系统命令
abridge status
abridge doctor

# 帮助
abridge --help
abridge <command> --help
```

### C. 配置示例

完整的配置示例参见 `examples/config.yaml`。

### D. 贡献者

感谢所有为本项目做出贡献的人。

### E. 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。
