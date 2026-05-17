import { defineStore } from 'pinia'
import { ref, shallowRef, triggerRef, computed } from 'vue'
import type { EngineEvent, EngineStatus, ModuleInfo, ConnectionState } from '../types'

export const useEngineStore = defineStore('engine', () => {
  const state = ref<ConnectionState>('DISCONNECTED')
  const status = ref<EngineStatus | null>(null)
  const modules = ref<ModuleInfo[]>([])
  const events = shallowRef<EngineEvent[]>([])
  const maxEvents = 1000

  // RAF 批处理缓冲区
  let pendingEvents: EngineEvent[] = []
  let eventRafScheduled = false

  function flushEvents() {
    eventRafScheduled = false
    if (pendingEvents.length === 0) return
    const arr = events.value
    arr.push(...pendingEvents)
    pendingEvents = []
    if (arr.length > maxEvents) {
      arr.splice(0, arr.length - maxEvents)
    }
    triggerRef(events)
  }

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
    pendingEvents.push(evt)
    if (!eventRafScheduled) {
      eventRafScheduled = true
      requestAnimationFrame(flushEvents)
    }
  }

  function clearEvents() {
    pendingEvents = []
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
    const result = await window.api.engine.queryStatus()
    if (result) status.value = result
  }

  async function refreshModules() {
    const result = await window.api.engine.queryModules()
    if (result) modules.value = result
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
