// 导入默认路由
import router, { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 路由数组
  allRoutes: constantRoutes
}
const mutations = {
  // 修改路由数组
  setRoutes(state, newRoutes) {
    state.allRoutes = newRoutes
  },
  // 测试用
  test(state) {
    console.log('被触发啦:')
  }
}
const actions = {
  // 筛选路由的action
  async filterRoutes(context) {
    // console.log('context:', context)
    // getters不是必须 用 rootState一路点也可以
    const _menus = context.rootGetters.menus

    // 筛选可以访问的路由
    // 基于大数组 筛选出 符合条件的子数组
    const _newRoutes = asyncRoutes.filter((router) => {
      // console.log('router:', router)
      // 看到的页面都是在 router.children中
      const children = router.children.filter((child) => {
        // console.log('child:', child)
        if (_menus.includes(child.name) === true) {
          return true
        } else {
          return false
        }
      })
      // console.log('children.length:', children.length)
      // filter方法的返回值一定是数组 []
      // [] -->true
      if (children.length > 0) {
        return true
      } else {
        return false
      }
    })
    // console.log('_newRoutes:', _newRoutes)
    // 动态添加路由0
    // 末尾合并404
    _newRoutes.push({ path: '*', redirect: '/404', hidden: true })
    // addRoutes需要耗费一点时间 才可以添加完毕
    router.addRoutes(_newRoutes)
    // mutation
    // 末尾合并404
    // context.commit('setRoutes', [..._newRoutes, ...constantRoutes])
    context.commit('setRoutes', [...constantRoutes, ..._newRoutes])
  }
}

export default {
  // 命名空间
  namespaced: true,
  state,
  mutations,
  actions
}
