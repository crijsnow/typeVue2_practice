import request from '@/utils/request.js'
export const access_role_list = () => {
  return request({
    url: '/park/sys/role',
    headers: {
      'application': 'x-www-form-urlencoded'
    }
  })
}
