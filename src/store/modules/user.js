import { loginAPI, get_user_power } from '@/apis/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: () => {
    return {
      token: getToken() || '',
      profile: {}
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
      state.profile = {}
    },
    setProfile(state, profile) {
      state.profile = profile
    }
  },
  actions: {
    async doLogin(ctx, { username, password }) {
      // 1. 调用接口
      const res = await loginAPI({ username, password })
      // 2. 提交mutation
      ctx.commit('setToken', res.data.token)
      const res_1 = await get_user_power()
      ctx.commit('setProfile', res_1.data)
      console.log(res_1.data)
    }
  }
}
