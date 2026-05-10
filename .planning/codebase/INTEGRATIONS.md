# External Integrations

**Analysis Date:** 2026-05-09

## APIs & External Services

**TycheEngine Backend (Primary Integration):**
- Purpose: Quant trading event persistence engine - the core backend that TycheApp monitors and controls
- Protocol: ZeroMQ over TCP
- Host: `127.0.0.1` (localhost only)
- Implementation: `src/main/connection.ts`

**ZeroMQ Socket Configuration:**
Three separate sockets connect to TycheEngine:

| Socket | Type | Port | Direction | Purpose |
|--------|------|------|-----------|---------|
| Event | `Subscriber` | 5556 | Incoming | Receives all engine events (pub/sub) |
| Heartbeat | `Subscriber` | 5558 | Incoming | Receives module liveness heartbeats |
| Admin | `Request` | 5560 | Bidirectional | Sends queries (STATUS, MODULES), receives responses |

All ports are hardcoded in `src/main/connection.ts` (lines 32-35):
```typescript
const ENGINE_HOST = '127.0.0.1'
const EVENT_PORT = 5556
const HEARTBEAT_PORT = 5558
const ADMIN_PORT = 5560
```

**Message Serialization:**
- Format: MessagePack (binary)
- Library: `@msgpack/msgpack` (`encode()` / `decode()`)
- All messages sent/received via ZeroMQ are MessagePack-encoded byte arrays

## Data Storage

**Databases:**
- Not detected - No database integration

**File Storage:**
- Local filesystem only
- Window state: `app.getPath('userData')/window-state.json` (`src/main/index.ts` line 8)
- Layout state: `localStorage` keys `tycheapp-layout-v1` and `tycheapp-panel-states-v1` (`src/renderer/store/layout.ts`)

**Caching:**
- None external
- In-memory event ring buffer: max 1000 events in `useEngineStore` (`src/renderer/store/engine.ts` line 10)

## Authentication & Identity

**Auth Provider:**
- Not detected - No authentication system
- TycheEngine connection is unauthenticated (direct TCP to localhost)

## Monitoring & Observability

**Error Tracking:**
- `electron-log` 5.4.3 - File-based logging for main process
- Log locations: Standard Electron log directories (platform-dependent)
- Log levels used: `info`, `error`

**Logs:**
- Main process: `log.initialize()` called in `src/main/index.ts` (line 21)
- Log entries prefixed with `[ConnectionManager]` in `src/main/connection.ts`
- No renderer process logging framework detected (uses `console` if any)

## CI/CD & Deployment

**Hosting:**
- Desktop-only distribution via electron-builder
- Targets: DMG (macOS), NSIS (Windows), AppImage (Linux)
- No auto-update configuration detected

**CI Pipeline:**
- Not detected - No CI configuration files (`.github/workflows`, `.gitlab-ci.yml`, etc.)

## IPC Bridge (Main/Renderer Communication)

**Architecture:** Secure context bridge with `contextIsolation: true`

**Preload Script:** `src/preload/index.ts`
- Exposes `window.api.engine` object to renderer via `contextBridge.exposeInMainWorld`
- All Node.js/Electron APIs are hidden from renderer; only typed API surface is exposed

**IPC Channels (invoke/handle pattern):**

| Channel | Direction | Payload | Description |
|---------|-----------|---------|-------------|
| `engine:connect` | Renderer → Main | void | Initiates ZeroMQ connection |
| `engine:disconnect` | Renderer → Main | void | Closes all ZeroMQ sockets |
| `engine:query-status` | Renderer → Main | void | Requests engine status |
| `engine:query-modules` | Renderer → Main | void | Requests module list |

**IPC Channels (event emit/subscribe pattern):**

| Channel | Direction | Payload | Description |
|---------|-----------|---------|-------------|
| `engine:event` | Main → Renderer | `EngineEvent & { _type: string }` | Real-time engine events |
| `engine:heartbeat` | Main → Renderer | `string[]` | Module liveness updates |
| `engine:state-change` | Main → Renderer | `ConnectionState` | Connection state transitions |

**IPC Setup Location:** `src/main/index.ts` (lines 130-168)
- `ipcMain.handle()` registers invoke handlers
- `connection.onEvent/onHeartbeat/onStateChange` emit to `mainWindow.webContents.send()`

**Renderer Consumption:** `src/renderer/App.vue` (lines 185-193)
```typescript
api.onStateChange((s) => store.setState(s))
api.onEvent((e) => store.addEvent(e))
api.onHeartbeat(() => store.refreshModules())
```

## Communication Protocol Details

**Admin Query Protocol (Request/Reply on port 5560):**

| Query | Request | Response Type | Handler |
|-------|---------|---------------|---------|
| STATUS | `encode('STATUS')` | `EngineStatus` | `queryStatus()` |
| MODULES | `encode('MODULES')` | `Record<string, { interfaces, liveness }>` | `queryModules()` |

**Event Stream Protocol (Pub/Sub on port 5556):**
- Subscribe to all topics (`subscribe('')`)
- Each message decodes to `EngineEvent`:
  ```typescript
  interface EngineEvent {
    msg_type: number
    sender: string
    event: string
    payload: Record<string, unknown>
    recipient?: string
    durability?: number
    timestamp?: number
    correlation_id?: string
  }
  ```
- Events are classified by prefix: `on_common_`, `on_`, `ack_`, `whisper_`, `broadcast_`

**Heartbeat Protocol (Pub/Sub on port 5558):**
- Receives array of module IDs that are alive
- Triggers module health tracking and UI refresh

## Webhooks & Callbacks

**Incoming:**
- Not applicable - Desktop application, no incoming HTTP/webhooks

**Outgoing:**
- Not detected - No outgoing webhooks or HTTP callbacks

## Environment Configuration

**Required for runtime:**
- `VITE_DEV_SERVER_URL` - Set by electron-vite in development
- `ELECTRON_RENDERER_URL` - Development renderer URL (`src/main/index.ts` line 94)
- `APP_ROOT` - Computed at runtime from `__dirname`
- `VITE_PUBLIC` - Public assets path (dev vs production)

**No external API keys or secrets required.**

---

*Integration audit: 2026-05-09*
