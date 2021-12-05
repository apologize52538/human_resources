<template>
  <div class="employee">
    <!-- 卡1 -->
    <el-card class="top-card">
      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <div class="info-box">
            <!-- 图标 -->
            <i class="el-icon-info" />
            <span>共 {{ total }} 条数据</span>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button
            v-if="togglePageBtn('employees-import')"
            type="warning"
            @click="$router.push('/import')"
          >导入</el-button>
          <el-button type="danger" @click="exportExcel">导出</el-button>
          <el-button type="primary" @click="showDialog">新增员工</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 卡2 -->
    <el-card class="bottom-card">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed label="序号" type="index" width="50" />
        <el-table-column prop="username" label="姓名" width="250" />
        <el-table-column prop="workNumber" label="工号" width="120" />
        <el-table-column
          :formatter="formatEmp"
          prop="formOfEmployment"
          label="聘用形式"
          width="250"
        />
        <el-table-column prop="departmentName" label="部门" width="300" />
        <el-table-column prop="timeOfEntry" label="入职时间" width="250">
          <template v-slot:default="{ row }">
            <span>{{ row.timeOfEntry | formatDate }}</span>
          </template>
        </el-table-column>
        <!-- 本地接口木有这个字段 -->
        <el-table-column label="账户状态" width="250" />
        <el-table-column fixed="right" label="操作" width="250">
          <!-- 作用域插槽 获取row -->
          <template #default="{ row }">
            <el-button
              type="text"
              size="small"
              @click="handleClick(row)"
            >查看</el-button>
            <el-button
              type="text"
              size="small"
              @click="showRole(row)"
            >角色</el-button>
            <el-button
              v-if="toggleBtn('employees-del')"
              type="text"
              size="small"
              @click="remove(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :page-size="size"
        layout="prev, pager, next  "
        :total="total"
        :current-page.sync="page"
      />
    </el-card>
    <!-- 员工弹框 -->
    <EmDialogVue ref="dialog" />
    <!-- 权限弹框 -->
    <RoleDialog ref="roleDialog" />
  </div>
</template>

<script>
// 导入接口
import { getEmployees, delEmployeeById } from '@/api/employees'
// 导入 employee的枚举
import EMPLOYEECON from '@/api/constant/employees'
// 导入组件
import EmDialogVue from './components/EmDialog.vue'
import RoleDialog from './components/RoleDialog.vue'
// 导入 混入
import Mixins from '@/mixins'
// 辅助函数
export default {
  name: 'Employees',
  components: { EmDialogVue, RoleDialog },
  // 混入
  mixins: [Mixins],
  data() {
    return {
      tableData: [], // table数据
      size: 3, // 页容量
      page: 1, // 页码
      total: 0 // 总条数
    }
  },
  watch: {
    page() {
      // console.log(this.page)
      this.getData()
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 显示角色弹框
    showRole(row) {
      // console.log(this.$refs.roleDialog)
      // console.log('row:', row)
      // 传递到组件中
      this.$refs.roleDialog.getDataAndShow(row.id)
    },
    // 导出
    async exportExcel() {
      // 调用接口获取数据
      const res = await getEmployees({
        page: 1,
        size: 10000
      })
      console.log('res.rows:', res.rows)
      // 转出头 和数据
      const header = Object.keys(EMPLOYEECON.excelMap)
      // console.log("header:", header);
      const data = res.rows.map((v) => {
        const _arr = []
        header.forEach((zhKey) => {
          // 英文key
          const enKey = EMPLOYEECON.excelMap[zhKey]
          // 通过英文key获取具体的值
          const value = v[enKey]
          // console.log("value:", value);
          _arr.push(value)
        })
        // 返回生成的数组
        return _arr
      })
      // console.log("data:", data);

      import('@/vendor/Export2Excel').then((excel) => {
        excel.export_json_to_excel({
          header, // 表头 必填
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 删除
    remove(row) {
      console.log('row:', row)
      this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
        confirmButtonText: '开除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await delEmployeeById(row.id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (this.page !== 1 && this.tableData.length === 1) {
            this.page--
          }
          // 重新获取数据
          this.getData()
        })
        .catch(() => {})
    },
    // 显示dialog
    showDialog() {
      // console.log(this.$refs)
      // 直接获取组件实例,进而获取他的属性
      // 然后想改什么就改什么
      this.$refs.dialog.dialogFormVisible = true
    },
    // 自定义聘用信息的渲染方式
    formatEmp(row) {
      // console.log('row:', row)
      // 基于 聘用信息 返回 1 2 ->正式或 非正式
      // 导入的数据  formOfEmployment 是undefined
      // 1 或者2 匹配不到的
      const res = EMPLOYEECON.hireType.filter((v) => {
        //
        if (v.id === row.formOfEmployment) {
          return true
        }
      })
      // console.log('res:', res)
      // 最后一页筛选出来的是空数组
      // 空数组[0]-->undefined
      // undefined.value 报错
      return res[0] && res[0].value
    },
    // 获取数据
    async getData() {
      const res = await getEmployees({
        page: this.page,
        size: this.size
      })
      this.tableData = res.rows
      this.total = res.total
    },
    handleClick(row) {
      // console.log(row);
      // path 不能结合params
      // this.$router.push({ path: "/employees/detail", params: { id: row.id } });
      // params 需要结合 name
      this.$router.push({ name: 'detail', params: { id: row.id }})
    }
  }
}
</script>

<style lang="scss">
.employee {
  .bottom-card {
    margin-top: 20px;
  }
  .el-pagination {
    text-align: center;
    margin-top: 20px;
  }
  .el-row {
    align-items: center;
  }
  .info-box {
    border: 1px solid #96d7ff;
    background-color: #e6f7ff;
    border-radius: 4px;
    display: inline-block;
    padding: 4px;
    i {
      color: #5181fb;
    }
  }
}
</style>
