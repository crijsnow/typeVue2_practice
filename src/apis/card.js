import request from '@/utils/request.js'
export const card = (params) => {
  return request({
    url: '/parking/card/list',
    params
  })
}
export const add_card = (data) => {
  return request({
    url: '/parking/card',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}
export const get_card = (id) => {
  return request({
    url: `/parking/card/${id}`
  })
}
export const update = (data) => {
  return request({
    url: '/parking/card/edit',
    method: 'PUT',
    data
  })
}
export const del = (id) => {
  return request({
    url: `/parking/card/${id}`,
    method: 'DELETE'
  })
}
export function delAll(ids) {
  return request({
    url: `/parking/card/${ids.join(',')}`,
    method: 'DELETE'
  })
}
