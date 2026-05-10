# Codebase Concerns

**Analysis Date:** 2026-05-09

## Tech Debt

### Hardcoded Connection Parameters
- Issue: Engine host, ports, and event classification rules are hardcoded with no configuration mechanism.
- Files: `src/main/connection.ts` (lines 32-44)
- Impact: Cannot connect to a remote engine or change ports without recompiling the application. Blocks multi-environment deployments.
- Fix approach: Move `ENGINE_HOST`, `EVENT_PORT`, `HEARTBEAT_PORT`, `ADMIN_PORT`, and `classifyEvent` rules into an environment-aware config file or app settings store.

### Mock/Placeholder Data in Trading Panels
- Issue: Greeks, Order, Market Making, and Vol Curve panels contain entirely static mock data with no engine integration.
- Files:
  - `src/renderer/components/panels/GreeksPanel.vue` (lines 66-72: hardcoded positions array)
  - `src/renderer/components/panels/OrderPanel.vue` (lines 86-88: hardcoded `lastPrice`/`latency`; lines 104-108: hardcoded `recentOrders`)
  - `src/renderer/components/panels/MarketMakingPanel.vue` (lines 107-124: hardcoded `midPrice`, `spread`, `asks`, `bids`)
  - `src/renderer/components/panels/VolCurvePanel.vue` (lines 67-106: hardcoded `points`, `atmIV`, `skew`, `tenorData`)
- Impact: These panels are non-functional for real trading. Users see fake data.
- Fix approach: Wire each panel to engine events or admin queries. Define msgpack event schemas for market data, positions, and order status.

### `any` Type Usage
- Issue: Multiple components use `any` for typed APIs and props, bypassing strict TypeScript checks.
- Files:
  - `src/renderer/App.vue` (line 29: `dockviewApi: any`)
  - `src/renderer/composables/usePanelState.ts` (line 3: `api: any`)
  - `src/renderer/components/HeaderActions.vue` (lines 16-17: `group: any`, `api: any`)
  - All panel components use `params: any` in their props (`ConnectionPanel.vue`, `EventPanel.vue`, `GreeksPanel.vue`, `MarketMakingPanel.vue`, `ModulePanel.vue`, `OrderPanel.vue`, `VolCurvePanel.vue`)
- Impact: Loss of compile-time safety. Refactoring dockview or panel APIs becomes error-prone.
- Fix approach: Import and use `DockviewApi` and panel param types from `dockview-vue`. Define a `PanelParams` interface in `src/renderer/types/index.ts`.

### Empty Catch Blocks / Silent Failures
- Issue: Several catch blocks suppress errors without user feedback or recovery logic.
- Files:
  - `src/renderer/App.vue` (line 109: `api.addPopoutGroup(group).catch(() => {})`)
  - `src/renderer/App.vue` (lines 126, 173: layout restore failures silently fall back to defaults)
  - `src/renderer/store/engine.ts` (lines 39-43: connect failure silently resets state to `DISCONNECTED`)
  - `src/main/index.ts` (lines 35-37: window state load failure silently returns null)
- Impact: Users have no visibility into why layout restoration failed, why the engine did not connect, or why a popout window did not open.
- Fix approach: Surface errors via toast notifications, log to a user-visible error stream, or at minimum log with `electron-log` in the renderer.

### Missing Reconnection Logic
- Issue: `ConnectionManager` declares a `RECONNECTING` state but never uses it. If the ZeroMQ socket drops, the event loop logs the error and continues, but no reconnection is attempted.
- Files: `src/main/connection.ts` (lines 7, 86-89, 154-158, 176-180)
- Impact: A transient network issue or engine restart requires manual disconnect/reconnect from the UI.
- Fix approach: Implement exponential backoff reconnection in `ConnectionManager`. On socket error, transition to `RECONNECTING`, close sockets, wait, and re-call `connect()`.

### Module Health Map Never Decayed
- Issue: `moduleHealth` is incremented on each heartbeat but never decremented or cleared. Stale modules accumulate indefinitely.
- Files: `src/main/connection.ts` (lines 53, 172-174)
- Impact: Memory leak over long sessions. Dead modules may appear healthy if they were seen once.
- Fix approach: Add a heartbeat timeout (e.g., 3 missed heartbeats = remove from map) and emit a `module-expired` event.

## Known Bugs

