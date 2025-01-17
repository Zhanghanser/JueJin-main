import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import 'normalize.css/normalize.css'
import '@/assets/base.less'
//引入Elmessage和Elloading的css样式文件
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/icon/iconfont.js'
import globalComponent from '@/components'

import _ from 'lodash'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
moment.locale('zh-cn')

document.title = import.meta.env.VITE_APP_TITLE
const app = createApp(App)
app.config.globalProperties.$debounce = _.debounce
app.config.globalProperties.$throttle = _.throttle
app.config.globalProperties.$moment = moment

app.use(createPinia()).use(router).use(globalComponent).mount('#app')

//import 'element-plus/theme-chalk/el-loading.css'
//import 'element-plus/them-chalk/el-message.css'
//import 'element-plus/theme-chalk/dark/css-vars.css'
//import '@/assets/icon/iconfont.js'
//import globalComponent from '@/components'

//import _ from 'lodash'
//import moment from 'moment'
//import 'moment/dist/locale/zh-cn'
//moment.locale('zh-cn')

//document.title = import.meta.env.VITE_APP_TITLE
//const app = createApp(App)
//app.config.globalPropertires.$debounce = _.debounce
//app.config.globalProperties.$throttle = _.throttle
//app.config.globalProperties.$moment = monment

//app.use(createPinia()).use(router).use(globalComponent).mount('#app')
