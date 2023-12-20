import request from '@/utils/request.js'
export const get_list = (params) => {
  return request({
    url: '/park/sys/user',
    params
  })
}
export const get_role = () => {
  return request({
    url: '/park/sys/role',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export const add = (data) => {
  return request({
    url: '/park/sys/user',
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const edit = (data) => {
  return request({
    url: '/park/sys/user',
    data,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const del_ = (id) => {
  return request({
    url: `/park/sys/user/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export const reset = (data) => {
  return request({
    url: '/park/sys/user/resetPwd',
    method: 'PUT',
    data
  })
}
