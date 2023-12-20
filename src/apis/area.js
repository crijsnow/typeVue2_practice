import request from '@/utils/request.js'
export const get_list = (params) => {
  return request({
    url: '/parking/area/list',
    params
  })
}
export const add_new = (data) => {
  return request({
    url: '/parking/area',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}
export const del = (id) => {
  return request({
    url: `/parking/area/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export const edit = (data) => {
  return request({
    url: '/parking/area',
    method: 'PUT',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const drop = () => {
  return request({
    url: 'parking/rule/dropList',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
