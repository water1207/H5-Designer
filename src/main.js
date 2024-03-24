import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'
import router from './router'
import '@/assets/main.css'
import 'ant-design-vue/dist/reset.css';
import * as antIcon from '@ant-design/icons-vue'

const app = createApp(App)

app.use(Antd)
app.use(router)
app.mount('#app')

Object.keys(antIcon).forEach(key => {
    app.component(key, antIcon[key])
    })

app.config.globalProperties.$antIcon = antIcon