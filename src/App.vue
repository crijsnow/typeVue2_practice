<template>
  <div id="app">
    <!-- 子应用挂载点 -->
    <div id="container" />
    <!-- 一级路由挂载点 -->
    <!-- <router-view /> -->
    <router-view v-if="$route.path!=='/big-screen'" />
  </div>
</template>

<script>
import { jiaoben } from '@/views/Login/jiaoben.js'
export default {
  name: 'App',
  created() {
    // const routerasync = this.$store.state.menu.menulist
    if (this.$router.currentRoute.fullPath !== '/login') {
      jiaoben()
      // routerasync.forEach(ele => {
      //   this.$router.addRoute(ele)
      // })
    }
  }
}
</script>
