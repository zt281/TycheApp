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

export interface GreeksData {
  instrument_id: string
  underlying_id: string
  underlying_price: number
  strike: number
  expiry: string
  is_call: boolean
  market_price: number
  implied_vol: number
  delta: number
  gamma: number
  vega: number
  theta: number
  rho: number
  timestamp: string
}
