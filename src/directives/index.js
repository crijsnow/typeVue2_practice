// 放置全局指令
import Vue from 'vue'
import store from '@/store'
Vue.directive('perms', {
  inserted(el, data) {
    const perms = store.state.user.profile.permissions
    if (perms.includes('*:*:*')) return
    else if (!perms.includes(data.value)) {
      el.remove()
    }
  }
})
