// 放置全局组件
import Vue from 'vue'
import permBtn from './AuthBtn/index.vue'

const plugin = {
  install() {
    Vue.component('permBtn', permBtn)// 需要参数perms
  }
}
export default plugin
