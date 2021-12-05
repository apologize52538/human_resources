<template>
  <el-dialog title="分配角色" :visible.sync="visible">
    <!-- v-model 可以获取到选中的值
      label 选中之后获取的值(value)
      看到的是 双标签内部的结果
     -->
    <el-checkbox-group v-model="roles">
      <!-- 选项 -->
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="submitForm"
        >确定</el-button>
        <el-button size="small" @click="visible = false">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 导入接口
import { getMoreInfo } from '@/api/user'
import { getRoles } from '@/api/setting'
import { assignRoles } from '@/api/employees'
export default {
  props: {},
  data() {
    return {
      roleList: [], // 角色列表
      roles: [], // 选中的角色id
      userInfo: {}, // 用户信息
      visible: false // 是否显示
    }
  },
  methods: {
    async submitForm() {
      await assignRoles({ id: this.userInfo.id, roleIds: this.roles })
      this.$message.success('角色分配成功 yeah!')
      this.visible = false
    },
    async getDataAndShow(id) {
      // console.log('id:', id)
      const info = await getMoreInfo(id)
      this.userInfo = info
      // console.log('info:', info)
      this.roles = info.roleIds
      const roles = await getRoles({ page: 1, pagesize: 10000 })
      // 保存角色信息
      this.roleList = roles.rows
      // console.log('roles:', roles)
      this.visible = true
    }
  }
}
</script>
