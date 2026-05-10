# TycheApp

> 面向量化交易员的 TycheEngine 专业桌面客户端

TycheApp 是 [TycheEngine](D:/dev/TycheEngine) 的独立桌面前端,基于 Electron + Vue 3 构建,为量化交易员提供可拖拽 docking 布局、实时事件流、闪电下单与策略监控等专业功能。

---

## 技术栈

| 类别 | 选型 |
|------|------|
| 桌面壳 | Electron 36 + electron-vite 3.x |
| 前端框架 | Vue 3.5 + TypeScript 5.8 |
| 状态管理 | Pinia 3 |
| Docking 布局 | dockview-vue 5(原生 Vue3、支持 popout) |
| 通信层 | ZeroMQ 6(SUB/REQ) |
| 序列化 | @msgpack/msgpack |
| 日志 | electron-log |
| 构建 | Vite 6 + electron-builder |

---

## 目录结构

```
TycheApp/
├── electron.vite.config.ts      # 主进程 / preload / renderer 三段式构建配置
├── package.json
├── src/
│   ├── main/
│   │   ├── index.ts             # Electron 主进程入口、窗口与 IPC 注册
│   │   └── connection.ts        # ZeroMQ 连接管理器(事件/心跳/Admin)
│   ├── preload/
│   │   └── index.ts             # contextBridge 安全 IPC 桥接
│   └── renderer/
│       ├── main.ts              # Vue 应用入口
│       ├── App.vue              # Dockview 根布局 + popout 支持
│       ├── components/
│       │   ├── Toolbar.vue      # 顶部工具条(添加面板 / 保存 / 加载 / 重置)
│       │   ├── HeaderActions.vue
│       │   └── panels/          # 各功能面板
│       │       ├── ConnectionPanel.vue
│       │       ├── EventPanel.vue
│       │       ├── ModulePanel.vue
│       │       ├── OrderPanel.vue
│       │       ├── GreeksPanel.vue
│       │       ├── VolCurvePanel.vue
│       │       └── MarketMakingPanel.vue
│       ├── composables/
│       │   └── usePanelState.ts # 面板状态持久化辅助
│       ├── store/
│       │   ├── engine.ts        # 引擎状态 / 事件流 / 模块列表
│       │   └── layout.ts        # 布局与面板状态(localStorage)
│       └── types/
│           └── index.ts
└── SESSION_STATE.md
```

---

## 核心面板

| 面板 | 组件 | 职责 |
|------|------|------|
| Connection | ConnectionPanel | 连接 / 断开 TycheEngine,展示连接状态 |
| Event Stream | EventPanel | 实时订阅事件流,支持类型过滤(on/ack/whisper/broadcast) |
| Modules | ModulePanel | 模块清单与心跳健康度(OK / WARN / EXPIRED) |
| Quick Order | OrderPanel | 闪电下单 |
| Greeks | GreeksPanel | 持仓 Greeks 监控 |
| Vol Surface | VolCurvePanel | 波动率曲线/曲面拟合可视化 |
| Market Making | MarketMakingPanel | 做市策略监控 |

所有面板支持:
- **拖拽 docking** — 任意分组、堆叠、并排
- **Popout 独立窗口** — Shift + 拖拽自动转为独立 BrowserWindow
- **布局持久化** — 保存到 localStorage,启动时自动恢复

---

## 与 TycheEngine 的通信协议

复用 TycheEngine 现有的 ZeroMQ + msgpack 协议。默认连接 `127.0.0.1`:

| 端口 | 套接字模式 | 用途 |
|------|-----------|------|
| 5556 | SUB | 事件订阅(业务事件流) |
| 5558 | SUB | 心跳订阅(模块健康度) |
| 5560 | REQ | Admin 查询(`STATUS` / `MODULES`) |

事件按名称前缀分类:`on_common_*` / `on_*` / `ack_*` / `whisper_*` / `broadcast_*`。

---

## 启动与开发

### 环境要求

- Node.js ≥ 18
- Windows / macOS / Linux
- 同机或网络可达的 TycheEngine 实例(端口 5556 / 5558 / 5560)

### 安装

```bash
npm install
```

`postinstall` 会自动调用 `electron-builder install-app-deps` 编译 `zeromq` 等原生模块。

### 开发模式

```bash
npm run dev
```

启动 electron-vite 开发服务器,自动打开 Electron 窗口与 DevTools。

带 Node 调试器:

```bash
npm run dev:inspect       # 主进程暴露 5858 调试端口
```

### 构建

```bash
npm run build             # 编译 main / preload / renderer 到 out/
npm run preview           # 预览构建产物
```

### 打包

```bash
npm run dist              # 当前平台分发包(Windows nsis / macOS dmg / Linux AppImage)
npm run dist:dir          # 仅生成解压目录,便于调试
```

输出位于 `release/`。

---

## 关键设计

### 主进程(`src/main/index.ts`)

- **窗口状态持久化** — `getPath('userData')/window-state.json` 保存窗口位置与尺寸,启动时校验显示器可见性
- **IPC 通道**
  - `engine:connect` / `engine:disconnect`
  - `engine:query-status` / `engine:query-modules`
  - 推送通道:`engine:event` / `engine:heartbeat` / `engine:state-change`
- **Popout 子窗口** — 复用同一份 preload,支持渲染端 `window.open` 派生独立窗口

### Preload(`src/preload/index.ts`)

通过 `contextBridge` 暴露 `window.api.engine` 仅必要方法,启用 `contextIsolation` + 关闭 `nodeIntegration`。

### 渲染进程

- **Pinia engine store** — 统一管理连接状态、事件流(环形缓冲 1000 条)、模块列表
- **Pinia layout store** — `tycheapp-layout-v1` / `tycheapp-panel-states-v1` 两组 localStorage 键
- **Dockview popout 自动化** — 监听 `onDidAddGroup`,Shift 拖拽产生的 floating group 自动转为 popout,避免重复弹出

---

## 开发现状

参见 [SESSION_STATE.md](./SESSION_STATE.md) 了解最新决策记录与待办事项。当前已完成:

- [x] 项目骨架(electron-vite + Vue3 + TS)
- [x] ZeroMQ 连接层与心跳健康度统计
- [x] Pinia 状态管理 + IPC 桥接
- [x] Dockview 布局 + popout 子窗口
- [x] 七大功能面板 UI 脚手架

下一阶段:

- [ ] TycheEngine 实测连接联调
- [ ] 闪电下单交互完善
- [ ] Greeks / Vol Surface / Market Making 数据接入

---

## 相关项目

- **[TycheEngine](D:/dev/TycheEngine)** — 后端事件持久化引擎(ClickHouse)
- **[TycheTUI](D:/dev/TycheTUI)** — 基于 OpenTUI 的终端 UI(并行项目)

---

## 许可证

MIT © zt281
