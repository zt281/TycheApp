<template>
  <div class="vol-panel">
    <div class="header">
      <h3>Volatility Surface</h3>
      <select v-model="selectedSymbol" class="symbol-select">
        <option v-for="s in greeksStore.underlyings" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <div class="chart-area">
      <template v-if="curveData.length > 0">
        <svg viewBox="0 0 400 200" class="vol-chart">
          <!-- Grid -->
          <line x1="40" y1="10" x2="40" y2="170" stroke="#333" stroke-width="1" />
          <line x1="40" y1="170" x2="390" y2="170" stroke="#333" stroke-width="1" />

          <!-- Y labels -->
          <text v-for="(y, i) in yLabels" :key="i" x="35" :y="y.pos" text-anchor="end" fill="#666" font-size="9">{{ y.label }}</text>

          <!-- X labels -->
          <text v-for="(x, i) in xLabels" :key="`x${i}`" :x="x.pos" y="185" text-anchor="middle" fill="#666" font-size="9">{{ x.label }}</text>

          <!-- ATM line -->
          <line v-if="atmX !== null" :x1="atmX" y1="10" :x2="atmX" y2="170" stroke="#555" stroke-width="1" stroke-dasharray="4,4" />

          <!-- Vol curve line -->
          <polyline :points="curvePoints" fill="none" stroke="#4fc3f7" stroke-width="2" />

          <!-- Data points -->
          <circle v-for="(p, i) in chartPoints" :key="i" :cx="p.x" :cy="p.y" r="3" fill="#4fc3f7" />

          <!-- Skew label -->
          <text x="200" y="25" text-anchor="middle" fill="#aaa" font-size="10">
            Skew: {{ skew.toFixed(2) }} | ATM IV: {{ (atmIV * 100).toFixed(1) }}%
          </text>
        </svg>
      </template>
      <template v-else>
        <div class="empty-state">Waiting for data...</div>
      </template>
    </div>

    <div class="tenors">
      <template v-if="ivDistribution.length > 0">
        <div v-if="callContracts.length > 0" class="group-label">Call</div>
        <div v-for="c in callContracts" :key="c.instrument_id" class="tenor-row">
          <span class="label">{{ shortId(c.instrument_id) }}</span>
          <div class="bar-track">
            <div class="bar" :style="{ width: (c.implied_vol * 200) + '%', background: '#4fc3f7' }" />
          </div>
          <span class="val">{{ (c.implied_vol * 100).toFixed(1) }}%</span>
        </div>
        <div v-if="putContracts.length > 0" class="group-label">Put</div>
        <div v-for="c in putContracts" :key="c.instrument_id" class="tenor-row">
          <span class="label">{{ shortId(c.instrument_id) }}</span>
          <div class="bar-track">
            <div class="bar" :style="{ width: (c.implied_vol * 200) + '%', background: '#ce93d8' }" />
          </div>
          <span class="val">{{ (c.implied_vol * 100).toFixed(1) }}%</span>
        </div>
      </template>
      <template v-else>
        <div class="empty-state">No contracts available</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { usePanelState } from '../../composables/usePanelState'
import { useGreeksStore } from '../../store/greeks'

const props = defineProps<{ params: any }>()

const greeksStore = useGreeksStore()

const state = usePanelState(props.params?.api, {
  selectedSymbol: '',
})

const selectedSymbol = computed({
  get: () => state.selectedSymbol as string,
  set: (v) => { state.selectedSymbol = v },
})

// Auto-select first underlying when list changes or current selection becomes invalid
watch(
  () => greeksStore.underlyings,
  (list) => {
    if (list.length > 0 && !list.includes(selectedSymbol.value)) {
      selectedSymbol.value = list[0]
    }
  },
  { immediate: true }
)

// Current underlying's curve data (sorted by strike)
const curveData = computed(() => {
  if (!selectedSymbol.value) return []
  return greeksStore.volCurveData[selectedSymbol.value] || []
})

// Chart constants
const chartLeft = 40
const chartRight = 390
const chartTop = 10
const chartBottom = 170

function mapX(strike: number, minStrike: number, maxStrike: number): number {
  if (maxStrike === minStrike) return (chartLeft + chartRight) / 2
  return chartLeft + (strike - minStrike) / (maxStrike - minStrike) * (chartRight - chartLeft)
}

function mapY(iv: number, minIV: number, maxIV: number): number {
  if (maxIV === minIV) return (chartTop + chartBottom) / 2
  return chartBottom - (iv - minIV) / (maxIV - minIV) * (chartBottom - chartTop)
}

