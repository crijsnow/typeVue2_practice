import request from '@/utils/request.js'
export const get_list = (params) => {
  return request({
    url: '/park/propertyfee',
    params
  })
}
export const get_building = () => {
  return request({
    url: '/park/all/building'
  })
}
export const get_enterprise = () => {
  return request({
    url: '/park/all/enterprise'
  })
}

export const add_property = (data) => {
  return request({
    url: '/park/propertyfee',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const edit_property = (data) => {
  return request({
    url: '/park/propertyfee',
    method: 'PUT',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const get_price = (data) => {
  return request({
    url: '/park/propertyfee/pre/payment',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const del = (id) => {
  return request({
    url: `/park/propertyfee/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const get_detail = (id) => {
  return request({
    url: `/park/propertyfee/${id}`,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
