# Codebase Structure

**Analysis Date:** 2026-05-09

## Directory Layout

```
D:/dev/TycheApp/
├── .planning/
│   └── codebase/          # GSD codebase mapping documents
├── out/                   # Build output (electron-vite compilation)
│   ├── main/
│   ├── preload/
│   └── renderer/
├── src/
│   ├── main/              # Electron main process (Node.js)
│   ├── preload/           # Secure IPC bridge script
│   └── renderer/          # Vue 3 SPA (renderer process)
│       ├── components/
│       │   └── panels/    # Dockview panel components
│       ├── composables/   # Vue reusable logic
│       ├── store/         # Pinia state stores
│       └── types/         # Shared TypeScript interfaces
├── .gitignore
├── electron.vite.config.ts # Vite build configuration for Electron
├── package.json
├── tsconfig.json
└── tsconfig.node.json
```

## Directory Purposes

**`src/main/`: Electron Main Process**
- Purpose: Window lifecycle, OS integration, backend ZeroMQ communication
- Contains: `.ts` files with Node.js/Electron APIs
- Key files:
  - `src/main/index.ts` — Main entry point: window creation, IPC setup, ConnectionManager wiring
  - `src/main/connection.ts` — `ConnectionManager` class: ZeroMQ sockets, msgpack encode/decode, event classification

**`src/preload/`: IPC Bridge**
- Purpose: Secure, typed API exposure from main to renderer
- Contains: Single preload script
- Key files:
  - `src/preload/index.ts` — Defines `PreloadAPI` interface, exposes `window.api.engine` via `contextBridge`

**`src/renderer/`: Vue 3 Application**
- Purpose: All UI code running in the renderer process
- Contains: Vue SFCs, stores, composables, types, HTML entry point
- Key files:
  - `src/renderer/main.ts` — Renderer entry: create Vue app, install Pinia, register panel components globally
  - `src/renderer/App.vue` — Root component: Toolbar + DockviewVue, layout management, engine event subscriptions
  - `src/renderer/index.html` — HTML entry point with CSP header

**`src/renderer/components/`: Vue Components**
- Purpose: Reusable UI components
- Contains: Toolbar, HeaderActions, and panel subcomponents
- Key files:
  - `src/renderer/components/Toolbar.vue` — Top toolbar: panel add dropdown, save/load/reset layout buttons
  - `src/renderer/components/HeaderActions.vue` — Popout button for dockview group headers

**`src/renderer/components/panels/`: Dockview Panel Components**
- Purpose: Functional panels rendered inside dockview tabs
- Contains: One SFC per panel type, all registered globally in `main.ts`
- Key files:
  - `ConnectionPanel.vue` — Engine connect/disconnect, status display
  - `EventPanel.vue` — Live event stream with type filtering
  - `ModulePanel.vue` — Module health and interface listing
  - `OrderPanel.vue` — Quick order entry (mock data currently)
  - `GreeksPanel.vue` — Portfolio greeks display (mock data currently)
  - `VolCurvePanel.vue` — Volatility surface SVG chart (mock data currently)
  - `MarketMakingPanel.vue` — Market making controls with order book visualization (mock data currently)

**`src/renderer/composables/`: Vue Composables**
- Purpose: Reusable reactive logic
- Contains: Single composable for panel state persistence
- Key files:
  - `src/renderer/composables/usePanelState.ts` — Syncs reactive Vue state with dockview panel params for layout persistence

**`src/renderer/store/`: Pinia Stores**
- Purpose: Global reactive state management
- Contains: Store definitions using Pinia with Composition API
- Key files:
  - `src/renderer/store/engine.ts` — Engine connection state, events, modules, status; wraps preload API
  - `src/renderer/store/layout.ts` — Layout and panel state persistence to localStorage

**`src/renderer/types/`: Type Definitions**
- Purpose: Shared TypeScript interfaces used across renderer
- Contains: Type aliases and interfaces
- Key files:
  - `src/renderer/types/index.ts` — `EngineEvent`, `EngineStatus`, `ModuleInfo`, `ConnectionState`

**`out/`: Build Output**
- Purpose: Compiled artifacts from `electron-vite build`
- Generated: Yes (by `npm run build`)
- Committed: No (listed in `.gitignore`)
- Structure:
  - `out/main/index.cjs` — Compiled main process (CommonJS)
  - `out/preload/index.cjs` — Compiled preload script (CommonJS)
  - `out/renderer/index.html` — Compiled renderer SPA with bundled assets

