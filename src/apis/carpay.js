import request from '@/utils/request.js'
export const get_list = (params) => {
  return request({
    url: '/parking/payment/list',
    params
  })
}

