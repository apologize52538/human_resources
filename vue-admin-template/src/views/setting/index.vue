<template>
  <div class="setting">
    <!-- card -->
    <el-card>
      <!-- tabs -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <!-- 1 - 按钮 -->
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="isShow = true"
          >新增角色</el-button>
          <!-- 1 - table -->
          <el-table
            :data="tableData"
            style="width: 100%"
            :default-sort="{ prop: 'date', order: 'descending' }"
            border
          >
            <el-table-column type="index" label="序号" width="70" sortable />
            <el-table-column prop="name" label="角色名" sortable />
            <el-table-column prop="description" label="描述" />
            <el-table-column fixed="right" label="操作">
              <!-- 通过 slot自定义结构  如果要获取到这一行的数据 可以通过 .row属性来获取 -->
              <template #default="{ row }">
                <el-button
                  type="text"
                  size="small"
                  @click="handleClick(row)"
                >分配权限</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="enterEdit(row)"
                >修改</el-button>
                <el-popconfirm
                  title="这是一段内容确定删除吗？"
                  @onConfirm="onConfirm(row)"
                >
                  <el-button
                    slot="reference"
                    type="text"
                    size="small"
                  >删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <!-- 1 - 分页 -->
          <el-pagination
            :current-page="page"
            :page-sizes="[1, 2, 3]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <!-- 2 - form -->
          <ComInfoVue />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 弹框 -->
    <SetDialogVue
      :visible="isShow"
      :form="form"
      @update:visible="isShow = $event"
      @getData="getData"
      @clear="clearHandler"
    />
    <!-- 分配权限弹框 -->
    <PerDialog ref="perDialog" />
  </div>
</template>

<script>
// 导入组件
import ComInfoVue from './components/ComInfo.vue'
import SetDialogVue from './components/SetDialog.vue'
import PerDialog from './components/perDialog.vue'
// 导入接口
import { getRoles, getRoleById, delRoleById } from '@/api/setting'
export default {
  name: 'Setting',
  components: {
    ComInfoVue,
    SetDialogVue,
    PerDialog
  },
  data() {
    return {
      // 是否显示弹框
      isShow: false,
      activeName: 'first',
      page: 1, // 页码
      pagesize: 2, // 页容量
      total: 1, // 总条数
      tableData: [],
      // 表单数据
      form: {
        name: '',
        description: ''
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 删除数据
    async onConfirm(row) {
      // console.log(row)
      // 只要await 不报错 就是成功!
      await delRoleById(row.id) // 删除服务器的数据
      // 判断是否为最后一条数据, 页码-1 除第一页
      if (this.tableData.length === 1 && this.page != 1) {
        this.page--
      }
      this.$message.success('删除成功,哦!')
      this.getData()
    },
    // 清空表单
    clearHandler() {
      this.form = {
        name: '',
        description: ''
      }
    },
    // 进入编辑
    async enterEdit(row) {
      // console.log('row:', row)
      const res = await getRoleById(row.id)
      // console.log('res:', res)
      // 设置给form
      this.form = res
      // 弹出dialog
      this.isShow = true
    },
    // 获取数据
    async getData() {
      const res = await getRoles({ page: this.page, pagesize: this.pagesize })
      this.tableData = res.rows
      // 保存total
      this.total = res.total
    },
    // table内部点击
    async handleClick(row) {
      this.$refs.perDialog.getDataAndShow(row.id)
    },
    // 页容量改变
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      // 一般会返回第一页
      this.page = 1
      // 重新获取数据
      this.getData()
    },
    // 页码改变
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.page = val
      this.getData()
    }
  }
}
</script>

<style lang="scss">
.setting {
  .el-form-item__content {
    width: 600px;
  }
  .el-pagination {
    text-align: right;
  }
}
</style>
