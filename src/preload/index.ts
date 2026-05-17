import { contextBridge, ipcRenderer } from 'electron'
import type { ConnectionState, EngineEvent, EngineStatus, ModuleInfo } from '../main/connection'

export interface PreloadAPI {
  engine: {
    connect: () => Promise<boolean>
    disconnect: () => Promise<boolean>
    queryStatus: () => Promise<EngineStatus | null>
    queryModules: () => Promise<ModuleInfo[] | null>
    getState: () => Promise<ConnectionState | null>
    onEvent: (callback: (data: EngineEvent & { _type: string }) => void) => () => void
    onHeartbeat: (callback: (moduleIds: string[]) => void) => () => void
    onStateChange: (callback: (state: ConnectionState) => void) => () => void
  }
}

const api: PreloadAPI = {
  engine: {
    connect: () => ipcRenderer.invoke('engine:connect'),
    disconnect: () => ipcRenderer.invoke('engine:disconnect'),
    queryStatus: () => ipcRenderer.invoke('engine:query-status'),
    queryModules: () => ipcRenderer.invoke('engine:query-modules') as Promise<ModuleInfo[] | null>,
    getState: () => ipcRenderer.invoke('engine:get-state'),
    onEvent: (callback) => {
      const handler = (_: unknown, data: EngineEvent & { _type: string }) => callback(data)
      ipcRenderer.on('engine:event', handler)
      return () => ipcRenderer.removeListener('engine:event', handler)
    },
    onHeartbeat: (callback) => {
      const handler = (_: unknown, moduleIds: string[]) => callback(moduleIds)
      ipcRenderer.on('engine:heartbeat', handler)
      return () => ipcRenderer.removeListener('engine:heartbeat', handler)
    },
    onStateChange: (callback) => {
      const handler = (_: unknown, state: ConnectionState) => callback(state)
      ipcRenderer.on('engine:state-change', handler)
      return () => ipcRenderer.removeListener('engine:state-change', handler)
    }
  }
}

contextBridge.exposeInMainWorld('api', api)

declare global {
  interface Window {
    api: PreloadAPI
  }
}
