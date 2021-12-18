import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, removeToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // 尝试获取token
  const hasToken = getToken()
  // token 是否存在
  if (hasToken) {
    // token存在的
    // 用户信息是否存在
    // {}
    if (store.getters.userInfo) {
      next()
      // 存在 token是ok的// 放走
    } else {
      // token不一定是正确
      try {
        // 发请求 获取用户信息
        await store.dispatch('user/getUserInfoAction')
        // 一定有了用户信息 筛选路由并添加
        // addRoutes执行完毕,vuex中的路由筛选完毕
        await store.dispatch('permission/filterRoutes')
        // 执行到这里 说明 token是对的 放走
        if (to.path === '/login') {
          Message.warning('您,已登录了哦,滑稽!')
          // 打到首页
          next('/')
        } else {
          // 不是去登录页
          // 让导航守卫重新执行一次
          console.log('to:', to)
          // to是路由对象
          // 有path属性
          // next支持传入({path:'/'})
          // 其他的属性直接不解析
          // next(to)
          next(to.path)
        }
      } catch (error) {
        // 进来 说明上面是错的 token有错
        removeToken()
        Message.warning('用户信息有误,请重新登录!')
        next(`/login?redirect=${to.path}`)
        return
      }
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      // 存在 放走
      next()
    } else {
      Message.warning('请先登录哦!')
      // 打回登录页
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
