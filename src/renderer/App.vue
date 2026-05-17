<template>
  <div class="app">
    <Toolbar @add="onAddPanel" @save="onSave" @load="onLoad" @reset="onReset" />
    <DockviewVue
      class="dockview-theme-dark"
      style="height: 100%; width: 100%"
      :popout-url="popoutUrl"
      @ready="onReady"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { DockviewVue } from 'dockview-vue'
import type { DockviewReadyEvent } from 'dockview-vue'
import { useEngineStore } from './store/engine'
import { useLayoutStore } from './store/layout'
import { useGreeksStore } from './store/greeks'
import Toolbar from './components/Toolbar.vue'

const store = useEngineStore()
const layoutStore = useLayoutStore()
const greeksStore = useGreeksStore()

const isPopout = typeof window !== 'undefined' && window.location.search.includes('popout=1')
const popoutUrl = typeof window !== 'undefined'
  ? `${window.location.origin}${window.location.pathname}?popout=1`
  : 'about:blank'

let dockviewApi: any = null
let panelCounter = 0

const defaultLayout = () => {
  const api = dockviewApi
  if (!api) return

  // Clear existing
  api.panels.forEach((p: any) => api.removePanel(p))

  api.addPanel({
    id: 'events',
    component: 'events',
    title: 'Events'
  })

  api.addPanel({
    id: 'connection',
    component: 'connection',
    title: 'Connection',
    position: { referencePanel: 'events', direction: 'left' }
  })
  api.addPanel({
    id: 'order',
    component: 'order',
    title: 'Quick Order',
    position: { referencePanel: 'connection', direction: 'within' }
  })

  api.addPanel({
    id: 'greeks',
    component: 'greeks',
    title: 'Greeks',
    position: { referencePanel: 'events', direction: 'within' }
  })

  api.addPanel({
    id: 'modules',
    component: 'modules',
    title: 'Modules',
    position: { referencePanel: 'events', direction: 'right' }
  })
  api.addPanel({
    id: 'volcurve',
    component: 'volcurve',
    title: 'Vol Surface',
    position: { referencePanel: 'modules', direction: 'within' }
  })
  api.addPanel({
    id: 'mm',
    component: 'mm',
    title: 'Market Making',
    position: { referencePanel: 'modules', direction: 'within' }
  })
}

function onReady(event: DockviewReadyEvent) {
  const api = event.api
  dockviewApi = api

  if (isPopout) return

  const processedGroups = new Set<string>()
  const poppedOutPanels = new Set<string>()

  // Auto-convert floating groups (Shift+drag) to popout windows
  api.onDidAddGroup((group: any) => {
    const handler = () => {
      if (group.api.location.type !== 'floating') return
      if (processedGroups.has(group.id)) return

      const panelIds = group.panels?.map((p: any) => p.id) || []
      // 如果所有 panels 都是刚从 popout 关闭回来的，不重新 popout
      if (panelIds.length > 0 && panelIds.every((id: string) => poppedOutPanels.has(id))) {
        panelIds.forEach((id: string) => poppedOutPanels.delete(id))
        return
      }

      processedGroups.add(group.id)
      panelIds.forEach((id: string) => poppedOutPanels.add(id))
      api.addPopoutGroup(group).catch(() => {})
    }
    handler()
    group.api.onDidLocationChange(handler)
  })

  // 当 group 被移除时清理，避免 group id 累积导致内存泄漏
  api.onDidRemoveGroup((group: any) => {
    processedGroups.delete(group.id)
  })

  // Try restore saved layout
  const saved = layoutStore.loadLayout()
  if (saved) {
    try {
      api.fromJSON(saved)
      return
    } catch {
      layoutStore.clearAll()
    }
  }

  // Default layout
  defaultLayout()
}

function onAddPanel(type: string) {
  if (!dockviewApi) return
  const titles: Record<string, string> = {
    connection: 'Connection',
    events: 'Event Stream',
    modules: 'Modules',
    order: 'Quick Order',
    greeks: 'Greeks',
    volcurve: 'Vol Surface',
    mm: 'Market Making'
  }
  const id = `${type}_${++panelCounter}_${Date.now()}`
  const refId = dockviewApi.activePanel?.id || dockviewApi.panels[0]?.id || 'events'
  dockviewApi.addPanel({
    id,
    component: type,
    title: titles[type] || type,
    position: { referencePanel: refId, direction: 'within' }
  })
}

function onSave() {
  if (!dockviewApi) return
  // Collect panel states from component-level params
  const states = layoutStore.loadPanelStates()
  dockviewApi.panels.forEach((panel: any) => {
    states[panel.id] = panel.api.params || {}
  })
  layoutStore.savePanelStates(states)
  layoutStore.saveLayout(dockviewApi.toJSON())
}

function onLoad() {
  if (!dockviewApi) return
  const saved = layoutStore.loadLayout()
  if (saved) {
    try {
      dockviewApi.fromJSON(saved)
    } catch {
      layoutStore.clearAll()
      defaultLayout()
    }
  }
}

function onReset() {
  layoutStore.clearAll()
  defaultLayout()
}

onMounted(async () => {
  if (isPopout) return
  if (typeof window !== 'undefined' && (window as any).api?.engine) {
    const api = (window as any).api.engine
    // Sync current state in case auto-connect finished before listener registration
    const currentState = await api.getState()
    if (currentState) store.setState(currentState)
    api.onStateChange((s: any) => store.setState(s))
    api.onEvent((e: any) => {
      store.addEvent(e)
      if (e.event === 'greeks_update' && e.payload) {
        greeksStore.processGreeksEvent(e.payload as Record<string, unknown>)
      }
    })
    // Only update local heartbeat tracking — do NOT trigger admin queries
    // on every heartbeat message (that would flood the REQ socket).
    // Admin queries are polled on a timer in the main process instead.
    api.onHeartbeat(() => {})
  }
})
</script>

<style>
html, body, #app, .app {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #121212;
}

.dockview-theme-dark {
  --dv-background-color: #121212;
  --dv-paneview-background-color: #1e1e1e;
  --dv-tab-background-color: #1e1e1e;
  --dv-activegroup-visiblepanel-tab-background-color: #252525;
  --dv-inactivegroup-visiblepanel-tab-background-color: #1e1e1e;
  --dv-tab-divider-color: #333;
  --dv-group-view-background-color: #1a1a1a;
  --dv-separator-border: #333;
  --dv-floating-box-shadow: 0 4px 16px rgba(0,0,0,0.5);
}
</style>
