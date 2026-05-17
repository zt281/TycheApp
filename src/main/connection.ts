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
const HEARTBEAT_PORT = 5559
const ADMIN_PORT = 5558
const ADMIN_TIMEOUT_MS = 5000
const ADMIN_POLL_MS = 3000

function classifyEvent(eventName: string): string {
  if (eventName.startsWith('on_common_')) return 'on_common'
  if (eventName.startsWith('on_')) return 'on'
  if (eventName.startsWith('ack_')) return 'ack'
  if (eventName.startsWith('whisper_')) return 'whisper'
  if (eventName.startsWith('broadcast_')) return 'broadcast'
  if (eventName.startsWith('handle_')) return 'handle'
  if (eventName.startsWith('request_')) return 'request'
  return 'unknown'
}

export class ConnectionManager extends EventEmitter {
  private state: ConnectionState = 'DISCONNECTED'
  private eventSocket: Subscriber | null = null
  private heartbeatSocket: Subscriber | null = null
  private adminSocket: Request | null = null
  private eventLoopRunning = false
  private heartbeatLoopRunning = false
  private running = false
  private moduleHealth: Map<string, number> = new Map()
  private adminTimer: ReturnType<typeof setInterval> | null = null
  private failedPolls = 0
  private readonly MAX_FAILED_POLLS = 3

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
    this.running = true

