# Architecture

**Analysis Date:** 2026-05-09

## Pattern Overview

**Overall:** Multi-process desktop application with secure IPC bridge and reactive UI

**Key Characteristics:**
- Electron main/renderer process separation with context isolation
- ZeroMQ-based pub/sub and req/rep communication with TycheEngine backend
- msgpack binary serialization for all engine communication
- Pinia Composition API stores for reactive state management
- dockview-vue docking layout system with popout window support
- Panel-level state persistence via reactive composables

## Layers

**Main Process (Node.js/Electron):**
- Purpose: Window management, native OS integration, and backend engine communication
- Location: `src/main/`
- Contains: BrowserWindow creation, IPC handlers, ZeroMQ socket management, window state persistence
- Depends on: Electron APIs, ZeroMQ (`zeromq`), msgpack (`@msgpack/msgpack`), `electron-log`
- Used by: Renderer process via IPC; TycheEngine via ZeroMQ TCP sockets

**Preload Script (Secure Bridge):**
- Purpose: Expose a type-safe, minimal API surface from main world to renderer context
- Location: `src/preload/index.ts`
- Contains: `contextBridge.exposeInMainWorld` call defining the `window.api.engine` interface
- Depends on: `ipcRenderer` from electron
- Used by: Renderer process reads `window.api.engine`; main process responds via `ipcMain.handle`

**Renderer Process (Vue 3 SPA):**
- Purpose: All UI rendering, user interaction, and reactive data display
- Location: `src/renderer/`
- Contains: Vue components, Pinia stores, composables, type definitions
- Depends on: Vue 3, Pinia, dockview-vue, preload-exposed `window.api`
- Used by: End user

**Backend Engine (External):**
- Purpose: Quant trading event persistence engine (TycheEngine)
- Communication: TCP ZeroMQ sockets at `127.0.0.1` on ports 5556 (events), 5558 (heartbeats), 5560 (admin)
- Protocol: msgpack-encoded messages
- Used by: Main process `ConnectionManager`

## Data Flow

**Engine Event Stream (Primary Flow):**

1. TycheEngine publishes events via ZeroMQ PUB socket on port 5556
2. `ConnectionManager` (`src/main/connection.ts`) receives raw msgpack messages via `Subscriber` socket
3. Messages are decoded with `@msgpack/msgpack/decode`, classified by event name prefix, and emitted as `'event'`
4. `src/main/index.ts` listens via `connection.onEvent()` and forwards to renderer via `mainWindow.webContents.send('engine:event', data)`
5. Preload script (`src/preload/index.ts`) registers `ipcRenderer.on('engine:event', handler)` and invokes the callback registered by the renderer
6. `App.vue` (`src/renderer/App.vue`) in its `onMounted` hook calls `window.api.engine.onEvent()` to register a callback that calls `store.addEvent(e)`
7. `useEngineStore` (`src/renderer/store/engine.ts`) appends the event to its `events` ref (capped at 1000 items)
8. Vue reactivity propagates the update to any component consuming `store.events` (e.g., `EventPanel.vue`)

**Heartbeat Flow:**

1. TycheEngine publishes heartbeat messages (module ID arrays) on ZeroMQ port 5558
2. `ConnectionManager` receives via heartbeat `Subscriber` socket, updates `moduleHealth` Map, emits `'heartbeat'`
3. Main process forwards via `webContents.send('engine:heartbeat', data)`
4. Renderer callback triggers `store.refreshModules()` which calls `window.api.engine.queryModules()`
5. Admin REQ socket on port 5560 sends `'MODULES'` command, receives msgpack response, returns `ModuleInfo[]`

**State Change Flow:**

1. `ConnectionManager.setState()` emits `'state-change'` when connection state transitions
2. Main process forwards via `webContents.send('engine:state-change', state)`
3. Renderer callback calls `store.setState(s)` updating the Pinia store
4. Components like `ConnectionPanel.vue` reactively display the new state

**Command Flow (Renderer -> Main -> Engine):**

1. User clicks Connect in `ConnectionPanel.vue`
2. `store.connect()` calls `window.api.engine.connect()`
3. Preload invokes `ipcRenderer.invoke('engine:connect')`
4. Main process `ipcMain.handle('engine:connect', ...)` calls `connection.connect()`
5. `ConnectionManager` opens ZeroMQ sockets and starts event/heartbeat loops

## Key Abstractions

