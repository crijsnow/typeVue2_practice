import request from '@/utils/request.js'
export const get_arm = (data) => {
  return request({
    url: '/pole/info/list',
    params: data
  })
}
export const add = (data) => {
  return request({
    url: '/pole/info',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}
export const edit = (data) => {
  return request({
    url: '/pole/info',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}
export const del = (ids) => {
  return request({
    url: `/pole/info/${ids}`,
    method: 'DELETE'
  })
}
export const get_area_list = () => {
  return request({
    url: '/parking/area/list'
  })
}
