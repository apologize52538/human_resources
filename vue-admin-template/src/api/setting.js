import request from '@/utils/request'

/**
 *  获取公司信息
 * **/
export function getCompanyById(id) {
  return request({
    url: `/company/${id}`,
    // 请求方法为 get 可以省略不写,默认值就是
    method: 'get'
  })
}

// 获取角色列表
// page 页码
// pagesize 页容量
export function getRoles({ page, pagesize }) {
  return request({
    url: `/sys/role`,
    method: 'get',
    params: {
      page,
      pagesize
    }
  })
}

// 新增角色
// name 角色名
// description 描述
export function addRole({ name, description }) {
  return request({
    url: '/sys/role',
    method: 'post',
    data: {
      name,
      description
    }
  })
}

// 根据id获取角色信息
// id
export function getRoleById(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'get'
  })
}

// 根据id修改角色
// id 角色id
// name 角色名
// description 角色描述
export function editRoleById({ id, name, description }) {
  return request({
    url: `/sys/role/${id}`,
    method: 'put',
    data: { name, description }
  })
}

// 根据id删除角色
export function delRoleById(id) {
  return request({
    url: `/sys/role/${id}`,
    // 删除
    method: 'delete'
  })
}

// 给角色分配权限
// id:角色id
// permIds:权限id数组
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
