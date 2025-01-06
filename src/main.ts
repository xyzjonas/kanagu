import { createApp } from 'vue'

import { Quasar, Notify } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'

import 'virtual:uno.css'

const app = createApp(App)

app.use(Quasar, {
  plugins: {
    Notify
  }, // import Quasar plugins and add here
})

app.use(router)

app.mount('#app')