// Strike range
const strikeRange = computed(() => {
  if (curveData.value.length === 0) return { min: 0, max: 0 }
  const strikes = curveData.value.map(d => d.strike)
  return { min: Math.min(...strikes), max: Math.max(...strikes) }
})

// IV range
const ivRange = computed(() => {
  if (curveData.value.length === 0) return { min: 0, max: 0 }
  const ivs = curveData.value.map(d => d.implied_vol)
  const min = Math.min(...ivs)
  const max = Math.max(...ivs)
  // Add small padding
  const pad = (max - min) * 0.1 || 0.01
  return { min: Math.max(0, min - pad), max: max + pad }
})

// Chart points mapped to SVG coordinates
const chartPoints = computed(() => {
  const { min: minS, max: maxS } = strikeRange.value
  const { min: minIV, max: maxIV } = ivRange.value
  return curveData.value.map(d => ({
    x: mapX(d.strike, minS, maxS),
    y: mapY(d.implied_vol, minIV, maxIV),
  }))
})

// Polyline points string
const curvePoints = computed(() =>
  chartPoints.value.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
)

// ATM line X position
const atmX = computed(() => {
  if (curveData.value.length === 0) return null
  const price = curveData.value[0].underlying_price
  const { min: minS, max: maxS } = strikeRange.value
  if (price < minS || price > maxS) return null
  return mapX(price, minS, maxS)
})

// ATM IV: IV of the strike closest to underlying_price
const atmIV = computed(() => {
  if (curveData.value.length === 0) return 0
  const price = curveData.value[0].underlying_price
  let closest = curveData.value[0]
  let minDist = Math.abs(closest.strike - price)
  for (const d of curveData.value) {
    const dist = Math.abs(d.strike - price)
    if (dist < minDist) {
      minDist = dist
      closest = d
    }
  }
  return closest.implied_vol
})

// Skew: lowest strike IV - highest strike IV
const skew = computed(() => {
  if (curveData.value.length < 2) return 0
  const first = curveData.value[0].implied_vol
  const last = curveData.value[curveData.value.length - 1].implied_vol
  return first - last
})

// Y axis labels (4-5 evenly spaced)
const yLabels = computed(() => {
  const { min: minIV, max: maxIV } = ivRange.value
  if (maxIV === minIV) return []
  const steps = 4
  const labels: { label: string; pos: number }[] = []
  for (let i = 0; i <= steps; i++) {
    const iv = minIV + (maxIV - minIV) * (i / steps)
    const pos = mapY(iv, minIV, maxIV)
    labels.push({ label: (iv * 100).toFixed(0) + '%', pos })
  }
  return labels
})

// X axis labels (up to 5 evenly spaced strikes)
const xLabels = computed(() => {
  const { min: minS, max: maxS } = strikeRange.value
  if (maxS === minS) return []
  const steps = Math.min(4, curveData.value.length - 1)
  if (steps <= 0) return []
  const labels: { label: string; pos: number }[] = []
  for (let i = 0; i <= steps; i++) {
    const strike = minS + (maxS - minS) * (i / steps)
    const pos = mapX(strike, minS, maxS)
    labels.push({ label: strike.toFixed(0), pos })
  }
  return labels
})

// Bottom section: IV distribution per contract
const ivDistribution = computed(() => curveData.value)

const callContracts = computed(() =>
  curveData.value.filter(d => d.is_call).sort((a, b) => a.strike - b.strike)
)

const putContracts = computed(() =>
  curveData.value.filter(d => !d.is_call).sort((a, b) => a.strike - b.strike)
)

// Shorten instrument_id for display
function shortId(id: string): string {
  // Take last segment or truncate
  const parts = id.split(/[-_.]/)
  return parts.length > 2 ? parts.slice(-2).join('-') : id.slice(-8)
}
</script>

<style scoped>
.vol-panel {
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
.symbol-select {
  background: #1e1e1e;
  border: 1px solid #444;
  color: #e0e0e0;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 11px;
}

.chart-area {
  padding: 8px 12px;
  border-bottom: 1px solid #333;
}
.vol-chart {
  width: 100%;
  height: 200px;
}

.tenors {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tenor-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}
.label {
  width: 35px;
  color: #888;
  font-family: monospace;
}
.bar-track {
  flex: 1;
  height: 14px;
  background: #1a1a1a;
  border-radius: 3px;
  overflow: hidden;
}
.bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}
.val {
  width: 45px;
  text-align: right;
  font-family: monospace;
  font-size: 11px;
}
.group-label {
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
}
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #666;
  font-size: 12px;
}
</style>
