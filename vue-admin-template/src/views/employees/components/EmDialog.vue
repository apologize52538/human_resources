<template>
  <el-dialog
    class="employee-dialog"
    title="新增员工"
    :visible.sync="dialogFormVisible"
  >
    <el-form :model="form">
      <el-form-item label="姓名" :label-width="formLabelWidth">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="手机" :label-width="formLabelWidth">
        <el-input v-model="form.mobile" autocomplete="off" />
      </el-form-item>
      <el-form-item label="入职时间" :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.timeOfEntry"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="聘用形式" :label-width="formLabelWidth">
        <el-select v-model="form.formOfEmployment" placeholder="请选择活动区域">
          <el-option
            v-for="item in hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" :label-width="formLabelWidth">
        <el-input v-model="form.workNumber" autocomplete="off" />
      </el-form-item>
      <el-form-item label="部门" :label-width="formLabelWidth">
        <el-input
          v-model="form.departmentName"
          autocomplete="off"
          @focus="isShowTree = true"
        />
        <el-tree
          v-show="isShowTree"
          icon-class="false"
          default-expand-all
          :data="data"
          :props="defaultProps"
          @node-click="handleNodeClick"
        />
      </el-form-item>
      <el-form-item label="转正时间" :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.correctionTime"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 导入部门接口
import { getDepartments } from '@/api/departments'
import { formatData } from '@/utils'
// 和默认的值区分开来
import EMPLOYEECON from '@/api/constant/employees'
// 导入接口
import { addEmployee } from '@/api/employees'
export default {
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      data: [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1'
                }
              ]
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1'
                }
              ]
            }
          ]
        }
      ],
      // 修改 tree组件查找数据属性的对应key
      defaultProps: {
        // 后代
        children: 'children',
        // 文本
        label: 'name'
      },
      isShowTree: false,
      // 聘用形式的对应数组
      hireType: EMPLOYEECON.hireType
    }
  },
  async created() {
    const res = await getDepartments()
    // console.log('res:',res);
    // 顶级的pid是'''
    this.data = formatData(res.depts, '')
  },
  methods: {
    // 提交表单
    async submitForm() {
      // 表单校验
      const res = await addEmployee(this.form)
      // console.log('res:', res)

      // 获取父组件
      // console.log(this.$parent)
      this.$parent.getData()
      // 关闭弹框
      this.dialogFormVisible = false
      // 清空表单
      // this.form={} 直接改栈指向
      // 下面的是 合并
      Object.assign(this.form, {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      })
    },
    // 点击tree
    handleNodeClick(data) {
      // console.log(data)
      this.form.departmentName = data.name
      this.isShowTree = false
    }
  }
}
</script>

<style lang="scss">
// 为什么不用 scoped
// 用了scoped element组件的样式就不太好盖住
// 除非给 deep选择器
.employee-dialog {
  .el-form-item__content {
    width: 420px;
  }
  .el-tree {
    border: 1px solid #dcdfe6;
    position: absolute;
    width: 420px;
    z-index: 998;
  }
}
</style>
