import request from '@/utils/request.js'
export const get_data = () => {
  return request({
    url: '/home/workbench/info'
  })
}
export const bill = (params) => {
  return request({
    url: '/home/workbench/rentInfo',
    params
  })
}
export const outrent = (id) => {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'PUT'
  })
}
export const upload = (data) => {
  return request({
    url: '/upload',
    method: 'POST',
    data
  })
}
export const xuzu = (data) => {
  return request({
    url: '/park/enterprise/rent',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
