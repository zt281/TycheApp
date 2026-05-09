import { defineStore } from 'pinia'

const LAYOUT_KEY = 'tycheapp-layout-v1'
const PANEL_STATE_KEY = 'tycheapp-panel-states-v1'

export interface PanelState {
  [panelId: string]: Record<string, unknown>
}

export const useLayoutStore = defineStore('layout', () => {
  function saveLayout(layout: unknown) {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout))
  }

  function loadLayout(): unknown | null {
    const raw = localStorage.getItem(LAYOUT_KEY)
    return raw ? JSON.parse(raw) : null
  }

  function savePanelStates(states: PanelState) {
    localStorage.setItem(PANEL_STATE_KEY, JSON.stringify(states))
  }

  function loadPanelStates(): PanelState {
    const raw = localStorage.getItem(PANEL_STATE_KEY)
    return raw ? JSON.parse(raw) : {}
  }

  function clearAll() {
    localStorage.removeItem(LAYOUT_KEY)
    localStorage.removeItem(PANEL_STATE_KEY)
  }

  return {
    saveLayout,
    loadLayout,
    savePanelStates,
    loadPanelStates,
    clearAll
  }
})
