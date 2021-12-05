<template>
  <div class="departments">
    <!-- 卡片 -->
    <el-card>
      <!-- tabs -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="组织架构" name="first">
          <!-- layout 栅格(shan ge)布局 -->
          <el-row type="flex" justify="space-between">
            <el-col :span="6">
              <h4>XX公司</h4>
            </el-col>
            <el-col class="right-col" :span="6">
              <span class="leader">负责人</span>
              <!-- 下拉菜单 -->
              <el-dropdown>
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <!-- 点击 添加顶级节点 -->
                    <el-button
                      type="text"
                      @click="dialogFormVisible = true"
                    >添加子部门</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
          <!-- 和底部的内容分割开来 -->
          <el-divider />
          <!-- tree -->
          <el-tree
            :data="departs"
            :props="defaultProps"
            @node-click="handleNodeClick"
          >
            <!-- 通过插槽传递自定义的结构 -->
            <template #default="{ data }">
              <el-row class="tree-row" type="flex" justify="space-between">
                <el-col :span="6">{{ data.name }}</el-col>
                <el-col class="right-col" :span="6">
                  <span class="leader">{{ data.manager }} </span>\
                  <!-- 下拉菜单 -->
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      操作<i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <el-button
                          type="text"
                          @click="addChildren(data)"
                        >添加子部门</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          type="text"
                          @click="enterEdit(data)"
                        >查看部门</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          type="text"
                          @click="removeItem(data)"
                        >删除部门</el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </template>
          </el-tree>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- dialog -->
    <!-- <DepDialog
      :visible="dialogFormVisible"
      @update:visible="dialogFormVisible = $event"
    ></DepDialog> -->
    <DepDialog
      :visible.sync="dialogFormVisible"
      :form="form"
      @getData="getData"
      @cancel="onCancel"
    />
  </div>
</template>

<script>
import {
  getDepartments,
  getDepartmentById,
  delDepartmentById
} from '@/api/departments'
// 导入
import DepDialog from './components/DepDialog.vue'

// 导入辅助函数 列表转 树的逻辑
import { formatData } from '@/utils'

export default {
  name: 'Departments',
  components: {
    DepDialog
  },
  data() {
    return {
      // 是否显示弹框
      dialogFormVisible: false,
      activeName: 'first',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      form: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        manager: '', // 部门负责人
        name: '', // 部门名称
        pid: '' // 父级部门id
      },
      departs: [
        {
          name: '总裁办',
          manager: '曹操',
          children: [{ name: '董事会', manager: '曹丕' }]
        },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }
      ]
    }
  },

  created() {
    this.getData()
  },
  methods: {
    // 删除
    removeItem(data) {
      console.log('data:', data)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await delDepartmentById(data.id)
          // 重新获取数据
          this.getData()
          // 调用接口
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {})
    },
    // 添加子节点
    addChildren(data) {
      // 给点击的节点加子节点
      // 把id赋值给pid
      this.form.pid = data.id
      // 弹框
      this.dialogFormVisible = true
    },
    // 清空表单
    onCancel() {
      // 如果修改了form中数据的指向(重新赋值)会出现无法清空的问题
      // this.$refs.form.resetFields()
      // 自己清
      this.form = {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        manager: '', // 部门负责人
        name: '', // 部门名称
        pid: '' // 父级部门id
      }
      // 关闭弹框
      this.dialogFormVisible = false
    },
    // 进入编辑
    async enterEdit(data) {
      const res = await getDepartmentById(data.id)
      // console.log('res:', res)
      this.form = { ...res }
      // Object.assign(this.form, res)

      // 弹框
      this.dialogFormVisible = true
    },
    // 获取tree数据的方法
    async getData() {
      const res = await getDepartments()
      // 递归转树 函数
      this.departs = formatData(res.depts, '')

      // console.log(JSON.stringify(res.depts))
      // // 排除掉pid为-1
      // const res1 = res.depts.filter(v => v.pid !== '-1')
      // // 找顶级节点 filter 大数组中筛选出若干个你要的值
      // const root = res1.filter(v => v.pid === '')
      // // 找后代
      // root.forEach(v => {
      //   // 获取 子节点
      //   // pid和当前节点的id相同
      //   v.children = res1.filter(vc => vc.pid === v.id)
      // })
      // // 把处理完毕的数据 设置上去
      // this.departs = root
    },

    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss">
.departments {
  .el-tabs__content {
    padding: 20px 40px 40px;
    h4 {
      margin: 0;
    }
    .right-col {
      text-align: right;
    }
    .leader {
      font-size: 14px;
      margin-right: 10px;
    }
    .el-tree-node__content {
      // width: 100%;
      // display: block;
      .tree-row {
        flex: 1;
      }
    }
  }
}
</style>
