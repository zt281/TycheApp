<template>
  <div class="greeks-panel">
    <div class="header">
      <h3>Portfolio Greeks</h3>
      <span class="pl" :class="totalPL >= 0 ? 'up' : 'down'">
        P&L {{ totalPL >= 0 ? '+' : '' }}{{ totalPL.toFixed(0) }}
      </span>
    </div>

    <div class="summary">
      <div class="greek-box">
        <label>Delta</label>
        <span :class="totalDelta > 0 ? 'up' : 'down'">{{ totalDelta.toFixed(2) }}</span>
      </div>
      <div class="greek-box">
        <label>Gamma</label>
        <span>{{ totalGamma.toFixed(3) }}</span>
      </div>
      <div class="greek-box">
        <label>Theta</label>
        <span :class="totalTheta > 0 ? 'up' : 'down'">{{ totalTheta.toFixed(2) }}</span>
      </div>
      <div class="greek-box">
        <label>Vega</label>
        <span>{{ totalVega.toFixed(2) }}</span>
      </div>
    </div>

    <div class="table-header">
      <span>Symbol</span>
      <span>Pos</span>
      <span>Delta</span>
      <span>Gamma</span>
      <span>Theta</span>
      <span>Vega</span>
      <span>IV</span>
    </div>

    <div class="list">
      <div v-for="row in positions" :key="row.symbol" class="row">
        <span class="sym">{{ row.symbol }}</span>
        <span class="pos" :class="row.position > 0 ? 'up' : 'down'">{{ row.position > 0 ? '+' : '' }}{{ row.position }}</span>
        <span :class="row.delta > 0 ? 'up' : 'down'">{{ row.delta.toFixed(2) }}</span>
        <span>{{ row.gamma.toFixed(3) }}</span>
        <span :class="row.theta > 0 ? 'up' : 'down'">{{ row.theta.toFixed(2) }}</span>
        <span>{{ row.vega.toFixed(2) }}</span>
        <span class="iv">{{ (row.iv * 100).toFixed(1) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Position {
  symbol: string
  position: number
  delta: number
  gamma: number
  theta: number
  vega: number
  iv: number
}

const positions = ref<Position[]>([
  { symbol: 'SPY 450C 05/16', position: 10, delta: 5.42, gamma: 0.032, theta: -1.25, vega: 3.15, iv: 0.18 },
  { symbol: 'SPY 445P 05/16', position: -5, delta: 2.18, gamma: 0.021, theta: -0.82, vega: 1.90, iv: 0.22 },
  { symbol: 'AAPL 190C 05/23', position: 20, delta: 11.30, gamma: 0.065, theta: -3.40, vega: 6.80, iv: 0.25 },
  { symbol: 'QQQ 380C 06/20', position: 8, delta: 4.56, gamma: 0.018, theta: -0.95, vega: 4.20, iv: 0.19 },
  { symbol: 'TSLA 250P 05/09', position: -15, delta: 7.65, gamma: 0.045, theta: -2.10, vega: 3.50, iv: 0.55 },
])

const totalDelta = computed(() => positions.value.reduce((s, p) => s + p.delta, 0))
const totalGamma = computed(() => positions.value.reduce((s, p) => s + p.gamma, 0))
const totalTheta = computed(() => positions.value.reduce((s, p) => s + p.theta, 0))
const totalVega = computed(() => positions.value.reduce((s, p) => s + p.vega, 0))
const totalPL = computed(() => 2847.50)
</script>

<style scoped>
.greeks-panel {
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
.pl {
  font-family: monospace;
  font-size: 12px;
  font-weight: 600;
}
.pl.up { color: #81c784; }
.pl.down { color: #ef9a9a; }

.summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid #333;
}
.greek-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: #1a1a1a;
  padding: 6px;
  border-radius: 4px;
}
.greek-box label {
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
}
.greek-box span {
  font-family: monospace;
  font-size: 14px;
  font-weight: 700;
}

.table-header {
  display: grid;
  grid-template-columns: 110px 40px 55px 55px 55px 50px 50px;
  gap: 6px;
  padding: 6px 12px;
  border-bottom: 1px solid #333;
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
}

.list {
  flex: 1;
  overflow-y: auto;
}
.row {
  display: grid;
  grid-template-columns: 110px 40px 55px 55px 55px 50px 50px;
  gap: 6px;
  padding: 5px 12px;
  border-bottom: 1px solid #222;
  align-items: center;
  font-family: monospace;
  font-size: 11px;
}
.row:hover { background: #1a1a1a; }
.sym { font-weight: 600; font-family: system-ui; font-size: 11px; }
.pos { font-weight: 600; }
.iv { color: #ce93d8; }
.up { color: #81c784; }
.down { color: #ef9a9a; }
</style>
