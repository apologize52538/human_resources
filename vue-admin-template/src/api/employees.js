import request from '@/utils/request'

/**
 *  获取员工的简单列表
 * **/
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

// 获取员工列表
// page 页码
// size 页容量
// 调用时需要传递对象,可以解构出对应的属性
// getEmployees({pgae:1,size:2})
export function getEmployees({ page, size }) {
  return request({
    url: '/sys/user',
    method: 'get',
    params: {
      page,
      size
    }
  })
}

// 获取员工列表
export function addEmployee({
  username,
  mobile,
  formOfEmployment,
  workNumber,
  departmentName,
  timeOfEntry,
  correctionTime
}) {
  return request({
    url: `/sys/user`,
    method: 'post',
    data: {
      username,
      mobile,
      formOfEmployment,
      workNumber,
      departmentName,
      timeOfEntry,
      correctionTime
    }
  })
}

// 获取员工列表
export function delEmployeeById(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

// 导入接口
export function importEmployees(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

// 修改用户
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put', // post
    data
  })
}

// 读取用户详情接口
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

// 更新用户详情接口
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

// 岗位信息接口
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

// 修改岗位信息接口
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

// 分配角色接口
// id 用户id
// roleIds 角色的id
export function assignRoles({ id, roleIds }) {
  return request({
    url: '/sys/user/assignRoles',
    data: {
      id,
      roleIds
    },
    method: 'put'
  })
}
