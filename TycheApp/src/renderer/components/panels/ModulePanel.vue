<template>
  <div class="module-panel">
    <div class="header">
      <h3>Modules</h3>
      <span class="count">{{ store.modules.length }}</span>
    </div>
    <div class="list">
      <div
        v-for="mod in store.modules"
        :key="mod.id"
        class="module-row"
      >
        <div class="top">
          <span class="id">{{ mod.id }}</span>
          <span class="badge" :class="mod.status.toLowerCase()">{{ mod.status }}</span>
        </div>
        <div class="interfaces">
          <span v-for="iface in mod.interfaces" :key="iface" class="tag">{{ iface }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEngineStore } from '../../store/engine'

const store = useEngineStore()
</script>

<style scoped>
.module-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #e0e0e0;
  font-family: system-ui, sans-serif;
  font-size: 12px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #333;
}
h3 { margin: 0; font-size: 13px; }
.count {
  background: #333;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 11px;
}
.list {
  flex: 1;
  overflow-y: auto;
}
.module-row {
  padding: 8px 12px;
  border-bottom: 1px solid #222;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.id { font-family: monospace; font-weight: 600; }
.badge {
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}
.badge.ok { background: #2e7d32; color: #fff; }
.badge.warn { background: #f9a825; color: #000; }
.badge.expired { background: #c62828; color: #fff; }
.interfaces {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.tag {
  background: #1a3a4a;
  color: #4fc3f7;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 10px;
}
</style>
