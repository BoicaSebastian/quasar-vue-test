import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { Quasar } from 'quasar'
import router from './router'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/dist/quasar.css'

// Import Vue3Toastify css
import 'vue3-toastify/dist/index.css'

import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(Quasar, {
  plugins: {},
})
app.use(pinia)
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000,
} as ToastContainerOptions)
app.mount('#app')
