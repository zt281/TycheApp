<template>
  <div class="mm-panel">
    <div class="header">
      <h3>Market Making</h3>
      <label class="toggle">
        <input v-model="enabled" type="checkbox" />
        <span class="switch" />
      </label>
    </div>

    <div class="symbol-bar">
      <span v-for="s in symbols" :key="s" :class="['sym-tag', { active: activeSymbol === s }]" @click="activeSymbol = s">
        {{ s }}
      </span>
    </div>

    <div class="book">
      <div class="asks">
        <div v-for="(a, i) in asks" :key="`a${i}`" class="level" :style="{ background: `rgba(198, 40, 40, ${a.size / 500})` }">
          <span class="px">{{ a.price.toFixed(2) }}</span>
          <span class="sz">{{ a.size }}</span>
          <div class="bar" :style="{ width: (a.size / 5) + 'px' }" />
        </div>
      </div>
      <div class="spread">
        <span class="mid">{{ midPrice.toFixed(2) }}</span>
        <span class="spr">{{ spread.toFixed(2) }}</span>
      </div>
      <div class="bids">
        <div v-for="(b, i) in bids" :key="`b${i}`" class="level" :style="{ background: `rgba(46, 125, 50, ${b.size / 500})` }">
          <span class="px">{{ b.price.toFixed(2) }}</span>
          <span class="sz">{{ b.size }}</span>
          <div class="bar" :style="{ width: (b.size / 5) + 'px' }" />
        </div>
      </div>
    </div>

    <div class="strategy">
      <div class="param">
        <label>Spread (bps)</label>
        <input v-model.number="spreadBps" type="number" />
      </div>
      <div class="param">
        <label>Max Pos</label>
        <input v-model.number="maxPos" type="number" />
      </div>
      <div class="param">
        <label>Qty</label>
        <input v-model.number="quoteQty" type="number" />
      </div>
    </div>

    <div class="quotes">
      <div class="quote-row bid">
        <span>BID</span>
        <span class="px">{{ bidQuote.toFixed(2) }}</span>
        <span class="sz">{{ quoteQty }}</span>
        <span :class="['status', bidActive ? 'live' : 'off']">{{ bidActive ? 'LIVE' : 'OFF' }}</span>
      </div>
      <div class="quote-row ask">
        <span>ASK</span>
        <span class="px">{{ askQuote.toFixed(2) }}</span>
        <span class="sz">{{ quoteQty }}</span>
        <span :class="['status', askActive ? 'live' : 'off']">{{ askActive ? 'LIVE' : 'OFF' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePanelState } from '../../composables/usePanelState'

const props = defineProps<{ params: any }>()

const symbols = ['SPY', 'QQQ', 'IWM']

const state = usePanelState(props.params?.api, {
  enabled: false,
  activeSymbol: 'SPY',
  spreadBps: 2,
  maxPos: 1000,
  quoteQty: 100,
})

const enabled = computed({
  get: () => state.enabled as boolean,
  set: (v) => { state.enabled = v },
})
const activeSymbol = computed({
  get: () => state.activeSymbol as string,
  set: (v) => { state.activeSymbol = v },
})
const spreadBps = computed({
  get: () => state.spreadBps as number,
  set: (v) => { state.spreadBps = v },
})
const maxPos = computed({
  get: () => state.maxPos as number,
  set: (v) => { state.maxPos = v },
})
const quoteQty = computed({
  get: () => state.quoteQty as number,
  set: (v) => { state.quoteQty = v },
})

const midPrice = ref(450.25)
const spread = ref(0.09)

const asks = ref([
  { price: 450.29, size: 120 },
  { price: 450.31, size: 250 },
  { price: 450.33, size: 80 },
  { price: 450.35, size: 400 },
  { price: 450.37, size: 150 },
])

const bids = ref([
  { price: 450.23, size: 200 },
  { price: 450.21, size: 350 },
  { price: 450.19, size: 100 },
  { price: 450.17, size: 500 },
  { price: 450.15, size: 220 },
])

const bidQuote = computed(() => midPrice.value - (midPrice.value * spreadBps.value / 10000))
const askQuote = computed(() => midPrice.value + (midPrice.value * spreadBps.value / 10000))
const bidActive = computed(() => enabled.value)
const askActive = computed(() => enabled.value)
</script>

<style scoped>
.mm-panel {
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
.toggle input { display: none; }
.switch {
  display: inline-block;
  width: 32px;
  height: 16px;
  background: #444;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
}
.switch::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: left 0.2s;
}
.toggle input:checked + .switch { background: #2e7d32; }
.toggle input:checked + .switch::after { left: 18px; }

.symbol-bar {
  display: flex;
  gap: 4px;
  padding: 6px 12px;
  border-bottom: 1px solid #333;
}
.sym-tag {
  padding: 2px 10px;
  border-radius: 3px;
  background: #1e1e1e;
  border: 1px solid #444;
  font-size: 11px;
  cursor: pointer;
}
.sym-tag.active { background: #333; border-color: #666; color: #fff; }

.book {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.asks, .bids {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.asks { justify-content: flex-end; }
.level {
  display: grid;
  grid-template-columns: 55px 45px 1fr;
  gap: 6px;
  padding: 2px 12px;
  align-items: center;
  font-family: monospace;
  font-size: 11px;
  position: relative;
}
.level .px { font-weight: 600; }
.asks .px { color: #ef9a9a; }
.bids .px { color: #81c784; }
.level .sz { color: #aaa; }
.bar {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0.15;
}

.spread {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 12px;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
  background: #1a1a1a;
}
.mid { font-family: monospace; font-size: 14px; font-weight: 700; }
.spr { font-size: 10px; color: #888; }

.strategy {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #333;
}
.param {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.param label { font-size: 10px; color: #888; }
.param input {
  background: #1e1e1e;
  border: 1px solid #444;
  color: #e0e0e0;
  padding: 4px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-family: monospace;
}

.quotes {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
}
.quote-row {
  display: grid;
  grid-template-columns: 35px 55px 45px 1fr;
  gap: 6px;
  align-items: center;
  padding: 5px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-family: monospace;
}
.quote-row.bid { background: rgba(46, 125, 50, 0.1); border: 1px solid rgba(46, 125, 50, 0.3); }
.quote-row.ask { background: rgba(198, 40, 40, 0.1); border: 1px solid rgba(198, 40, 40, 0.3); }
.quote-row .px { font-weight: 700; font-size: 12px; }
.status {
  text-align: right;
  font-size: 10px;
  font-weight: 600;
}
.status.live { color: #81c784; }
.status.off { color: #666; }
</style>
