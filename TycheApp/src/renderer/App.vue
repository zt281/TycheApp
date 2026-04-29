<template>
  <div class="app">
    <DockviewVue
      :components="components"
      :watermark-component="Watermark"
      @ready="onReady"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { DockviewVue } from 'dockview-vue'
import type { DockviewReadyEvent } from 'dockview-vue'
import { useEngineStore } from './store/engine'
import ConnectionPanel from './components/panels/ConnectionPanel.vue'
import EventPanel from './components/panels/EventPanel.vue'
import ModulePanel from './components/panels/ModulePanel.vue'

const store = useEngineStore()

const components = {
  connection: ConnectionPanel,
  events: EventPanel,
  modules: ModulePanel
}

const Watermark = () => null

function onReady(event: DockviewReadyEvent) {
  const api = event.api

  api.addPanel({
    id: 'connection',
    component: 'connection',
    title: 'Connection',
    position: { direction: 'left', size: 250 }
  })

  api.addPanel({
    id: 'events',
    component: 'events',
    title: 'Events',
    position: { direction: 'center' }
  })

  api.addPanel({
    id: 'modules',
    component: 'modules',
    title: 'Modules',
    position: { direction: 'right', size: 300 }
  })
}

onMounted(() => {
  window.api.engine.onStateChange((s) => store.setState(s))
  window.api.engine.onEvent((e) => store.addEvent(e))
  window.api.engine.onHeartbeat(() => store.refreshModules())
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
