<template>
  <el-dialog title="分配权限" :visible.sync="visible" @close="btnPermCancel">
    <!-- 权限是一颗树 -->
    <!-- 将数据绑定到组件上 -->
    <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
    <!-- id作为唯一标识 -->
    <!-- show-checkbox 节点是否可被选择 -->
    <!-- default-expand-all 是否展开所有 -->
    <!-- default-checked-keys 默认勾选的节点数组 -->
    <el-tree
      ref="permTree"
      :data="permData"
      :props="defaultProps"
      :show-checkbox="true"
      :check-strictly="true"
      :default-expand-all="true"
      :default-checked-keys="selectCheck"
      node-key="id"
    />
    <!-- 确定 取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="btnPermOK"
        >确定</el-button>
        <el-button size="small" @click="btnPermCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 导入接口
import { getPermissionList } from '@/api/permission'
import { getRoleById, assignPerm } from '@/api/setting'
// 导入辅助函数
import { formatData } from '@/utils'
export default {
  name: 'PerDialog',
  data() {
    return {
      visible: false, // 是否显示
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },
  methods: {
    // 外部 弹框的方法
    async getDataAndShow(id) {
      // console.log('id:', id)
      // 获取所有权限
      const res = await getPermissionList()
      // 转树,顶级节点的pid为0
      this.permData = formatData(res, '0')
      // 获取 角色信息
      const roleRes = await getRoleById(id)
      // 设置默认选中的节点
      this.selectCheck = roleRes.permIds
      // 保存角色id
      this.roleId = id
      this.visible = true
    },
    async btnPermOK() {
      // console.log('btnPermOK')
      // 获取 树形节点选中节点id的方法 通过tree点出来的
      console.log(this.$refs.permTree.getCheckedKeys())
      await assignPerm({
        id: this.roleId,
        permIds: this.$refs.permTree.getCheckedKeys()
      })
      this.$message.success('恭喜你分配权限成功😂!')
      this.visible = false
    },
    // 弹框关闭事件
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.visible = false // 关闭弹框
    }
  }
}
</script>

<style></style>
