# Coding Conventions

**Analysis Date:** 2026-05-09

## Naming Patterns

**Files:**
- Vue single-file components: PascalCase with descriptive names
  - Panels: `{Name}Panel.vue` — e.g., `ConnectionPanel.vue`, `EventPanel.vue`
  - Components: `{Name}.vue` — e.g., `Toolbar.vue`, `HeaderActions.vue`
  - Path: `src/renderer/components/panels/ConnectionPanel.vue`
- TypeScript modules: camelCase — e.g., `usePanelState.ts`, `engine.ts`, `layout.ts`
- Entry points: `index.ts` — e.g., `src/main/index.ts`, `src/preload/index.ts`, `src/renderer/main.ts`

**Functions:**
- camelCase for all functions and methods
  - Event handlers: prefixed with `on` — e.g., `onReady()`, `onAddPanel()`, `onSave()`
  - Action handlers: verb-noun — e.g., `saveWindowState()`, `loadWindowState()`, `refreshStatus()`
  - Store actions: verb — e.g., `connect()`, `disconnect()`, `addEvent()`, `clearEvents()`
  - Composables: prefixed with `use` — e.g., `usePanelState()`, `useEngineStore()`, `useLayoutStore()`

**Variables:**
- camelCase for variables and constants
  - Boolean flags: descriptive — e.g., `eventLoopRunning`, `heartbeatLoopRunning`, `isConnected`
  - DOM/element refs: descriptive — e.g., `mainWindow`, `dockviewApi`
  - Module-level constants: UPPER_SNAKE_CASE — e.g., `ENGINE_HOST`, `EVENT_PORT`, `LAYOUT_KEY`

**Types:**
- Interfaces: PascalCase — e.g., `EngineEvent`, `EngineStatus`, `ModuleInfo`, `PanelState`
- Type aliases: PascalCase — e.g., `ConnectionState`, `PreloadAPI`
- Union literal types: single-quoted strings — e.g., `'OK' | 'WARN' | 'EXPIRED'`, `'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'RECONNECTING'`

**Classes:**
- PascalCase — e.g., `ConnectionManager extends EventEmitter`

## Code Style

**Formatting:**
- No explicit formatter configured (no Prettier, no Biome, no ESLint config files found)
- Indentation: 2 spaces (observed in all source files)
- Semicolons: optional style, mostly omitted in Vue SFC `<script>` blocks
- Quotes: single quotes for strings in TypeScript
- Trailing commas: not used

**TypeScript Compiler Settings** (`tsconfig.json`):
- `strict: true` — all strict mode checks enabled
- `noUnusedLocals: true` — unused local variables are errors
- `noUnusedParameters: true` — unused parameters are errors
- `noFallthroughCasesInSwitch: true` — no implicit fallthrough in switch
- `forceConsistentCasingInFileNames: true` — case-sensitive imports
- `isolatedModules: true` — each file treated as separate module
- `declaration: true` and `declarationMap: true` — emit type declarations
- `sourceMap: true` — source maps enabled
- Target: ES2022, Module: ESNext, ModuleResolution: bundler

**Vue SFC Style:**
- All components use `<script setup lang="ts">` — Composition API exclusively, no Options API
- Template section precedes script section precedes style section (standard SFC order)
- Styles are always `scoped`
- No CSS preprocessor used (plain CSS)

## Import Organization

**Order:**
1. Built-in Node.js modules (e.g., `events`, `node:url`, `node:path`, `node:fs`)
2. Third-party packages (e.g., `electron`, `zeromq`, `vue`, `pinia`, `dockview-vue`)
3. Internal project imports (relative paths or aliases)

**Path Aliases:**
- `@/` → `src/*` — project root
- `@renderer/` → `src/renderer/*` — renderer process
- `@main/` → `src/main/*` — main process

**Import Style Examples:**
```typescript
// Main process — Node built-ins first, then npm, then internal
import { EventEmitter } from 'events'
import { Subscriber, Request } from 'zeromq'
import { encode, decode } from '@msgpack/msgpack'
import log from 'electron-log'

// Renderer — Vue ecosystem first, then internal
import { onMounted } from 'vue'
import { DockviewVue } from 'dockview-vue'
import { useEngineStore } from './store/engine'
import Toolbar from './components/Toolbar.vue'
```

**Type-only imports:**
- Use `import type { ... }` for type-only imports — observed in `src/preload/index.ts`:
  ```typescript
  import type { ConnectionState, EngineEvent, EngineStatus, ModuleInfo } from '../main/connection'
  ```

## TypeScript Patterns

**Interfaces vs Types:**
- `interface` preferred for object shapes — e.g., `EngineEvent`, `EngineStatus`, `ModuleInfo`, `PanelState`
- `type` used for union/string literal types — e.g., `ConnectionState`, `PreloadAPI`
- No `enum` usage; string literal unions used instead

**Type Definitions Location:**
- Domain types defined in `src/renderer/types/index.ts` (renderer-side view)
- Same types re-exported from `src/main/connection.ts` (main process source of truth)
- Preload API interface defined in `src/preload/index.ts`

**Optional Properties:**
- Use `?` suffix for optional fields — e.g., `recipient?: string`, `durability?: number`

**Generic Usage:**
- Minimal; `ref<T>()` and `reactive<T>()` used with explicit type parameters
- `computed<T>()` used implicitly via inference

## Vue Component Patterns

