export default {
  computed: {
    // 控制页面级别的按钮
    togglePageBtn() {
      console.log(this.$store.getters.points)
      return (point) => {
        // console.log('返回的func中的逻辑')
        // console.log('point:', point)
        // 判断 point 是否在 权限点中存在即可
        // true false
        return (
          this.$store.getters.points &&
          this.$store.getters.points.includes(point)
        )
      }
    },
    // 控制操作级别的按钮
    toggleBtn() {
      // console.log(this.$store.getters.points)
      return (point) => {
        // console.log('返回的func中的逻辑')
        // console.log('point:', point)
        // 判断 point 是否在 权限点中存在即可
        // true false
        return (
          this.$store.getters.points &&
          this.$store.getters.points.includes(point)
        )
      }
    }
  }
}
