import request from '@/utils/request.js'
export const access_role_list = () => {
  return request({
    url: '/park/sys/role',
    headers: {
      'application': 'x-www-form-urlencoded'
    }
  })
}
export const get_all_tree = () => {
  return request({
    url: '/park/sys/permision/all/tree'
  })
}
export const get_detail_rolepower = (id) => {
  return request({
    url: `/park/sys/role/${id}`
  })
}
export const get_person_allordetail = (id) => {
  return request({
    url: `park/sys/roleUser/${id}`
  })
}
export const set_new_role = (data) => {
  return request({
    url: '/park/sys/role',
    method: 'POST',
    data
  })
}
export const change_role = (data) => {
  return request({
    url: '/park/sys/role',
    method: 'PUT',
    data
  })
}
export const del_role = (id) => {
  return request({
    url: `/park/sys/role/${id}`,
    method: 'DELETE'
  })
}