**State Management:**
- Pinia stores with Composition API pattern (`defineStore` with arrow function)
- Store files in `src/renderer/store/` — `engine.ts` for engine state, `layout.ts` for layout state
- Access via `useEngineStore()` / `useLayoutStore()` composables

**Reactivity Patterns:**
- `ref<T>()` for primitive/reactive state that needs replacement
- `computed()` for derived state
- `reactive()` used in `usePanelState` composable for deep object state
- `watch()` with `{ deep: true, flush: 'post' }` for side-effect synchronization

**Props:**
- TypeScript interface for props — e.g., `interface Props { params: { group: any; api: any } }`
- `defineProps<Props>()` for typed props
- `defineEmits<{ (e: 'add', type: string): void }>()` for typed emits

**Component Registration:**
- Global registration in `src/renderer/main.ts` via `app.component('name', Component)`
- Component names are lowercase kebab-mapped strings: `'connection'`, `'events'`, `'mm'`
- This is required for dockview-vue dynamic panel lookup

**Panel State Persistence:**
- `usePanelState(api, defaults)` composable in `src/renderer/composables/usePanelState.ts`
- Wraps `reactive()` + `watch()` to sync panel params to dockview API
- Used by panels that need state persistence across layout save/restore

## Error Handling

**Patterns:**
- Try/catch with logging for async operations in main process
  ```typescript
  try {
    await this.adminSocket.send(encode('STATUS'))
    const [msg] = await this.adminSocket.receive()
    return decode(msg) as EngineStatus
  } catch (err) {
    log.error('[ConnectionManager] queryStatus failed:', err)
    return null
  }
  ```
- Silent catch with fallback return for non-critical failures:
  ```typescript
  try {
    const data = JSON.parse(fs.readFileSync(WINDOW_STATE_FILE, 'utf-8'))
    return data
  } catch {
    return null
  }
  ```
- Store-level error handling sets state back to safe value:
  ```typescript
  async function connect() {
    setState('CONNECTING')
    try {
      await window.api.engine.connect()
    } catch {
      setState('DISCONNECTED')
    }
  }
  ```

**No centralized error boundary** — errors handled locally where they occur.

## Logging

**Framework:** `electron-log` (version 5.4.0)

**Patterns:**
- Initialized once in main process: `log.initialize()` in `src/main/index.ts`
- Prefixed log messages with component name in brackets:
  ```typescript
  log.info('[ConnectionManager] Connected to TycheEngine')
  log.error('[ConnectionManager] Connect failed:', err)
  ```
- No logging in renderer process (console not used)

## Comments

**When to Comment:**
- Minimal commenting observed
- Inline comments used sparingly for non-obvious logic:
  ```typescript
  // 当 group 被移除时清理，避免 group id 累积导致内存泄漏
  api.onDidRemoveGroup((group: any) => {
    processedGroups.delete(group.id)
  })
  ```
- No JSDoc/TSDoc usage in the codebase

## Function Design

**Size:**
- Functions tend to be small and focused (10-30 lines)
- Largest functions are event loop handlers (~15 lines) and Vue template event handlers

**Parameters:**
- Destructuring not heavily used
- `any` type used for third-party API objects (dockview API) to avoid typing complexity

**Return Values:**
- Async functions return `Promise<T>` explicitly
- Nullable returns for operations that may fail: `Promise<EngineStatus | null>`
- Empty array fallback: `Promise<ModuleInfo[]>` returns `[]` on error

## Module Design

**Exports:**
- Named exports for types and functions: `export interface EngineEvent`, `export function usePanelState()`
- Named exports for stores: `export const useEngineStore = defineStore(...)`
- Default exports not used

**Barrel Files:**
- No barrel files (index.ts re-exporting modules)
- Types in `src/renderer/types/index.ts` are the closest pattern

## IPC API Exposure Patterns (Preload Script)

**Location:** `src/preload/index.ts`

**Pattern:** Structured namespace object exposed via `contextBridge.exposeInMainWorld()`

```typescript
const api: PreloadAPI = {
  engine: {
    connect: () => ipcRenderer.invoke('engine:connect'),
    disconnect: () => ipcRenderer.invoke('engine:disconnect'),
    queryStatus: () => ipcRenderer.invoke('engine:query-status'),
    queryModules: () => ipcRenderer.invoke('engine:query-modules'),
    onEvent: (callback) => {
      const handler = (_: unknown, data: EngineEvent & { _type: string }) => callback(data)
      ipcRenderer.on('engine:event', handler)
      return () => ipcRenderer.removeListener('engine:event', handler)
    },
    // ...
  }
}

contextBridge.exposeInMainWorld('api', api)
```

**Key conventions:**
- Channel names use colon-namespacing: `engine:connect`, `engine:disconnect`, `engine:query-status`
- Invoke pattern for request/response: `ipcRenderer.invoke()` / `ipcMain.handle()`
- Event pattern for pub/sub: `ipcRenderer.on()` with unsubscribe return function
- Global `Window` interface augmentation for type safety:
  ```typescript
  declare global {
    interface Window {
      api: PreloadAPI
    }
  }
  ```
- Renderer accesses via `window.api.engine.connect()` with full type safety

**Security:**
- `contextIsolation: true` in `BrowserWindow` webPreferences
- `nodeIntegration: false` — renderer has no Node.js access
- `sandbox: false` — required for preload script functionality
- No raw `ipcRenderer` exposed; only whitelisted methods via typed API object

---

*Convention analysis: 2026-05-09*
