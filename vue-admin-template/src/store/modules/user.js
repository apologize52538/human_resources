// import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// 导入 login接口
import { login, getUserInfo, getMoreInfo } from '@/api/user'
import { constantRoutes, resetRouter } from '@/router'

const state = {
  // token的字段
  token: getToken() || null,
  // 用户信息
  userInfo: null
}
const mutations = {
  // set 设置
  setToken(state, payload) {
    state.token = payload.token
  },
  // 设置用户信息
  setUserInfo(state, payload) {
    state.userInfo = payload
  }
}
const actions = {
  // 用户登录
  async loginAction(context, payload) {
    // payload 建议是对象
    // ajax接口调用
    const token = await login(payload)
    // 本地缓存
    setToken(token)
    // vuex中
    context.commit('setToken', { token })
  },
  // 获取用户信息
  async getUserInfoAction(context) {
    const res = await getUserInfo()
    // console.log('res:', res)
    const res2 = await getMoreInfo(res.userId)
    // console.log('res2:', res2)
    // 合并两次请求的数据
    context.commit('setUserInfo', { ...res, ...res2 })
  },
  // 用户登出
  logout(context) {
    // token vuex中的
    // payload 需要传递的是 对象 包一层
    context.commit('setToken', { token: null })
    // token cookie中的
    removeToken()
    // userInfo vuex中的 空对象 对应到布尔值 也是true
    context.commit('setUserInfo', null)

    // 重置路由
    resetRouter()
    // 清空 permission模块中的 allRoutes
    // context.commit('permission/test', null, { root: true })
    context.commit('permission/setRoutes', constantRoutes, { root: true })
  }
}

export default {
  // this.$store.state.user.userInfo
  // this.$store.state.user.token
  namespaced: true,
  state,
  mutations,
  actions
}
