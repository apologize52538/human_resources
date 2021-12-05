import request from '@/utils/request'

// 暴露 一个叫做 login的方法
// 导入时 import { login } from '@/api/user
export function login({ mobile, password }) {
  return request({
    url: '/sys/login',
    method: 'post',
    data: {
      mobile,
      password
    }
  })
}
// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 获取员工基本信息
export function getMoreInfo(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}

// import xxx 即可
// export default
