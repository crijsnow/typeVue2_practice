import request from '@/utils/request.js'
export const get_list = () => {
  return request({
    url: '/parking/rule/list'
  })
}
export const get_detail = (id) => {
  return request({
    url: `/parking/rule/${id}`
  })
}
export const up_new = (data) => {
  return request({
    url: '/parking/rule',
    method: 'POST',
    data
  })
}
export const put_update = (data) => {
  return request({
    url: '/parking/rule',
    method: 'PUT',
    data
  })
}
export const del_x = (id) => {
  return request({
    url: `/parking/rule/${id}`,
    method: 'DELETE'
  })
}
