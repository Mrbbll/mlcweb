import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/site.css'
import './ripple'

createApp(App).use(router).mount('#app')
