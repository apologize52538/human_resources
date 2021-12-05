<template>
  <div class="permission-container">
    <el-card>
      <!-- 顶部布局 -->
      <el-row type="flex" justify="space-between">
        <el-col :span="4" />
        <el-col class="right-col" :span="6">
          <!-- 1 是一级 -->
          <el-button
            type="primary"
            @click="addPermission('0', 1)"
          >添加权限</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="bottom-card">
      <!-- 底部 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" prop="name" label="名称" />
        <el-table-column align="center" prop="code" label="标识" />
        <el-table-column align="center" prop="description" label="描述" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <!-- 二级权限的添加 row.id 一会要设置的pid   2是二级-->
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(row.id, 2)"
            >添加</el-button>
            <el-button
              type="text"
              @click="editPermission(row.id)"
            >编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">
              删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 放置一个弹层 用来编辑新增节点 -->
    <el-dialog
      :title="`${title}权限点`"
      :visible="showDialog"
      @close="btnCancel"
    >
      <!-- 表单 -->
      <el-form
        ref="perForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 导入接口
import {
  getPermissionList,
  addPermission,
  delPermission,
  getPermissionDetail,
  updatePermission
} from '@/api/permission'
// 导入工具函数
import { formatData } from '@/utils/index'
export default {
  name: 'Permission',
  data() {
    return {
      list: [], // table的数据
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型
        pid: '', // 父节点
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  computed: {
    // 根据 id 判断标题
    title() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取数据
    async getData() {
      // console.log('getData')
      const res = await getPermissionList()
      // console.log('res:', res)
      // 转树形
      this.list = formatData(res, '0')
    },
    // 删除操作
    async delPermission(id) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          console.log('id:', id)
          console.log('editPermission')
          // 调用接口
          await delPermission(id)
          // 提示用户
          this.$message.success('删掉了哦!')
          // 刷新数据
          this.getData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    btnOK() {
      this.$refs.perForm.validate(async(valid) => {
        if (valid) {
          // console.log('校验成功')
          // 在弹框方法中已经设置
          // this.formData.pid = '0'
          // this.formData.type = 1
          if (this.formData.id) {
            // 编辑
            await updatePermission(this.formData)
          } else {
            // 新增
            await addPermission(this.formData)
          }
          this.$message.success(`数据${this.title}成功哦!`)
          this.getData()
          this.showDialog = false
        } else {
          this.$message.error('数据格式有误请检查')
          return false
        }
      })
    },
    // 点击取消
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    // 添加权限
    addPermission(pid, type) {
      console.log('pid:', pid)
      console.log('type:', type)
      console.log('addPermission')
      // 存起来
      this.formData.pid = pid
      this.formData.type = type

      // 弹框
      this.showDialog = true
    },
    // 编辑
    async editPermission(id) {
      console.log('id:', id)
      console.log('editPermission')
      // 获取数据 并 填充
      const res = await getPermissionDetail(id)
      // console.log('res:', res)
      this.formData = res
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss">
.permission-container {
  padding: 20px;
  .bottom-card {
    margin-top: 20px;
  }
  .right-col {
    text-align: right;
  }
}
</style>
