<template>
  <div id="app">
    <router-view />
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
