import { loginAPI } from '@/apis/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: () => {
    return {
      token: getToken() || ''
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    remove(state) {
      removeToken()
      state.token = ''
    }
  },
  actions: {
    async doLogin(ctx, { username, password }) {
      // 1. 调用接口
      const res = await loginAPI({ username, password })
      // 2. 提交mutation
      ctx.commit('setToken', res.data.token)
    }
  }
}
