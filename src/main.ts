import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Layui from '@layui/layui-vue'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import '@layui/layui-vue/lib/index.css'
//阻止'touchstart'事件，让页面更加流畅
import 'default-passive-events'
// 导入自定义 axios 全局 default 默认配置
import './api/axiosBaseConfig'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(Layui)

app.mount('#app')
