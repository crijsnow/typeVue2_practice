import request from '@/utils/request.js'
export const get_list = (params) => {
  return request({
    url: '/pole/warning/list',
    params
  })
}
export const del_ = (id) => {
  return request({
    url: `/pole/warning/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export const get_detail = (id) => {
  return request({
    url: `/pole/warning/${id}`
  })
}
export const handle1 = (data) => {
  return request({
    url: '/pole/warning/handle',
    method: 'PUT',
    data
  })
}
export const handle2 = (data) => {
  return request({
    url: '/pole/warning/send',
    method: 'PUT',
    data
  })
}
