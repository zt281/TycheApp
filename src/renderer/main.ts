import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'dockview-vue/dist/styles/dockview.css'

// Global register panel components for dockview lookup
import ConnectionPanel from './components/panels/ConnectionPanel.vue'
import EventPanel from './components/panels/EventPanel.vue'
import ModulePanel from './components/panels/ModulePanel.vue'
import OrderPanel from './components/panels/OrderPanel.vue'
import GreeksPanel from './components/panels/GreeksPanel.vue'
import VolCurvePanel from './components/panels/VolCurvePanel.vue'
import MarketMakingPanel from './components/panels/MarketMakingPanel.vue'

const app = createApp(App)
app.use(createPinia())

app.component('connection', ConnectionPanel)
app.component('events', EventPanel)
app.component('modules', ModulePanel)
app.component('order', OrderPanel)
app.component('greeks', GreeksPanel)
app.component('volcurve', VolCurvePanel)
app.component('mm', MarketMakingPanel)

app.mount('#app')