    try {
      this.eventSocket = new Subscriber()
      this.eventSocket.connect(`tcp://${ENGINE_HOST}:${EVENT_PORT}`)
      this.eventSocket.subscribe('')

      this.heartbeatSocket = new Subscriber()
      this.heartbeatSocket.connect(`tcp://${ENGINE_HOST}:${HEARTBEAT_PORT}`)
      this.heartbeatSocket.subscribe('')

      this.createAdminReq()

      // NOTE: ZMQ socket.connect() does NOT verify peer reachability — it just
      // registers the endpoint. We remain in CONNECTING until the first
      // successful STATUS admin query, which acts as the real liveness probe.

      this.startEventLoop()
      this.startHeartbeatLoop()

      // Kick off the first liveness probe immediately
      this.pollAdmin().catch(() => { /* silent */ })

      // Periodic admin polling (same pattern as TUI)
      this.adminTimer = setInterval(() => {
        this.pollAdmin().catch(() => { /* silent */ })
      }, ADMIN_POLL_MS)

    } catch (err) {
      log.error('[ConnectionManager] Connect failed:', err)
      this.setState('DISCONNECTED')
      throw err
    }
  }

  async disconnect(): Promise<void> {
    this.running = false
    this.eventLoopRunning = false
    this.heartbeatLoopRunning = false

    if (this.adminTimer) {
      clearInterval(this.adminTimer)
      this.adminTimer = null
    }

    this.eventSocket?.close()
    this.heartbeatSocket?.close()
    this.adminSocket?.close()

    this.eventSocket = null
    this.heartbeatSocket = null
    this.adminSocket = null

    this.setState('DISCONNECTED')
    log.info('[ConnectionManager] Disconnected')
  }

  async reconnect(): Promise<void> {
    try {
      this.setState('RECONNECTING')
      await this.disconnect()
      await new Promise((r) => setTimeout(r, 1000))
      await this.connect()
    } catch {
      this.setState('DISCONNECTED')
    }
  }

  // ── Admin Socket Management ──────────────────────────────────────

  private createAdminReq(): void {
    this.adminSocket = new Request()
    this.adminSocket.connect(`tcp://${ENGINE_HOST}:${ADMIN_PORT}`)
  }

  /**
   * After a REQ timeout the socket is stuck in WAITING_FOR_REPLY state and
   * any further send() will fail. We must close and recreate it so subsequent
   * admin queries can recover once the engine becomes reachable.
   */
  private async recreateAdminReq(): Promise<void> {
    try {
      await this.adminSocket?.close()
    } catch { /* ignore */ }
    this.adminSocket = null
    if (this.running) this.createAdminReq()
  }

  private async sendAdmin(cmd: string): Promise<Record<string, unknown> | null> {
    if (!this.adminSocket || !this.running) return null
    try {
      await this.adminSocket.send(encode(cmd))
      const [reply] = await Promise.race([
        this.adminSocket.receive(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Admin request timeout')), ADMIN_TIMEOUT_MS)
        ),
      ]) as [Buffer]
      if (!reply) {
        await this.recreateAdminReq()
        return null
      }
      return decode(reply) as Record<string, unknown>
    } catch {
      await this.recreateAdminReq()
      return null
    }
  }

  // ── Periodic Admin Polling ────────────────────────────────────────

  private async pollAdmin(): Promise<void> {
    let pollFailed = false

    const status = await this.queryStatus()
    if (status) {
      // First successful STATUS → we know the engine is alive
      if (this.state !== 'CONNECTED') {
        this.setState('CONNECTED')
        log.info('[ConnectionManager] Connected to TycheEngine')
      }
    } else {
      pollFailed = true
      if (this.state === 'CONNECTED' || this.state === 'CONNECTING') {
        this.setState('DISCONNECTED')
      }
    }

    const mods = await this.queryModules()
    if (mods === null) {
      pollFailed = true
    }

    if (pollFailed) {
      this.failedPolls++
    } else {
      this.failedPolls = 0
    }

    if (this.failedPolls >= this.MAX_FAILED_POLLS) {
      this.failedPolls = 0
      try {
        await this.reconnect()
      } catch {
        // reconnect will set DISCONNECTED on failure
      }
    }
  }

  // ── Public Query Methods ──────────────────────────────────────────

  async queryStatus(): Promise<EngineStatus | null> {
    if (!this.adminSocket || !this.running) return null
    const d = await this.sendAdmin('STATUS')
    if (!d) return null
    return {
      uptime: Number(d.uptime ?? 0),
      module_count: Number(d.module_count ?? 0),
      event_count: Number(d.event_count ?? 0),
    }
  }

  async queryModules(): Promise<ModuleInfo[] | null> {
    if (!this.adminSocket || !this.running) return null
    const d = await this.sendAdmin('MODULES')
    if (!d) return null
    const mods = (d as Record<string, unknown>).modules as Array<Record<string, unknown>> | undefined
    if (!Array.isArray(mods)) return []

    return mods.map((info) => {
      const liveness = Number(info.liveness ?? 0)
      return {
        id: String(info.module_id ?? ''),
        interfaces: Array.isArray(info.interfaces) ? info.interfaces.map(String) : [],
        liveness,
        status: liveness >= 2 ? 'OK' as const : liveness >= 1 ? 'WARN' as const : 'EXPIRED' as const,
      }
    })
  }

  // ── Event & Heartbeat Loops ───────────────────────────────────────

  private startEventLoop(): void {
    if (this.eventLoopRunning) return
    this.eventLoopRunning = true

    ;(async () => {
      while (this.eventLoopRunning && this.eventSocket) {
        try {
          const frames = await this.eventSocket.receive()
          let data: Uint8Array
          if (Array.isArray(frames)) {
            data = frames[1] as Uint8Array
          } else {
            data = frames as Uint8Array
          }
          const evt = decode(data) as EngineEvent
          evt.event = evt.event ?? ''
          const classified = { ...evt, _type: classifyEvent(evt.event) }
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
          const frames = await this.heartbeatSocket.receive()
          let data: Uint8Array
          if (Array.isArray(frames)) {
            data = frames[1] as Uint8Array
          } else {
            data = frames as Uint8Array
          }
          const decoded = decode(data) as Record<string, unknown>
          const sender = String(decoded.sender ?? '')
          if (sender) {
            this.moduleHealth.set(sender, (this.moduleHealth.get(sender) ?? 0) + 1)
            this.emit('heartbeat', [sender])
          }
        } catch (err) {
          if (this.heartbeatLoopRunning) {
            log.error('[ConnectionManager] Heartbeat receive error:', err)
          }
        }
      }
    })()
  }

  // ── Event Registration ────────────────────────────────────────────

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
