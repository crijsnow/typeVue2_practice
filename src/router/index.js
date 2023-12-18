import Vue from 'vue'
import Router from 'vue-router'
import { White_List } from '@/constants/White_List'
// import store from '@/store/index.js'
// import { asyncRoutes } from './asyncRoutes'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { getToken } from '@/utils/auth'

export const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/login'
  },
  {
    path: '/workbench',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/Workbench/index'),
      meta: { title: '工作台', icon: 'el-icon-data-board' }
    }]
  },
  // {
  //   path: '/park',
  //   component: Layout,
  //   permission: 'park',
  //   meta: { title: '园区管理', icon: 'el-icon-office-building' },
  //   children: [{
  //     path: 'building',
  //     permission: 'park:building',
  //     meta: { title: '楼宇管理' },
  //     component: () => import('@/views/Park/Building/index')
  //   },
  //   {
  //     path: 'enterprise',
  //     permission: 'park:enterprise',
  //     meta: { title: '企业管理' },
  //     component: () => import('@/views/Park/Enterprise/index')
  //   }]
  // },

  // {
  //   path: '/parking',
  //   component: Layout,
  //   permission: 'parking',
  //   meta: { title: '行车管理', icon: 'el-icon-guide' },
  //   children: [{
  //     path: 'area',
  //     permission: 'parking:area',
  //     component: () => import('@/views/Car/CarArea'),
  //     meta: { title: '区域管理' }
  //   }, {
  //     path: 'card',
  //     permission: 'parking:card',
  //     component: () => import('@/views/Car/CarCard'),
  //     meta: { title: '月卡管理' }
  //   }, {
  //     path: 'pay',
  //     permission: 'parking:payment',
  //     component: () => import('@/views/Car/CarPay'),
  //     meta: { title: '停车缴费管理' }
  //   },
  //   {
  //     path: 'rule',
  //     permission: 'parking:rule',
  //     component: () => import('@/views/Car/CarRule'),
  //     meta: { title: '计费规则管理' }
  //   }]
  // },
  // {
  //   path: '/pole',
  //   component: Layout,
  //   permission: 'pole',
  //   meta: { title: '一体杆管理', icon: 'el-icon-refrigerator' },
  //   children: [{
  //     path: 'info',
  //     permission: 'pole:info',
  //     component: () => import('@/views/Rod/RodManage'),
  //     meta: { title: '一体杆管理' }
  //   }, {
  //     path: 'waring',
  //     permission: 'pole:warning',
  //     component: () => import('@/views/Rod/RodWarn'),
  //     meta: { title: '告警记录' }
  //   }]
  // },
  // {
  //   path: '/sys',
  //   component: Layout,
  //   permission: 'sys',
  //   meta: { title: '系统管理', icon: 'el-icon-setting' },
  //   children: [{
  //     path: 'role',
  //     permission: 'sys:role',
  //     component: () => import('@/views/System/Role/index'),
  //     meta: { title: '角色管理' }
  //   }, {
  //     path: 'user',
  //     permission: 'sys:user',
  //     component: () => import('@/views/System/Employee/index'),
  //     meta: { title: '员工管理' }
  //   }]
  // },
  // {
  //   path: '/propety',
  //   component: Layout,
  //   children: [{
  //     // 注意：这里路径字符串为空，代表一级菜单无二级菜单
  //     path: '',
  //     name: 'cost',
  //     // 二级路由点，要挂载的组件
  //     component: () => import('@/views/Propety/index'),
  //     // 左侧路由上标题和图标（图标使用 element-ui 组件库里图标类名（因为左侧导航组件是基于 element-ui 组件库）
  //     meta: { title: '物业费管理', icon: 'el-icon-wallet' }
  //   }]
  // },
  {
    path: '/addcard',
    component: () => import('@/views/Car/CarCard/add-card.vue')
  },
  {
    path: '/addenterprise',
    component: () => import('@/views/Park/Enterprise/add.vue')
  },
  {
    path: '/exterpriseDetail',
    component: () => import('@/views/Park/Enterprise/detail')
  },
  {
    path: '/roleadd/:roleId?',
    component: () => import('@/views/System/Role/add')
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})

const router = createRouter()

// function getFirst() {
//   const arr = store.state.user.profile.permissions.map(ele => {
//     return ele.split(':')[0]
//   })
//   return [...new Set(arr)]
// }
// function getSecond() {
//   const arr = store.state.user.profile.permissions.map(ele => {
//     const side = ele.split(':')
//     return `${side[0]}:${side[1]}`
//   })
//   return [...new Set(arr)]
// }
// // 根据权限标识过滤路由表
// function getRoutes(firstRoutePerms, secondRoutePerms, asyncRoutes) {
//   if (firstRoutePerms.includes('*')) {
//     return [...asyncRoutes]
//   }

//   // 根据一级和二级对动态路由表做过滤 return出去过滤之后的路由表
//   // 1. 根据一级路由对动态路由表做过滤
//   return asyncRoutes.filter(route => {
//     return firstRoutePerms.includes(route.permission)
//   }).map(item => {
//     // 2. 对二级路由做过滤
//     return {
//       ...item,
//       children: item.children.filter(item => secondRoutePerms.includes(item.permission))
//     }
//   })
// }

router.beforeEach((to, from, next) => {
  const token = getToken()
  if (token) {
    // if (from.path === '/login') {
    //   const firstRoutePerms = getFirst()
    //   const secondRoutePerms = getSecond()
    //   const finRoutes = getRoutes(firstRoutePerms, secondRoutePerms, asyncRoutes)
    //   console.log(finRoutes)
    //   finRoutes.push({
    //     path: '*',
    //     component: () => import('@/views/404'),
    //     hidden: true
    //   })
    //   finRoutes.forEach(ele => {
    //     router.addRoute(ele)
    //   })
    //   store.commit('menu/setS', finRoutes)
    // }
    next()
  } else if (White_List.includes(to.path)) {
    next()
  } else {
    next('/login')
    // next(false)使得切换失败，原地呆着
  }
})

// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter()
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher
}

export default router
