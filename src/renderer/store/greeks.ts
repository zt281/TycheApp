import { defineStore } from 'pinia'
import { shallowRef, triggerRef, computed } from 'vue'
import type { GreeksData } from '../types'

export const useGreeksStore = defineStore('greeks', () => {
  // 按 instrument_id 存储最新 Greeks 数据
  const instruments = shallowRef<Map<string, GreeksData>>(new Map())

  // RAF 批处理缓冲区
  let pendingUpdates: GreeksData[] = []
  let rafScheduled = false

  function flushUpdates() {
    rafScheduled = false
    if (pendingUpdates.length === 0) return
    const map = instruments.value
    for (const data of pendingUpdates) {
      map.set(data.instrument_id, data)
    }
    pendingUpdates = []
    triggerRef(instruments)
  }

  // 处理 greeks_update 事件（批处理模式）
  function processGreeksEvent(payload: Record<string, unknown>) {
    const data = payload as unknown as GreeksData
    if (!data.instrument_id) return
    pendingUpdates.push(data)
    if (!rafScheduled) {
      rafScheduled = true
      requestAnimationFrame(flushUpdates)
    }
  }

  // 所有合约列表（按 instrument_id 排序）
  const positions = computed(() => {
    return Array.from(instruments.value.values())
      .sort((a, b) => a.instrument_id.localeCompare(b.instrument_id))
  })

  // 聚合 Greeks
  const totalDelta = computed(() => positions.value.reduce((s, p) => s + p.delta, 0))
  const totalGamma = computed(() => positions.value.reduce((s, p) => s + p.gamma, 0))
  const totalTheta = computed(() => positions.value.reduce((s, p) => s + p.theta, 0))
  const totalVega = computed(() => positions.value.reduce((s, p) => s + p.vega, 0))

  // 可用 underlying 列表（去重）
  const underlyings = computed(() => {
    const set = new Set<string>()
    for (const d of instruments.value.values()) {
      set.add(d.underlying_id)
    }
    return Array.from(set).sort()
  })

  // 按 underlying_id 分组的 IV 曲线数据（VolCurve 用）
  // 返回 { [underlying_id]: GreeksData[] } 每组按 strike 排序
  const volCurveData = computed(() => {
    const groups: Record<string, GreeksData[]> = {}
    for (const d of instruments.value.values()) {
      if (!groups[d.underlying_id]) {
        groups[d.underlying_id] = []
      }
      groups[d.underlying_id].push(d)
    }
    // 每组按 strike 排序
    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => a.strike - b.strike)
    }
    return groups
  })

  function clear() {
    pendingUpdates = []
    instruments.value = new Map()
  }

  return {
    instruments,
    positions,
    totalDelta,
    totalGamma,
    totalTheta,
    totalVega,
    underlyings,
    volCurveData,
    processGreeksEvent,
    clear
  }
})
