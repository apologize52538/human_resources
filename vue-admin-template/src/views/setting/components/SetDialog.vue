<template>
  <el-dialog
    :title="title"
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    @closed="$emit('clear')"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="name" label="角色名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        prop="description"
        label="角色描述"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.description" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 导入接口
import { addRole, editRoleById } from '@/api/setting'
export default {
  name: 'SetDialog',
  props: {
    // 外部传入的控制显示的字段
    visible: Boolean,
    form: Object
  },
  computed: {
    title () {
      return this.form.id ? '编辑角色' : '新增角色'
    }
  },
  data () {
    return {
      formLabelWidth: '120px',
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 判断
          if (this.form.id) {
            // 编辑
            const res = await editRoleById(this.form)
            console.log('res:', res)
          } else {
            // 新增
            // 通过
            await addRole(this.form)
          }

          // console.log('res:', res)
          // 通知父组件 刷新数据
          this.$emit('getData')
          // 关闭弹框
          this.$emit('update:visible', false)
          this.$message.success(`${this.title}!yeah`)
        } else {
          // 失败
          this.$message.error('数据格式有误,请检查哦!^_^')
          return false
        }
      })
    }
  }
}
</script>

<style></style>