**ConnectionManager:**
- Purpose: Encapsulates all ZeroMQ socket lifecycle and message processing
- Location: `src/main/connection.ts`
- Pattern: EventEmitter subclass with async connect/disconnect and background receive loops
- Key methods: `connect()`, `disconnect()`, `queryStatus()`, `queryModules()`, `onEvent()`, `onHeartbeat()`, `onStateChange()`
- State machine: `DISCONNECTED` -> `CONNECTING` -> `CONNECTED` (no automatic reconnect currently)

**PreloadAPI (window.api.engine):**
- Purpose: The only bridge between isolated renderer and privileged main process
- Location: `src/preload/index.ts`
- Pattern: Typed object exposed via `contextBridge.exposeInMainWorld`
- Exposes: `connect`, `disconnect`, `queryStatus`, `queryModules` (invoke-based); `onEvent`, `onHeartbeat`, `onStateChange` (subscription-based with unsubscribe return)

**Pinia Stores:**
- `useEngineStore` (`src/renderer/store/engine.ts`): Holds connection state, engine status, module list, and event stream. Wraps preload API calls.
- `useLayoutStore` (`src/renderer/store/layout.ts`): Persists dockview layout JSON and per-panel state to `localStorage`.

**usePanelState Composable:**
- Purpose: Two-way sync between a Vue reactive object and dockview panel params for state persistence
- Location: `src/renderer/composables/usePanelState.ts`
- Pattern: `reactive()` object initialized from `api.params`, deep-watched, and synced back via `api.setParams(toRaw(state))`
- Used by: `EventPanel.vue`, `OrderPanel.vue`, `VolCurvePanel.vue`, `MarketMakingPanel.vue`

**Panel Components:**
- Purpose: Self-contained functional units rendered inside dockview panels
- Location: `src/renderer/components/panels/`
- Pattern: Each panel is a Vue SFC registered globally in `main.ts` with a string key (`connection`, `events`, `modules`, `order`, `greeks`, `volcurve`, `mm`)
- Panels with interactive state use `usePanelState` to persist filter/settings across layout save/load cycles

## Entry Points

**Main Process Entry:**
- Location: `src/main/index.ts`
- Triggers: Electron `app.on('ready')`
- Responsibilities: Create BrowserWindow, set up IPC handlers, instantiate ConnectionManager, wire event forwarding from ConnectionManager to renderer

**Preload Entry:**
- Location: `src/preload/index.ts`
- Triggers: Electron loads this script before renderer content (configured via `webPreferences.preload`)
- Responsibilities: Define and expose the typed `window.api` object

**Renderer Entry:**
- Location: `src/renderer/main.ts`
- Triggers: HTML `<script type="module" src="./main.ts">` in `src/renderer/index.html`
- Responsibilities: Create Vue app, install Pinia, globally register all panel components for dockview lookup, mount to `#app`

**Root Component:**
- Location: `src/renderer/App.vue`
- Triggers: Mounted by `main.ts`
- Responsibilities: Render Toolbar and DockviewVue, manage layout lifecycle (default layout, save/load/reset, popout auto-conversion), subscribe to engine events on mount

## Error Handling

**Strategy:** Log and degrade gracefully; no global error boundary

**Patterns:**
- Main process: `electron-log` for all errors (`log.error()`); failed operations return `null` or empty arrays rather than throwing to renderer
- ConnectionManager: Try/catch around each ZeroMQ receive loop iteration; socket errors log but do not crash the loop unless `eventLoopRunning` is false
- Renderer: IPC invoke errors caught in store actions (e.g., `connect()` catches and resets state to `DISCONNECTED`)
- Layout persistence: `try/catch` around `api.fromJSON(saved)` falls back to default layout on corruption

## Cross-Cutting Concerns

**Logging:** `electron-log` initialized in main process (`log.initialize()`). No renderer-side structured logging.

**Validation:** No explicit input validation layer. TypeScript strict mode (`strict: true`) provides compile-time safety. Runtime validation minimal.

**Authentication:** None detected. Connection to TycheEngine is unauthenticated TCP ZeroMQ on localhost.

**Security:**
- `contextIsolation: true` and `nodeIntegration: false` in BrowserWindow webPreferences
- CSP header in `index.html`: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'`
- `sandbox: false` required for preload script execution
- All native access funneled through typed preload API

**Window State Persistence:**
- Main process saves/restores window bounds to `window-state.json` in `app.getPath('userData')`
- Validates restored bounds against current display geometry via `isWindowVisible()`

---

*Architecture analysis: 2026-05-09*
