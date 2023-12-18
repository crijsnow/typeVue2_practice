import { routes } from '@/router/index'
export default {
  namespaced: true,
  state: () => {
    return {
      menulist: [...routes],
      flag: false
    }
  },
  mutations: {
    setS(state, async) {
      state.menulist = [...state.menulist, ...async]
    },
    reset(state) {
      state.menulist = [...routes]
    }
  }
}
