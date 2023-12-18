import store from '@/store'
import { asyncRoutes } from '@/router/asyncRoutes.js'
import router from '@/router'

function getFirst() {
  const arr = store.state.user.profile.permissions.map(ele => {
    return ele.split(':')[0]
  })
  return [...new Set(arr)]
}
function getSecond() {
  const arr = store.state.user.profile.permissions.map(ele => {
    const side = ele.split(':')
    return `${side[0]}:${side[1]}`
  })
  return [...new Set(arr)]
}
// 根据权限标识过滤路由表
function getRoutes(firstRoutePerms, secondRoutePerms, asyncRoutes) {
  if (firstRoutePerms.includes('*')) {
    return [...asyncRoutes]
  }

  // 根据一级和二级对动态路由表做过滤 return出去过滤之后的路由表
  // 1. 根据一级路由对动态路由表做过滤
  return asyncRoutes.filter(route => {
    return firstRoutePerms.includes(route.permission)
  }).map(item => {
    // 2. 对二级路由做过滤
    return {
      ...item,
      children: item.children.filter(item => secondRoutePerms.includes(item.permission))
    }
  })
}
export const jiaoben = () => {
  if (store.state.menu.flag) {
    store.commit('menu/reset')
  }
  const firstRoutePerms = getFirst()
  const secondRoutePerms = getSecond()
  const finRoutes = getRoutes(firstRoutePerms, secondRoutePerms, asyncRoutes)
  finRoutes.push({
    path: '*',
    component: () => import('@/views/404'),
    hidden: true
  })
  finRoutes.forEach(ele => {
    router.addRoute(ele)
  })
  store.commit('menu/setS', finRoutes)
  store.state.menu.flag = true
}
