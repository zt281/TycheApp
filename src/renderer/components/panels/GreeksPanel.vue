<template>
  <div class="greeks-panel">
    <div class="header">
      <h3>Portfolio Greeks</h3>
      <span class="pl">P&L --</span>
    </div>

    <div class="summary">
      <div class="greek-box">
        <label>Delta</label>
        <span :class="greeksStore.totalDelta > 0 ? 'up' : 'down'">{{ greeksStore.totalDelta.toFixed(2) }}</span>
      </div>
      <div class="greek-box">
        <label>Gamma</label>
        <span>{{ greeksStore.totalGamma.toFixed(3) }}</span>
      </div>
      <div class="greek-box">
        <label>Theta</label>
        <span :class="greeksStore.totalTheta > 0 ? 'up' : 'down'">{{ greeksStore.totalTheta.toFixed(2) }}</span>
      </div>
      <div class="greek-box">
        <label>Vega</label>
        <span>{{ greeksStore.totalVega.toFixed(2) }}</span>
      </div>
    </div>

    <div class="table-header">
      <span>Symbol</span>
      <span>Type</span>
      <span>Delta</span>
      <span>Gamma</span>
      <span>Theta</span>
      <span>Vega</span>
      <span>IV</span>
    </div>

    <div class="list">
      <div v-for="row in greeksStore.positions" :key="row.instrument_id" class="row">
        <span class="sym">{{ row.instrument_id }}</span>
        <span class="pos">{{ row.is_call ? 'C' : 'P' }}</span>
        <span :class="row.delta > 0 ? 'up' : 'down'">{{ row.delta.toFixed(2) }}</span>
        <span>{{ row.gamma.toFixed(3) }}</span>
        <span :class="row.theta > 0 ? 'up' : 'down'">{{ row.theta.toFixed(2) }}</span>
        <span>{{ row.vega.toFixed(2) }}</span>
        <span class="iv">{{ (row.implied_vol * 100).toFixed(1) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGreeksStore } from '../../store/greeks'

const greeksStore = useGreeksStore()
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
