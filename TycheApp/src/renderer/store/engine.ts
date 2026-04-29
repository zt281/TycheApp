import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EngineEvent, EngineStatus, ModuleInfo, ConnectionState } from '../types'

export const useEngineStore = defineStore('engine', () => {
  const state = ref<ConnectionState>('DISCONNECTED')
  const status = ref<EngineStatus | null>(null)
  const modules = ref<ModuleInfo[]>([])
  const events = ref<EngineEvent[]>([])
  const maxEvents = 1000

  const isConnected = computed(() => state.value === 'CONNECTED')

  function setState(s: ConnectionState) {
    state.value = s
  }

  function setStatus(s: EngineStatus | null) {
    status.value = s
  }

  function setModules(m: ModuleInfo[]) {
    modules.value = m
  }

  function addEvent(evt: EngineEvent) {
    events.value.push(evt)
    if (events.value.length > maxEvents) {
      events.value = events.value.slice(-maxEvents)
    }
  }

  function clearEvents() {
    events.value = []
  }

  async function connect() {
    setState('CONNECTING')
    try {
      await window.api.engine.connect()
    } catch {
      setState('DISCONNECTED')
    }
  }

  async function disconnect() {
    await window.api.engine.disconnect()
  }

  async function refreshStatus() {
    status.value = await window.api.engine.queryStatus()
  }

  async function refreshModules() {
    modules.value = await window.api.engine.queryModules()
  }

  return {
    state,
    status,
    modules,
    events,
    isConnected,
    setState,
    setStatus,
    setModules,
    addEvent,
    clearEvents,
    connect,
    disconnect,
    refreshStatus,
    refreshModules
  }
})
