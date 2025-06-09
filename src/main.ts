import { createApp } from 'vue'

import { Quasar, Notify, LoadingBar, Loading } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'

import 'virtual:uno.css'

import * as Sentry from "@sentry/vue";

const app = createApp(App)


const sentryDsn = import.meta.env.VITE_SENTRY_DSN
const sentryEnv = import.meta.env.VITE_SENTRY_ENV
if (sentryDsn) {
  Sentry.init({
    app,
    dsn: sentryDsn,
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: false,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    tracesSampleRate: 1.0,
    environment: sentryEnv ?? 'dev'
  });
  console.info(`Sentry initialized [${sentryEnv}]: ${sentryDsn}`)
}

app.use(Quasar, {
  plugins: {
    Notify,
    LoadingBar,
    Loading,
  }, // import Quasar plugins and add here
})

app.use(router)

app.mount('#app')
