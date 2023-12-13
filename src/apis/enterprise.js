import request from '@/utils/request.js'

export const getlist = (params) => {
  return request({
    url: '/park/enterprise',
    params
  })
}
export const minilist = () => {
  return request({
    url: '/park/industry'
  })
}
export const upload = (data) => {
  return request({
    url: '/upload',
    method: 'POST',
    data
  })
}
export const add = (data) => {
  return request({
    url: '/park/enterprise',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}
export const getdetial = (id) => {
  return request({
    url: `/park/enterprise/${id}`
  })
}
export const edit = (data) => {
  return request({
    url: '/park/enterprise',
    method: 'PUT',
    data
  })
}
export const del = (id) => {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'DELETE'
  })
}
export const getrbuilding = () => {
  return request({
    url: '/park/rent/building'
  })
}
export const create_rent = (data) => {
  return request({
    url: '/park/enterprise/rent',
    method: 'POST',
    data
  })
}
export const get_rent_list = (id) => {
  return request({
    url: `/park/enterprise/rent/${id}`
  })
}
export function outrent(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'PUT'
  })
}
export const del_rent = (id) => {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'DELETE'
  })
}
export const get_rent_detail = (id) => {
  return request({
    url: `/park/enterprise/rent/${id}`
  })
}
