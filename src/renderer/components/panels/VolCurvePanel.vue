<template>
  <div class="vol-panel">
    <div class="header">
      <h3>Volatility Surface</h3>
      <select v-model="selectedSymbol" class="symbol-select">
        <option v-for="s in symbols" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <div class="chart-area">
      <svg viewBox="0 0 400 200" class="vol-chart">
        <!-- Grid -->
        <line x1="40" y1="10" x2="40" y2="170" stroke="#333" stroke-width="1" />
        <line x1="40" y1="170" x2="390" y2="170" stroke="#333" stroke-width="1" />

        <!-- Y labels -->
        <text v-for="(y, i) in yLabels" :key="i" x="35" :y="y.pos" text-anchor="end" fill="#666" font-size="9">{{ y.label }}</text>

        <!-- X labels -->
        <text v-for="(x, i) in xLabels" :key="`x${i}`" :x="x.pos" y="185" text-anchor="middle" fill="#666" font-size="9">{{ x.label }}</text>

        <!-- ATM line -->
        <line :x1="atmX" y1="10" :x2="atmX" y2="170" stroke="#555" stroke-width="1" stroke-dasharray="4,4" />

        <!-- Vol curve line -->
        <polyline :points="curvePoints" fill="none" stroke="#4fc3f7" stroke-width="2" />

        <!-- Data points -->
        <circle v-for="(p, i) in points" :key="i" :cx="p.x" :cy="p.y" r="3" fill="#4fc3f7" />

        <!-- Skew label -->
        <text x="200" y="25" text-anchor="middle" fill="#aaa" font-size="10">
          Skew: {{ skew.toFixed(2) }} | ATM IV: {{ atmIV.toFixed(1) }}%
        </text>
      </svg>
    </div>

    <div class="tenors">
      <div v-for="t in tenorData" :key="t.tenor" class="tenor-row">
        <span class="label">{{ t.tenor }}</span>
        <div class="bar-track">
          <div class="bar" :style="{ width: t.iv * 2 + '%', background: t.color }" />
        </div>
        <span class="val">{{ (t.iv * 100).toFixed(1) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePanelState } from '../../composables/usePanelState'

const props = defineProps<{ params: any }>()

const symbols = ['SPY', 'QQQ', 'AAPL', 'TSLA', 'NVDA']

const state = usePanelState(props.params?.api, {
  selectedSymbol: 'SPY',
})

const selectedSymbol = computed({
  get: () => state.selectedSymbol as string,
  set: (v) => { state.selectedSymbol = v },
})

const points = ref([
  { strike: 420, iv: 0.22, x: 60, y: 140 },
  { strike: 430, iv: 0.20, x: 100, y: 120 },
  { strike: 440, iv: 0.185, x: 140, y: 100 },
  { strike: 450, iv: 0.175, x: 200, y: 85 },
  { strike: 460, iv: 0.18, x: 260, y: 92 },
  { strike: 470, iv: 0.195, x: 300, y: 108 },
  { strike: 480, iv: 0.215, x: 340, y: 130 },
])

const atmX = 200
const atmIV = 0.175
const skew = -0.35

const curvePoints = computed(() =>
  points.value.map(p => `${p.x},${p.y}`).join(' ')
)

const yLabels = [
  { label: '25%', pos: 15 },
  { label: '20%', pos: 55 },
  { label: '15%', pos: 95 },
  { label: '10%', pos: 135 },
]

const xLabels = [
  { label: '420', pos: 60 },
  { label: '440', pos: 140 },
  { label: '450', pos: 200 },
  { label: '460', pos: 260 },
  { label: '480', pos: 340 },
]

const tenorData = [
  { tenor: '7D', iv: 0.165, color: '#81c784' },
  { tenor: '14D', iv: 0.172, color: '#aed581' },
  { tenor: '30D', iv: 0.175, color: '#4fc3f7' },
  { tenor: '60D', iv: 0.182, color: '#ff8a65' },
  { tenor: '90D', iv: 0.195, color: '#ce93d8' },
]
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
</style>
