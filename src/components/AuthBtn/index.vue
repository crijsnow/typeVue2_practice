<template>
  <div>
    <slot name="default" />
  </div>
</template>
<script>
export default {
  props: {
    perms: {
      type: String,
      default: ''
    }
  },
  computed: {
    isShow() {
      return this.$store.state.user.profile.permissions.includes(this.perms) || this.$store.state.user.profile.permissions.includes('*:*:*')
    }
  },
  render() {
    // this.$slots.default拿到的就是要控制显示和隐藏的按钮组件
    return this.isShow && this.$slots.default
  }
}
</script>
