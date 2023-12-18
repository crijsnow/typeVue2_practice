import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import menu from './modules/menu'
import VuexPersistence from 'vuex-persist'
Vue.use(Vuex)

export const vuexpersist = new VuexPersistence({
  key: 'vuex',
  storage: window.localStorage
})

const store = new Vuex.Store({
  // 组合模块的配置项
  modules: {
    user,
    menu
  },
  plugins: [vuexpersist.plugin]
})

export default store
