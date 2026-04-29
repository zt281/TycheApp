import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'dockview-vue/dist/styles/dockview.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
