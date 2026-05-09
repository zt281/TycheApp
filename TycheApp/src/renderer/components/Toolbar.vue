<template>
  <div class="toolbar">
    <select v-model="selected" class="panel-select">
      <option value="">+ Add Panel</option>
      <option value="connection">Connection</option>
      <option value="events">Event Stream</option>
      <option value="modules">Modules</option>
      <option value="order">Quick Order</option>
      <option value="greeks">Greeks</option>
      <option value="volcurve">Vol Surface</option>
      <option value="mm">Market Making</option>
    </select>
    <button class="btn" @click="add">Add</button>
    <div class="spacer" />
    <button class="btn" @click="emit('save')">Save</button>
    <button class="btn" @click="emit('load')">Load</button>
    <button class="btn danger" @click="emit('reset')">Reset</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'add', type: string): void
  (e: 'save'): void
  (e: 'load'): void
  (e: 'reset'): void
}>()

const selected = ref('')

function add() {
  if (selected.value) {
    emit('add', selected.value)
    selected.value = ''
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
  font-family: system-ui, sans-serif;
  font-size: 12px;
}
.panel-select {
  background: #252525;
  border: 1px solid #444;
  color: #e0e0e0;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  min-width: 130px;
}
.btn {
  padding: 4px 12px;
  border: 1px solid #444;
  background: #252525;
  color: #e0e0e0;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}
.btn:hover {
  background: #333;
}
.btn.danger:hover {
  background: #5c1a1a;
  border-color: #7a2222;
}
.spacer {
  flex: 1;
}
</style>
