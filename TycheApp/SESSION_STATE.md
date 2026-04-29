# TycheApp — 会话状态记录

**记录时间:** 2026-04-27
**原因:** Claude Code 会话重启，恢复上下文

---

## 项目定位

**TycheApp** 是为 **TycheEngine**（`D:\dev\TycheEngine`，事件持久化层）设计的**独立本地应用前端**。TycheEngine 当前已完成 Phase 1（Schema & Backend Foundation），核心功能是通过 ClickHouse 持久化引擎事件。

> TycheEngine 内部已有一个基础 `electron-ui` 目录（`D:\dev\TycheEngine\electron-ui`），使用 Electron + Vue3 + ZeroMQ + msgpack。TycheApp 将作为更专业的独立桌面应用来构建。

---

## 已确认技术栈

- **前端框架:** Vue 3 + TypeScript
- **桌面壳:** Electron 36 + electron-vite
- **通信:** ZeroMQ（与 TycheEngine 的 XPUB/XSUB 对接）
- **序列化:** msgpack
- **状态管理:** Pinia
- **Docking 布局:** dockview-vue（原生 Vue3 支持，专业级 docking）
- **构建工具:** Vite 6 + electron-vite

---

## 已确认核心需求（量化交易员导向）

| 优先级 | 功能 | 说明 |
|--------|------|------|
| **P0** | Docking 可拖拽面板 | 多窗口拖拽 + Docking 布局，**必须在第一阶段实现** |
| **P0** | 闪电下单 | 快速下单交互 |
| **P1** | 策略监控 UI | 持仓 Greeks 展示 |
| **P1** | 波动率曲线拟合 | 可视化 |
| **P1** | 做市策略监控 | 实时监控面板 |

---

## 当前状态

### 已完成

1. **项目骨架搭建完成** — Vite + Electron + Vue3 + TypeScript
2. **主进程 ZeroMQ 连接层** — ConnectionManager 类，支持事件订阅、心跳、Admin 查询
3. **预加载脚本 (Preload)** — 安全的 IPC 桥接 API
4. **Pinia Store** — 引擎状态、事件流、模块列表管理
5. **Dockview 布局框架** — 三面板布局（Connection / Events / Modules）
6. **基础面板组件**
   - ConnectionPanel — 连接控制 + 状态显示
   - EventPanel — 事件流实时显示 + 类型过滤
   - ModulePanel — 模块列表 + 健康状态
7. **开发模式验证通过** — `npm run dev` 可正常启动 Electron 窗口

### 项目结构

```
TycheApp/
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── electron.vite.config.ts
├── src/
│   ├── main/
│   │   ├── index.ts          # Electron 主进程入口
│   │   └── connection.ts     # ZeroMQ 连接管理器
│   ├── preload/
│   │   └── index.ts          # IPC 桥接 API
│   └── renderer/
│       ├── index.html
│       ├── main.ts            # Vue 入口
│       ├── App.vue            # Dockview 根布局
│       ├── types/
│       │   └── index.ts       # 类型定义
│       ├── store/
│       │   └── engine.ts      # Pinia Store
│       └── components/
│           └── panels/
│               ├── ConnectionPanel.vue
│               ├── EventPanel.vue
│               └── ModulePanel.vue
```

### 待办

1. ~~决定 TycheApp 是否复用 TycheEngine 的 `electron-ui` 代码~~ → **全新搭建**
2. ~~调研 Docking 布局方案~~ → **dockview-vue**
3. ~~定义与 TycheEngine 的 IPC/消息协议~~ → **复用现有 ZeroMQ + msgpack 协议**
4. ~~创建项目骨架~~ → **完成**
5. ~~启动验证~~ → **完成**
6. 设计第一阶段实现计划
7. 对接 TycheEngine 实测连接
8. 闪电下单面板设计

---

## 关键决策记录

- **2026-04-27**: 决定全新搭建，不复用 `electron-ui`
- **2026-04-27**: 选择 `dockview-vue` 作为 docking 方案（原生 Vue3、MIT、活跃维护）
- **2026-04-27**: 复用 TycheEngine 现有通信协议（端口 5556/5558/5560，msgpack）
- **2026-04-27**: Electron 36 + electron-vite 3.x，开发环境变量使用 `ELECTRON_RENDERER_URL`

---

## 相关项目

- **TycheEngine:** `D:\dev\TycheEngine` — 后端引擎（Phase 1 完成）
- **TycheTUI:** `D:\dev\TycheTUI` — 基于 OpenTUI 的终端 UI（并行项目）
