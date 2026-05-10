# Testing Patterns

**Analysis Date:** 2026-05-09

## Test Framework

**Current State: NO TESTS CONFIGURED**

The project has zero test infrastructure. No test runner, no test files, no test scripts, and no testing dependencies.

**Missing Infrastructure:**
- No test runner (Jest, Vitest, Mocha, or similar)
- No test assertion library
- No mocking framework (vitest.fn, jest.mock, sinon, etc.)
- No E2E testing framework (Playwright, Cypress, Spectron)
- No test configuration files

**Package.json Scripts** (`D:\dev\TycheApp\package.json`):
```json
{
  "dev": "electron-vite dev",
  "dev:inspect": "electron-vite dev --inspect=5858",
  "build": "electron-vite build",
  "preview": "electron-vite preview",
  "dist": "electron-builder",
  "dist:dir": "electron-builder --dir",
  "postinstall": "electron-builder install-app-deps"
}
```
No `test`, `test:unit`, `test:e2e`, or coverage scripts exist.

## Test File Organization

**Current State: NO TEST FILES**

No test files exist in the project. A search across the entire repository found:
- Zero `*.test.*` files in `src/` or project root
- Zero `*.spec.*` files in `src/` or project root
- No `tests/`, `test/`, `__tests__/`, or `e2e/` directories at project level

**Recommended Structure (for when tests are added):**
```
D:\dev\TycheApp/
├── tests/
│   ├── unit/           # Unit tests for stores, composables, utilities
│   ├── integration/    # IPC + ZeroMQ integration tests
│   └── e2e/            # Electron E2E with Playwright
```

## Test Structure

**Current State: NOT APPLICABLE**

No test suites, no test cases, no fixtures.

**Recommended Patterns (based on project architecture):**

For Pinia stores (`src/renderer/store/engine.ts`):
```typescript
// Recommended: tests/unit/store/engine.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useEngineStore } from '../../../src/renderer/store/engine'

describe('engine store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should start disconnected', () => {
    const store = useEngineStore()
    expect(store.state).toBe('DISCONNECTED')
    expect(store.isConnected).toBe(false)
  })

  it('should cap events at maxEvents', () => {
    const store = useEngineStore()
    for (let i = 0; i < 1005; i++) {
      store.addEvent({ msg_type: 1, sender: 'test', event: 'test', payload: {}, _type: 'on' })
    }
    expect(store.events.length).toBe(1000)
  })
})
```

For composables (`src/renderer/composables/usePanelState.ts`):
```typescript
// Recommended: tests/unit/composables/usePanelState.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { usePanelState } from '../../../src/renderer/composables/usePanelState'

describe('usePanelState', () => {
  it('should merge defaults with existing params', () => {
    const mockApi = { params: { enabled: true }, setParams: vi.fn() }
    const state = usePanelState(mockApi, { enabled: false, symbol: 'SPY' })
    expect(state.enabled).toBe(true)  // existing wins
    expect(state.symbol).toBe('SPY')  // default applied
  })
})
```

## Mocking

**Current State: NO MOCKING FRAMEWORK**

**What should be mocked when tests are added:**
- `window.api` (preload API) — the renderer's bridge to main process
- `zeromq` sockets (`Subscriber`, `Request`) — external network dependency
- `electron-log` — avoid actual log writes in tests
- `localStorage` — for layout store tests
- `fs` module — for window state file operations in main process
- `electron` APIs (`BrowserWindow`, `ipcMain`, `screen`, `app`) — main process tests

**What should NOT be mocked:**
- Vue reactivity system (`ref`, `computed`, `reactive`, `watch`)
- Pinia store internals
- Internal utility functions

## Fixtures and Factories

**Current State: NONE**

No test data factories or fixtures exist.

**Recommended fixtures (for when tests are added):**

`tests/fixtures/engineEvents.ts`:
```typescript
export const mockEngineEvent = (overrides?: Partial<EngineEvent>): EngineEvent => ({
  msg_type: 1,
  sender: 'test-module',
  event: 'on_test_event',
  payload: {},
  _type: 'on',
  ...overrides
})

export const mockEngineStatus = (overrides?: Partial<EngineStatus>): EngineStatus => ({
  uptime: 3600,
  module_count: 5,
  event_count: 10000,
  ...overrides
})

export const mockModuleInfo = (overrides?: Partial<ModuleInfo>): ModuleInfo => ({
  id: 'test-module',
  interfaces: ['interface1', 'interface2'],
  liveness: 3,
  status: 'OK',
  ...overrides
})
```

