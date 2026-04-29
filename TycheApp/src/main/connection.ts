import { EventEmitter } from 'events'
import { Subscriber, Request } from 'zeromq'
import { encode, decode } from '@msgpack/msgpack'
import log from 'electron-log'

export type ConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'RECONNECTING'

export interface EngineEvent {
  msg_type: number
  sender: string
  event: string
  payload: Record<string, unknown>
  recipient?: string
  durability?: number
  timestamp?: number
  correlation_id?: string
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

const ENGINE_HOST = '127.0.0.1'
const EVENT_PORT = 5556
const HEARTBEAT_PORT = 5558
const ADMIN_PORT = 5560

function classifyEvent(eventName: string): string {
  if (eventName.startsWith('on_common_')) return 'on_common'
  if (eventName.startsWith('on_')) return 'on'
  if (eventName.startsWith('ack_')) return 'ack'
  if (eventName.startsWith('whisper_')) return 'whisper'
  if (eventName.startsWith('broadcast_')) return 'broadcast'
  return 'unknown'
}

export class ConnectionManager extends EventEmitter {
  private state: ConnectionState = 'DISCONNECTED'
  private eventSocket: Subscriber | null = null
  private heartbeatSocket: Subscriber | null = null
  private adminSocket: Request | null = null
  private eventLoopRunning = false
  private heartbeatLoopRunning = false
  private moduleHealth: Map<string, number> = new Map()

  getState(): ConnectionState {
    return this.state
  }

  private setState(state: ConnectionState): void {
    if (this.state === state) return
    this.state = state
    this.emit('state-change', state)
  }

  async connect(): Promise<void> {
    if (this.state === 'CONNECTED' || this.state === 'CONNECTING') return
    this.setState('CONNECTING')

    try {
      this.eventSocket = new Subscriber()
      this.eventSocket.connect(`tcp://${ENGINE_HOST}:${EVENT_PORT}`)
      this.eventSocket.subscribe('')

      this.heartbeatSocket = new Subscriber()
      this.heartbeatSocket.connect(`tcp://${ENGINE_HOST}:${HEARTBEAT_PORT}`)
      this.heartbeatSocket.subscribe('')

      this.adminSocket = new Request()
      this.adminSocket.connect(`tcp://${ENGINE_HOST}:${ADMIN_PORT}`)

      this.setState('CONNECTED')
      log.info('[ConnectionManager] Connected to TycheEngine')

      this.startEventLoop()
      this.startHeartbeatLoop()
    } catch (err) {
      log.error('[ConnectionManager] Connect failed:', err)
      this.setState('DISCONNECTED')
      throw err
    }
  }

  async disconnect(): Promise<void> {
    this.eventLoopRunning = false
    this.heartbeatLoopRunning = false

    this.eventSocket?.close()
    this.heartbeatSocket?.close()
    this.adminSocket?.close()

    this.eventSocket = null
    this.heartbeatSocket = null
    this.adminSocket = null

    this.setState('DISCONNECTED')
    log.info('[ConnectionManager] Disconnected')
  }

  async queryStatus(): Promise<EngineStatus | null> {
    if (!this.adminSocket || this.state !== 'CONNECTED') return null
    try {
      await this.adminSocket.send(encode('STATUS'))
      const [msg] = await this.adminSocket.receive()
      return decode(msg) as EngineStatus
    } catch (err) {
      log.error('[ConnectionManager] queryStatus failed:', err)
      return null
    }
  }

  async queryModules(): Promise<ModuleInfo[]> {
    if (!this.adminSocket || this.state !== 'CONNECTED') return []
    try {
      await this.adminSocket.send(encode('MODULES'))
      const [msg] = await this.adminSocket.receive()
      const raw = decode(msg) as Record<string, { interfaces: string[]; liveness: number }>
      return Object.entries(raw).map(([id, info]) => {
        const liveness = info.liveness ?? 0
        return {
          id,
          interfaces: info.interfaces ?? [],
          liveness,
          status: liveness >= 2 ? 'OK' : liveness >= 1 ? 'WARN' : 'EXPIRED'
        }
      })
    } catch (err) {
      log.error('[ConnectionManager] queryModules failed:', err)
      return []
    }
  }

  private startEventLoop(): void {
    if (this.eventLoopRunning) return
    this.eventLoopRunning = true

    ;(async () => {
      while (this.eventLoopRunning && this.eventSocket) {
        try {
          const [msg] = await this.eventSocket.receive()
          const data = decode(msg) as EngineEvent
          data.event = data.event ?? ''
          const classified = { ...data, _type: classifyEvent(data.event) }
          this.emit('event', classified)
        } catch (err) {
          if (this.eventLoopRunning) {
            log.error('[ConnectionManager] Event receive error:', err)
          }
        }
      }
    })()
  }

  private startHeartbeatLoop(): void {
    if (this.heartbeatLoopRunning) return
    this.heartbeatLoopRunning = true

    ;(async () => {
      while (this.heartbeatLoopRunning && this.heartbeatSocket) {
        try {
          const [msg] = await this.heartbeatSocket.receive()
          const moduleIds = decode(msg) as string[]
          for (const id of moduleIds) {
            this.moduleHealth.set(id, (this.moduleHealth.get(id) ?? 0) + 1)
          }
          this.emit('heartbeat', moduleIds)
        } catch (err) {
          if (this.heartbeatLoopRunning) {
            log.error('[ConnectionManager] Heartbeat receive error:', err)
          }
        }
      }
    })()
  }

  onEvent(callback: (data: EngineEvent & { _type: string }) => void): void {
    this.on('event', callback)
  }

  onHeartbeat(callback: (moduleIds: string[]) => void): void {
    this.on('heartbeat', callback)
  }

  onStateChange(callback: (state: ConnectionState) => void): void {
    this.on('state-change', callback)
  }
}