### Event Stream Key Uses Array Index
- Issue: The `EventPanel` uses `v-for` index (`i`) as `:key` for event rows.
- Files: `src/renderer/components/panels/EventPanel.vue` (line 16: `:key="i"`)
- Impact: Vue may reuse DOM nodes incorrectly when events are filtered or the array is trimmed, causing visual glitches or stale data display.
- Fix approach: Use a composite key such as `evt.correlation_id + evt.timestamp` or assign a client-side UUID on ingestion.

### `priceClass` Uses `Math.random()` in Computed
- Issue: `OrderPanel.priceClass` calls `Math.random()` inside a computed property.
- Files: `src/renderer/components/panels/OrderPanel.vue` (lines 89-92)
- Impact: The price indicator changes on every re-render unpredictably, even when the price has not changed. This is confusing UX and wastes render cycles.
- Fix approach: Remove the random logic. Derive `priceClass` from actual price deltas stored in reactive state.

### `totalPL` Is a Hardcoded Constant in Computed
- Issue: `GreeksPanel.totalPL` is a computed that always returns `2847.50`.
- Files: `src/renderer/components/panels/GreeksPanel.vue` (line 78)
- Impact: The P&L display is meaningless.
- Fix approach: Compute from actual position data or engine-provided portfolio summary.

## Security Considerations

### `sandbox: false` in BrowserWindow
- Issue: Both the main window and popout windows disable the renderer sandbox.
- Files: `src/main/index.ts` (lines 77, 113)
- Impact: A compromised renderer process has full Node.js access, enabling arbitrary code execution. This is a significant attack surface for a trading application.
- Current mitigation: `contextIsolation: true`, `nodeIntegration: false`, and a preload script limit direct Node access.
- Recommendations: Enable `sandbox: true` if possible. If native modules (e.g., `zeromq`) require it, document the security trade-off and ensure all IPC is strictly validated. Consider using `contextBridge` with allow-listing only required APIs (already partially done).

### No IPC Input Validation
- Issue: IPC handlers in the main process do not validate arguments.
- Files: `src/main/index.ts` (lines 135-155)
- Impact: Malicious or buggy renderer code could pass unexpected payloads to main-process handlers. Currently low risk because handlers take no arguments, but this will change as features are added.
- Recommendations: Add Zod or similar runtime validation to all `ipcMain.handle` inputs before the logic layer.

### No Content Security Policy
- Issue: No CSP meta tag or `webRequest` header is configured.
- Files: `src/main/index.ts`
- Impact: If the app loads remote content or is subject to XSS, there are no restrictions on script execution.
- Recommendations: Set a strict CSP via `webContents.session.webRequest.onHeadersReceived` or in the HTML `<meta>` tag.

## Performance Bottlenecks

### Event Array Re-creation on Every Trim
- Issue: `addEvent` in the engine store replaces the entire events array via `slice(-maxEvents)` when the buffer overflows.
- Files: `src/renderer/store/engine.ts` (lines 26-30)
- Impact: Triggers Vue reactivity on the entire array, causing `EventPanel` to re-render all 1000 rows instead of just the new ones.
- Improvement path: Use a circular buffer or `shift()` individual items. Alternatively, keep events in a `Map` keyed by insertion order and render from an iterator.

### SVG Re-renders on Every VolCurve Tick
- Issue: `VolCurvePanel` renders an SVG with `v-for` over static data. Any reactive change (e.g., symbol selection) re-renders the entire chart.
- Files: `src/renderer/components/panels/VolCurvePanel.vue`
- Impact: Unnecessary DOM churn. Will become significant once data is live and updates frequently.
- Improvement path: Extract the chart into a dedicated component with `v-once` or manual canvas rendering for high-frequency updates.

### Unbounded `moduleHealth` Map Growth
- Issue: As noted above, `moduleHealth` grows without bound.
- Files: `src/main/connection.ts` (line 53)
- Impact: Linear memory growth over the lifetime of the process.
- Improvement path: Implement TTL eviction for module health entries.

## Fragile Areas

### Dockview Layout Serialization
- Issue: `onSave` and `onLoad` serialize the full dockview JSON including panel IDs and group structures. There is no schema versioning or migration.
- Files: `src/renderer/App.vue` (lines 156-177), `src/renderer/store/layout.ts`
- Why fragile: A dockview library upgrade that changes JSON shape will break saved layouts, causing silent fallback to defaults and loss of user workspace state.
- Safe modification: Always validate loaded JSON against a schema before calling `fromJSON`. Store a `version` field alongside the layout.
- Test coverage: No tests exist for layout save/restore.