## Coverage

**Current State: NONE**

No coverage tool configured. No coverage thresholds enforced.

**Recommended setup:**
- Use Vitest's built-in coverage (via `@vitest/coverage-v8`)
- Target: 80% line coverage minimum for new code
- Exclude: `if (__name__ == "__main__")` blocks (not applicable in TypeScript)

## Test Types

**Unit Tests:**
- Current: None
- Scope should cover: Pinia stores, composables, `ConnectionManager` class methods, utility functions (`classifyEvent`, `formatUptime`)
- Should mock all external dependencies (ZeroMQ, Electron APIs, file system)

**Integration Tests:**
- Current: None
- Scope should cover: IPC channel round-trips, msgpack encode/decode serialization, store + component integration

**E2E Tests:**
- Current: None
- Recommended framework: Playwright with Electron support
- Scope: Full app launch, panel add/remove, layout save/restore, connection flow

## Linting and Code Quality

**Current State: NO LINTING CONFIGURED**

No ESLint, Prettier, Biome, or similar tools configured:
- No `.eslintrc*` files
- No `.prettierrc*` files
- No `eslint.config.*` files
- No `biome.json`
- No `.editorconfig`

**Type Checking:**
- `vue-tsc` is installed as a devDependency (version 2.2.10) but not used in any npm script
- TypeScript strict mode is enabled in `tsconfig.json`
- No type-checking script in package.json

**Recommended additions:**
```json
// package.json scripts
{
  "typecheck": "vue-tsc --noEmit",
  "lint": "eslint src/",
  "lint:fix": "eslint src/ --fix",
  "format": "prettier --write \"src/**/*.{ts,vue}\""
}
```

## CI/CD

**Current State: NONE**

No CI/CD configuration found:
- No `.github/workflows/` directory
- No CI configuration files

## Testing Infrastructure Gaps

**Critical Gaps:**

1. **No test runner** — Cannot run any automated tests
2. **No test files** — Zero test coverage across entire codebase
3. **No mocking framework** — Cannot isolate units for testing
4. **No linting** — No automated code style enforcement
5. **No type-checking script** — `vue-tsc` installed but unused
6. **No CI pipeline** — No automated testing on commits/PRs

**File-Specific Untested Areas:**

| File | Lines | What needs testing |
|------|-------|-------------------|
| `src/main/connection.ts` | 196 | ZeroMQ socket lifecycle, reconnection logic, event classification, msgpack serialization |
| `src/main/index.ts` | 177 | Window state persistence, IPC handlers, window open handler, bounds visibility check |
| `src/preload/index.ts` | 46 | IPC channel mapping, event listener registration/cleanup |
| `src/renderer/store/engine.ts` | 74 | State mutations, event capping at 1000, async connect/disconnect |
| `src/renderer/store/layout.ts` | 41 | localStorage serialization, layout save/restore |
| `src/renderer/composables/usePanelState.ts` | 15 | Reactive sync to dockview params, deep watching |
| `src/renderer/App.vue` | 217 | Layout management, popout handling, panel lifecycle |
| Panel components | 88-286 each | Rendering, event handling, computed properties |

**Recommended Priority for Adding Tests:**

1. **High:** `src/main/connection.ts` — Core business logic, most complex file, handles external network communication
2. **High:** `src/renderer/store/engine.ts` — Central state management, event capping logic
3. **Medium:** `src/renderer/composables/usePanelState.ts` — Reusable composable, small surface area
4. **Medium:** `src/renderer/store/layout.ts` — localStorage edge cases
5. **Low:** Panel components — Mostly presentational, low logic complexity

## Recommended Test Setup

**Dependencies to add:**
```bash
npm install --save-dev vitest @vitest/coverage-v8 @vue/test-utils jsdom
```

**Vitest config** (`vitest.config.ts`):
```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'out/', 'release/']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@renderer': resolve(__dirname, 'src/renderer'),
      '@main': resolve(__dirname, 'src/main')
    }
  }
})
```

---

*Testing analysis: 2026-05-09*
