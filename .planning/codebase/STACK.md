# Technology Stack

**Analysis Date:** 2026-05-09

## Languages

**Primary:**
- TypeScript 5.9.3 - All application logic (main, preload, renderer processes)
- Vue Single File Components (SFC) - UI components with `<template>`, `<script setup lang="ts">`, `<style scoped>`

**Secondary:**
- HTML - Entry point template (`src/renderer/index.html`)
- CSS - Component-scoped styles using standard CSS (no preprocessor detected)

## Runtime

**Environment:**
- Node.js v24.1.0 (development environment)
- Electron 36.x (Chromium + Node.js runtime for desktop app)

**Package Manager:**
- npm 11.12.1
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Electron 36.x - Desktop application framework (main + renderer processes)
- Vue 3.5.33 - Progressive UI framework with Composition API (`<script setup>`)
- Vue Router 4.6.4 - Client-side routing (imported but no routes configured in current codebase)
- Pinia 3.0.4 - State management using Composition API style (`defineStore` with `ref`/`computed`)
- dockview-vue 5.2.0 - Docking layout manager (tabs, groups, grids, splitviews, drag-and-drop, floating panels)

**Testing:**
- Not detected - No test framework configured

**Build/Dev:**
- Vite 6.4.2 - Build tool and dev server
- electron-vite 3.1.0 - Electron-specific Vite configuration (multi-process builds)
- @vitejs/plugin-vue 5.2.4 - Vue SFC compilation for Vite
- vue-tsc 2.2.12 - TypeScript type checking for Vue SFCs
- electron-builder 26.8.1 - Application packaging and distribution

## Key Dependencies

**Critical:**
- `zeromq` 6.5.0 - ZeroMQ bindings for Node.js; used for TCP socket communication with TycheEngine backend
  - Imported in: `src/main/connection.ts`
  - Uses: `Subscriber` (event/heartbeat streams), `Request` (admin queries)
  - Explicitly externalized in build config (`electron.vite.config.ts` line 15)
- `@msgpack/msgpack` 3.1.3 - MessagePack serialization; encodes/decodes all messages to/from TycheEngine
  - Imported in: `src/main/connection.ts`
  - Uses: `encode()`, `decode()` for binary message serialization
- `electron-log` 5.4.3 - Cross-process logging for Electron
  - Imported in: `src/main/index.ts`, `src/main/connection.ts`
  - Uses: `log.info()`, `log.error()` for main process logging

**Infrastructure:**
- `pinia` 3.0.4 - Global state management (engine connection state, layout state)
- `vue` 3.5.33 - UI framework
- `vue-router` 4.6.4 - Routing (available but unused in current implementation)
- `dockview-vue` 5.2.0 - Docking panel system for professional trading desk layout

## Configuration

**TypeScript:**
- `tsconfig.json` - Main renderer/source config
  - Target: ES2022, Module: ESNext, ModuleResolution: bundler
  - Strict mode enabled, `noUnusedLocals: true`, `noUnusedParameters: true`
  - Path aliases: `@/*` → `src/*`, `@renderer/*` → `src/renderer/*`, `@main/*` → `src/main/*`
  - Includes: `src/**/*.ts`, `src/**/*.vue`
  - Excludes: `node_modules`, `out`, `release`
- `tsconfig.node.json` - Config for Vite/Electron build tooling files
  - Includes: `electron.vite.config.*`, `vite.*.config.ts`

**Build:**
- `electron.vite.config.ts` - Multi-process Vite configuration
  - **main process**: Entry `src/main/index.ts`, output format CJS, externalizes `zeromq`
  - **preload process**: Entry `src/preload/index.ts`, output format CJS
  - **renderer process**: Entry `src/renderer/index.html`, uses `@vitejs/plugin-vue`
  - Path aliases: `@` → `src`, `@main` → `src/main`, `@renderer` → `src/renderer`
  - HMR overlay disabled for renderer dev server

**Electron Builder:**
- Configured in `package.json` under `"build"` key
  - App ID: `com.tyche.app`
  - Product name: `TycheApp`
  - Output directory: `release/`
  - Includes only: `out/` directory
  - macOS target: `dmg`
  - Windows target: `nsis`
  - Linux target: `AppImage`

**Environment:**
- No `.env` file usage detected
- No environment variable configuration in source
- Window state persisted to `app.getPath('userData')/window-state.json`
- Layout state persisted to `localStorage` (renderer process)

## Platform Requirements

**Development:**
- Node.js >= 14 (electron-log requirement)
- npm for package management
- Native build tools for `zeromq` (CMake, Python for node-gyp)
- Platform: Cross-platform (Windows, macOS, Linux supported)

**Production:**
- Target: Desktop application (Electron)
- No web deployment target
- Requires TycheEngine backend running on `127.0.0.1` with ZeroMQ ports 5556, 5558, 5560

## Scripts

```bash
npm run dev              # Development mode with HMR (electron-vite dev)
npm run dev:inspect      # Dev mode with Node inspector on port 5858
npm run build            # Production build (electron-vite build)
npm run preview          # Preview production build
npm run dist             # Build distributable packages (electron-builder)
npm run dist:dir         # Build distributable without packaging
npm run postinstall      # Install native app dependencies
```

---

*Stack analysis: 2026-05-09*