### Preload Script Extension Guessing
- Issue: `resolvePreload()` iterates `['.js', '.cjs', '.mjs']` to find the preload file at runtime.
- Files: `src/main/index.ts` (lines 50-57)
- Why fragile: If the build output changes format (e.g., `.mjs` becomes default), the wrong file may be selected, or the app may fail to start in production.
- Safe modification: Use a deterministic build output path. Configure `electron-vite` to emit a known filename and reference it directly.

### ZeroMQ Socket Lifecycle
- Issue: `disconnect()` sets flags to `false` and calls `.close()` on sockets, but the async loops may still be awaiting `receive()` when close is called. The `zeromq` v6 close behavior during an active receive is not explicitly handled.
- Files: `src/main/connection.ts` (lines 93-107)
- Why fragile: Race conditions could cause unhandled promise rejections or socket resource leaks.
- Safe modification: Use `AbortController` or explicit socket termination patterns supported by `zeromq` v6. Add a `disposed` guard in the receive loops.

## Scaling Limits

### Single Engine Instance
- Current capacity: One hardcoded `127.0.0.1` connection.
- Limit: Cannot monitor or trade against multiple engine instances.
- Scaling path: Refactor `ConnectionManager` into a factory/registry pattern. Support multiple named connections in the UI.

### Event Buffer Size
- Current capacity: 1000 events in the renderer store.
- Limit: High-throughput engines may drop events the user wants to inspect.
- Scaling path: Make `maxEvents` configurable. Consider paginated or virtual-scrolled event history backed by a file or database.

## Dependencies at Risk

### `zeromq` v6 Native Bindings
- Risk: `zeromq` v6 relies on native Node-API bindings. Electron version bumps frequently break native modules.
- Impact: Build failures after `electron` upgrades. `postinstall` script runs `electron-builder install-app-deps` which helps, but CI may still fail on Node/Electron version mismatches.
- Migration plan: Pin `zeromq` and `electron` versions in CI. Test rebuilds before upgrading either. Consider vendoring prebuilt binaries if rebuild times become problematic.

### `electron` v36 (Very New)
- Risk: Electron 36 was released in early 2025. It may have undiscovered bugs on Windows, especially around window state and popout behavior.
- Impact: Stability issues in production.
- Migration plan: Monitor Electron release notes. Consider downgrading to the latest stable LTS track (v34 or v35) if issues arise.

### `vue-tsc` v2.2.10
- Risk: `vue-tsc` is pinned but there is no `type-check` script in `package.json`.
- Impact: Type errors may be committed unnoticed.
- Migration plan: Add `"type-check": "vue-tsc --noEmit"` to scripts and enforce it in CI.

## Missing Critical Features

### No Test Suite
- Problem: There are zero test files in the repository. No unit tests, no integration tests, no E2E tests.
- Blocks: Safe refactoring of `ConnectionManager`, layout serialization, or panel components. Any change is manual-verification only.
- Files affected: Entire codebase.

### No Error Boundary / Global Error Handler
- Problem: A Vue render error or unhandled promise rejection in the renderer crashes the panel or leaves it blank with no user feedback.
- Blocks: Production reliability.

### No Settings / Preferences UI
- Problem: Engine host, ports, theme, and event buffer size cannot be changed at runtime.
- Blocks: Deployment flexibility and user customization.

### No Order Submission to Engine
- Problem: The `OrderPanel` submit button only appends to a local `recentOrders` array. No IPC channel exists to send orders to the engine.
- Blocks: Actual order execution.

## Test Coverage Gaps

### Entire Application Untested
- What is not tested: Everything.
- Files: All files under `src/`
- Risk: Any refactor (e.g., upgrading `dockview-vue`, changing `ConnectionManager` state machine, adding new panels) may introduce regressions with no automated detection.
- Priority: High. Add at minimum:
  - Unit tests for `ConnectionManager` state transitions (mock `zeromq`)
  - Unit tests for `usePanelState` composable
  - Component tests for `ConnectionPanel` and `EventPanel` using `@vue/test-utils`
  - E2E tests for layout save/restore using Playwright or Spectron successor

---

*Concerns audit: 2026-05-09*
