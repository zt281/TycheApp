<template>
  <div class="order-panel">
    <div class="header">
      <h3>Quick Order</h3>
      <span class="latency">{{ latency }}ms</span>
    </div>

    <div class="symbol-row">
      <input v-model="symbol" class="symbol-input" placeholder="Symbol (e.g. SPY)" />
      <span class="price" :class="priceClass">{{ lastPrice.toFixed(2) }}</span>
    </div>

    <div class="side-toggle">
      <button :class="{ active: side === 'BUY' }" @click="side = 'BUY'">BUY</button>
      <button :class="{ active: side === 'SELL' }" @click="side = 'SELL'">SELL</button>
    </div>

    <div class="field">
      <label>Qty</label>
      <input v-model.number="qty" type="number" min="1" />
    </div>

    <div class="field">
      <label>Price</label>
      <input v-model.number="price" type="number" step="0.01" />
    </div>

    <div class="field">
      <label>Type</label>
      <select v-model="orderType">
        <option value="LIMIT">LIMIT</option>
        <option value="MARKET">MARKET</option>
        <option value="STOP">STOP</option>
      </select>
    </div>

    <div class="tif-row">
      <button
        v-for="t in tifs"
        :key="t"
        :class="{ active: tif === t }"
        @click="tif = t"
      >
        {{ t }}
      </button>
    </div>

    <button
      class="submit"
      :class="side.toLowerCase()"
      :disabled="!canSubmit"
      @click="submit"
    >
      {{ side }} {{ qty }} @ {{ orderType === 'MARKET' ? 'MKT' : price }}
    </button>

    <div class="recent">
      <div v-for="(o, i) in recentOrders" :key="i" class="order-row" :class="o.status">
        <span class="sym">{{ o.symbol }}</span>
        <span class="side" :class="o.side.toLowerCase()">{{ o.side }}</span>
        <span class="qty">{{ o.qty }}</span>
        <span class="px">{{ o.price }}</span>
        <span class="status">{{ o.status }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue'
import { usePanelState } from '../../composables/usePanelState'

const props = defineProps<{ params: any }>()

const state = usePanelState(props.params?.api, {
  symbol: '',
  side: 'BUY',
  qty: 100,
  price: 0,
  orderType: 'LIMIT',
  tif: 'DAY',
})

const { symbol, side, qty, price, orderType, tif } = toRefs(state)
const tifs = ['DAY', 'GTC', 'IOC', 'FOK']
const lastPrice = ref(450.25)
const latency = ref(12)

const priceClass = computed(() => {
  const delta = Math.random() - 0.5
  return delta > 0.1 ? 'up' : delta < -0.1 ? 'down' : ''
})

const canSubmit = computed(() => symbol.value && qty.value > 0)

interface Order {
  symbol: string
  side: string
  qty: number
  price: number
  status: 'PENDING' | 'FILLED' | 'REJECTED'
}

const recentOrders = ref<Order[]>([
  { symbol: 'SPY', side: 'BUY', qty: 100, price: 450.12, status: 'FILLED' },
  { symbol: 'AAPL', side: 'SELL', qty: 50, price: 185.30, status: 'FILLED' },
  { symbol: 'TSLA', side: 'BUY', qty: 25, price: 242.50, status: 'REJECTED' },
])

function submit() {
  recentOrders.value.unshift({
    symbol: symbol.value.toUpperCase(),
    side: side.value,
    qty: qty.value,
    price: orderType.value === 'MARKET' ? lastPrice.value : price.value,
    status: 'PENDING',
  })
  if (recentOrders.value.length > 10) recentOrders.value.pop()
}
</script>

<style scoped>
.order-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #e0e0e0;
  font-family: system-ui, sans-serif;
  font-size: 12px;
  padding: 10px;
  gap: 8px;
  overflow: auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
h3 { margin: 0; font-size: 13px; }
.latency {
  font-size: 11px;
  color: #81c784;
  font-family: monospace;
}
.symbol-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.symbol-input {
  flex: 1;
  background: #1e1e1e;
  border: 1px solid #444;
  color: #e0e0e0;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}
.price {
  font-family: monospace;
  font-size: 16px;
  font-weight: 700;
  min-width: 70px;
  text-align: right;
}
.price.up { color: #81c784; }
.price.down { color: #ef9a9a; }

.side-toggle {
  display: flex;
  gap: 0;
}
.side-toggle button {
  flex: 1;
  padding: 8px;
  border: 1px solid #444;
  background: #1e1e1e;
  color: #aaa;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}
.side-toggle button:first-child { border-radius: 4px 0 0 4px; }
.side-toggle button:last-child { border-radius: 0 4px 4px 0; }
.side-toggle button.active:first-child { background: #2e7d32; color: #fff; border-color: #2e7d32; }
.side-toggle button.active:last-child { background: #c62828; color: #fff; border-color: #c62828; }

.field {
  display: flex;
  align-items: center;
  gap: 8px;
}
.field label {
  width: 45px;
  color: #888;
  font-size: 11px;
}
.field input, .field select {
  flex: 1;
  background: #1e1e1e;
  border: 1px solid #444;
  color: #e0e0e0;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.tif-row {
  display: flex;
  gap: 4px;
}
.tif-row button {
  flex: 1;
  padding: 4px;
  border: 1px solid #444;
  background: #1e1e1e;
  color: #aaa;
  border-radius: 3px;
  cursor: pointer;
  font-size: 10px;
}
.tif-row button.active { background: #333; color: #fff; border-color: #555; }

.submit {
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
}
.submit.buy { background: #2e7d32; color: #fff; }
.submit.sell { background: #c62828; color: #fff; }
.submit:disabled { opacity: 0.3; cursor: not-allowed; }

.recent {
  margin-top: 8px;
  border-top: 1px solid #333;
  padding-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.order-row {
  display: grid;
  grid-template-columns: 50px 35px 35px 55px 1fr;
  gap: 6px;
  align-items: center;
  font-size: 11px;
  padding: 3px 4px;
  border-radius: 3px;
}
.order-row:hover { background: #1a1a1a; }
.sym { font-weight: 600; }
.side.buy { color: #81c784; }
.side.sell { color: #ef9a9a; }
.px { font-family: monospace; color: #aaa; }
.status { text-align: right; font-size: 10px; }
.order-row.filled .status { color: #81c784; }
.order-row.rejected .status { color: #ef9a9a; }
.order-row.pending .status { color: #ffb74d; }
</style>