## Key File Locations

**Entry Points:**
- `src/main/index.ts` — Electron main process entry
- `src/preload/index.ts` — Preload script entry
- `src/renderer/main.ts` — Vue renderer entry
- `src/renderer/index.html` — HTML shell for renderer

**Configuration:**
- `electron.vite.config.ts` — Build config: three Vite configs (main/preload/renderer) with aliases, external deps, Vue plugin
- `tsconfig.json` — TypeScript: ES2022, strict mode, path aliases `@/*` and `@renderer/*`, `@main/*`
- `package.json` — Dependencies: Vue 3, Pinia, Electron 36, ZeroMQ, msgpack, dockview-vue, electron-log

**Core Logic:**
- `src/main/connection.ts` — ZeroMQ connection management, message processing
- `src/renderer/store/engine.ts` — Central state store for all engine data
- `src/renderer/App.vue` — Layout orchestration and event subscription wiring

**Testing:**
- Not detected — no test files, test config, or test directories found

## Naming Conventions

**Files:**
- Vue SFCs: PascalCase with descriptive suffix (e.g., `ConnectionPanel.vue`, `MarketMakingPanel.vue`)
- TypeScript modules: camelCase (e.g., `connection.ts`, `usePanelState.ts`)
- Store files: Named after domain (e.g., `engine.ts`, `layout.ts`)

**Directories:**
- Lowercase, plural for collections (e.g., `components/`, `panels/`, `composables/`, `store/`)

**Vue Components:**
- Global registration uses lowercase string keys matching directory names (e.g., `app.component('connection', ConnectionPanel)`)
- Panel component names end in `Panel` (e.g., `ConnectionPanel`, `EventPanel`)

**TypeScript:**
- Interfaces: PascalCase (e.g., `EngineEvent`, `ModuleInfo`, `PreloadAPI`)
- Types: PascalCase (e.g., `ConnectionState`)
- Stores: `use` + Domain + `Store` (e.g., `useEngineStore`, `useLayoutStore`)
- Composables: `use` + descriptive name (e.g., `usePanelState`)

**ZeroMQ / IPC Channels:**
- IPC channels: `engine:` prefix for commands (e.g., `engine:connect`, `engine:query-status`)
- IPC events: `engine:` prefix for push events (e.g., `engine:event`, `engine:heartbeat`)

## Where to Add New Code

**New Panel:**
- Create component: `src/renderer/components/panels/{Name}Panel.vue`
- Register globally: add `app.component()` call in `src/renderer/main.ts`
- Add to toolbar dropdown: add `<option>` in `src/renderer/components/Toolbar.vue`
- Add to default layout: add `api.addPanel()` call in `App.vue` `defaultLayout()`
- Add to `onAddPanel` titles map in `App.vue`

**New Store:**
- Create: `src/renderer/store/{domain}.ts`
- Use Pinia Composition API pattern: `defineStore('id', () => { ... })`
- Import and use in components as needed

**New Composable:**
- Create: `src/renderer/composables/use{Feature}.ts`
- Export function, import in components that need it

**New IPC Channel:**
- Preload: add method to `PreloadAPI` interface and `api.engine` object in `src/preload/index.ts`
- Main: add `ipcMain.handle()` or `webContents.send()` in `src/main/index.ts`
- Renderer: call via `window.api.engine.{method}()`

**New Type:**
- Add to `src/renderer/types/index.ts` if used by renderer
- Add to `src/main/connection.ts` if used only by main process (and re-export from preload if needed)

**New Main Process Module:**
- Create in `src/main/`
- Import in `src/main/index.ts`
- Add alias to `electron.vite.config.ts` main.resolve.alias if needed

## Special Directories

**`.planning/codebase/`:**
- Purpose: GSD codebase mapping documents
- Generated: No (manually maintained)
- Committed: Yes

**`out/`: Build Output**
- Purpose: electron-vite compilation output
- Generated: Yes
- Committed: No
- Contents: `main/index.cjs`, `preload/index.cjs`, `renderer/index.html` + bundled assets

**`release/` (referenced in package.json, not present):**
- Purpose: electron-builder distribution output
- Generated: Yes (by `npm run dist`)
- Committed: No

---

*Structure analysis: 2026-05-09*
