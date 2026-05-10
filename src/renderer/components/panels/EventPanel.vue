<template>
  <div class="event-panel">
    <div class="header">
      <h3>Event Stream</h3>
      <button @click="store.clearEvents">Clear</button>
    </div>
    <div class="filters">
      <label v-for="t in eventTypes" :key="t">
        <input v-model="selectedTypes" type="checkbox" :value="t" />
        {{ t }}
      </label>
    </div>
    <div class="list">
      <div
        v-for="(evt, i) in filteredEvents"
        :key="i"
        class="event-row"
        :class="evt._type"
      >
        <span class="time">{{ formatTime(evt.timestamp) }}</span>
        <span class="type">{{ evt._type }}</span>
        <span class="sender">{{ evt.sender }}</span>
        <span class="name">{{ evt.event }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEngineStore } from '../../store/engine'
import { usePanelState } from '../../composables/usePanelState'

const props = defineProps<{ params: any }>()

const store = useEngineStore()
const eventTypes = ['on', 'on_common', 'ack', 'whisper', 'broadcast', 'unknown']

const state = usePanelState(props.params?.api, {
  selectedTypes: [...eventTypes],
})

const selectedTypes = computed({
  get: () => state.selectedTypes as string[],
  set: (v) => { state.selectedTypes = v },
})

const filteredEvents = computed(() =>
  store.events.filter(e => selectedTypes.value.includes(e._type)).slice(-200)
)

function formatTime(ts?: number): string {
  if (!ts) return '--:--:--'
  const d = new Date(ts * 1000)
  return d.toLocaleTimeString('en-US', { hour12: false })
}
</script>

<style scoped>
.event-panel {
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
button {
  padding: 2px 8px;
  border: 1px solid #444;
  background: #1e1e1e;
  color: #e0e0e0;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
}
.filters {
  display: flex;
  gap: 10px;
  padding: 6px 12px;
  border-bottom: 1px solid #333;
  flex-wrap: wrap;
}
.filters label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #aaa;
  cursor: pointer;
}
.list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}
.event-row {
  display: grid;
  grid-template-columns: 70px 80px 100px 1fr;
  gap: 8px;
  padding: 3px 12px;
  border-bottom: 1px solid #222;
}
.event-row:hover { background: #1a1a1a; }
.time { color: #666; font-family: monospace; }
.type { font-weight: 600; }
.on { color: #4fc3f7; }
.on_common { color: #81c784; }
.ack { color: #ffb74d; }
.whisper { color: #ce93d8; }
.broadcast { color: #ef9a9a; }
.sender { color: #aaa; }
.name { color: #ddd; }
</style>
