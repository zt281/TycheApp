export interface EngineEvent {
  msg_type: number
  sender: string
  event: string
  payload: Record<string, unknown>
  recipient?: string
  durability?: number
  timestamp?: number
  correlation_id?: string
  _type: string
}

export interface EngineStatus {
  uptime: number
  module_count: number
  event_count: number
}

export interface ModuleInfo {
  id: string
  interfaces: string[]
  liveness: number
  status: 'OK' | 'WARN' | 'EXPIRED'
}

export type ConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'RECONNECTING'
