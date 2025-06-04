import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'vue3-toastify/dist/index.css'
import Vue3Toastify from 'vue3-toastify'
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.globalProperties.$axios = axios
app.use(Vue3Toastify, { autoClose: 1000 })
app.mount('#app')
