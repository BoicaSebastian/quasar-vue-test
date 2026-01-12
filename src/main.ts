import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import router from './router'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/dist/quasar.css'

import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(Quasar, {
  plugins: {},
})
app.use(pinia)
app.use(router)
app.mount('#app')
