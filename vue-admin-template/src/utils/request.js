import axios from 'axios'
// 导入 element的 message
import { Message } from 'element-ui'
// 导入 store
import store from '../store'

const service = axios.create({
  // 从环境变量中取值
  // 从.enve.development 中 读取 VUE_APP_BASE_API 对应的值
  // http://localhost:3000
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // console.log('token:', store.getters.token)
    // 非空时 携带token
    const _token = store.getters.token
    if (_token) {
      config.headers.Authorization = `Bearer ${_token}`
    }
    // 携带token
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  // 成功,请求成功
  // 请求可以出得去,服务器也有东西回来
  // 但是接口可能调用失败,比如用户名和密码啊错误
  (response) => {
    // console.log('response:', response)
    const { message, data, success } = response.data
    if (success === false) {
      // 接口调用失败, 给用户看的
      Message.error(message)
      // 可以自己通过 Error构造函数弄出一个错误
      // 给程序看的 阻断后续代码的执行
      return Promise.reject(new Error(message))
    } else {
      // 正常返回数据
      return data
    }
  },
  // 失败
  // 请求失败,
  // 404,跨域等,请求不到服务器的错误
  // 这里的提示没必要给正常用户看
  (error) => {
    return Promise.reject(error)
  }
)

export default service
