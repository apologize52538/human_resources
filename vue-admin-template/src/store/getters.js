// 定义变量
const getters = {
  // 侧边栏
  sidebar: (state) => state.app.sidebar,
  // 设备信息
  device: (state) => state.app.device,
  // 简化token取值
  // this.$store.state.user.token
  token: (state) => state.user.token,
  // 简化用户信息获取
  // this.$store.state.user.userInfo
  userInfo: (state) => state.user.userInfo,
  // 用户的菜单信息
  menus: (state) => state.user.userInfo && state.user.userInfo.roles.menus,
  // 按钮级别权限的快速访问getters
  points: (state) => state.user.userInfo && state.user.userInfo.roles.points,
  // 简化公司id获取
  companyId: (state) => state.user.userInfo.companyId
  // avatar: state => state.user.avatar,
  // name: state => state.user.name
}
// 暴露出去
export default getters
