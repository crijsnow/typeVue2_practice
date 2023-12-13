import request from '@/utils/request'
export const getBuildingList = (params) => {
  return request({
    url: '/park/building',
    params
  })
}
export const create = (data) => {
  return request({
    url: '/park/building',
    method: 'POST',
    data
  })
}
export const deleteI = (id) => {
  return request({
    url: `/park/building/${id}`,
    method: 'DELETE'
  })
}
export const editI = (data) => {
  return request({
    url: '/park/building',
    method: 'PUT',
    data
  })
}
