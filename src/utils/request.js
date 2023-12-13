import axios from 'axios'
import { getToken } from './auth'
import { Message } from 'element-ui'
import store from '@/store/index.js'

const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/tj',
  timeout: 5000 // request timeout
})
// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    Message.error(error.response.data.msg)
    if (error.response.status === 401) {
      store.commit('user/remove')
    }
    return Promise.reject(error)
  }
)

export default service
