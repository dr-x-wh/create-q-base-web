// vue
import {createApp} from 'vue'
// element-plus
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
// element-plus icons
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// pinia
import {createPinia} from "pinia"
// project
import App from '@/App.vue'
import '@/assets/style/main.css'
import router from '@/router/index.js'

const app = createApp(App)
const pinia = createPinia()

// app plugin
app.use(ElementPlus, {locale: zhCn})
app.use(pinia)
app.use(router)


// component
for (const [key, component] of Object.entries(ElementPlusIconsVue)) app.component(key, component)


app.mount('#app')
