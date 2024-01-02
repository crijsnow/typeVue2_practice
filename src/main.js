import Vue from 'vue'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
import '@/registerMicroApp'

import App from './App'

import store from './store'

import router from './router'
import '@/directives/index.js'
// 注册svg
import '@/icons'
import plugin from './components'
Vue.use(ElementUI)
Vue.use(plugin)
Vue.config.productionTip = false

// vue实例化
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
