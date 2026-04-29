<template>
  <div class="connection-panel">
    <div class="header">
      <h3>Engine Connection</h3>
      <span class="badge" :class="store.state.toLowerCase()">{{ store.state }}</span>
    </div>
    <div class="actions">
      <button :disabled="store.isConnected" @click="store.connect">Connect</button>
      <button :disabled="!store.isConnected" @click="store.disconnect">Disconnect</button>
      <button :disabled="!store.isConnected" @click="store.refreshStatus">Refresh Status</button>
      <button :disabled="!store.isConnected" @click="store.refreshModules">Refresh Modules</button>
    </div>
    <div v-if="store.status" class="status">
      <div class="row"><label>Uptime:</label><span>{{ formatUptime(store.status.uptime) }}</span></div>
      <div class="row"><label>Modules:</label><span>{{ store.status.module_count }}</span></div>
      <div class="row"><label>Events:</label><span>{{ store.status.event_count }}</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEngineStore } from '../../store/engine'

const store = useEngineStore()

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${h}h ${m}m ${s}s`
}
</script>

<style scoped>
.connection-panel {
  padding: 12px;
  color: #e0e0e0;
  font-family: system-ui, sans-serif;
  height: 100%;
  overflow: auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
h3 { margin: 0; font-size: 14px; }
.badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}
.badge.connected { background: #2e7d32; color: #fff; }
.badge.disconnected { background: #c62828; color: #fff; }
.badge.connecting { background: #f9a825; color: #000; }
.badge.reconnecting { background: #ef6c00; color: #fff; }
.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
button {
  padding: 6px 12px;
  border: 1px solid #444;
  background: #1e1e1e;
  color: #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
button:hover:not(:disabled) { background: #2a2a2a; }
button:disabled { opacity: 0.4; cursor: not-allowed; }
.status {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
label { color: #888; }
</style>
