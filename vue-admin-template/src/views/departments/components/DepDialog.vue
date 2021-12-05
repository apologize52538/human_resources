<template>
  <!-- 弹框  $event 获取 事件的 默认参数  dom:事件参数 组件:组件内部$emit出来的值 -->
  <el-dialog
    :title="title"
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    @closed="onClosed"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="部门编码" :label-width="formLabelWidth" prop="code">
        <el-input v-model="form.code" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="部门负责人"
        :label-width="formLabelWidth"
        prop="manager"
      >
        <el-select
          v-model="form.manager"
          placeholder="请选择活动区域"
          @focus="onFocus"
        >
          <!-- 新增部门,manager用的是名字,不是id 这个label和value都渲染相同的数据 -->
          <el-option
            v-for="item in managers"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="部门介绍"
        :label-width="formLabelWidth"
        prop="introduce"
      >
        <el-input v-model="form.introduce" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addDepartments, editDepartment } from '@/api/departments'
// 获取员工信息接口 包含管理员信息
import { getEmployeeSimple } from '@/api/employees.js'
export default {
  name: 'DepDialog',
  props: {
    visible: Boolean,
    form: Object
  },
  data () {
    return {
      // 表单的数据
      formLabelWidth: '120px',
      // 表单校验规则
      rules: {
        code: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '请填写1-50个字符', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '请填写1-50个字符', trigger: 'change' }
        ],
        manager: [{ required: true, message: '不能为空', trigger: 'blur' }],
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '请填写1-50个字符', trigger: 'change' }
        ]
      },
      // 部门负责人数组
      managers: []
    }
  },
  computed: {
    title () {
      return this.form.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    // 提交表单
    submitForm () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 有id 走编辑
          if (this.form.id) {
            const res = await editDepartment(this.form)
            // console.log('res:', res)
          } else {
            // 调用接口
            const res = await addDepartments(this.form)
            // console.log('res:', res)
          }
          this.$message.success(`${this.title}成功`)
          // 调用清空表单的逻辑
          // 调用 父组件方法呢?
          this.$emit('getData') //通知父组件
          this.$emit('cancel') //通知父组件
          // 没id 走新增
        } else {
          this.$message.error('数据格式有误,请检查哦!')
          return false
        }
      })
    },
    // 获取 管理员信息
    async onFocus () {
      // 调用接口
      const res = await getEmployeeSimple()
      this.managers = res
    },
    onClosed () {
      // 通知父组件清空
      this.$emit('cancel')
    }
  }
}
</script>

<style></style>
