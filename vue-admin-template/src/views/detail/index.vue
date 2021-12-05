<template>
  <div class="detail">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="登录账户设置" name="first">
          <el-form
            ref="form"
            class="login-form"
            :model="form"
            label-width="400px"
          >
            <el-form-item label="姓名">
              <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                v-model="form.nPassword"
                placeholder="请输入新密码"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">更新</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second">
          <Info />
        </el-tab-pane>
        <el-tab-pane label="岗位信息" name="third"><Job /></el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// 导入接口
import { getMoreInfo } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
// 导入 组件
import Info from './components/Info.vue'
import Job from './components/Job.vue'
export default {
  name: 'Detail',
  components: { Info, Job },
  data() {
    return {
      activeName: 'first',
      form: {
        username: '',
        nPassword: ''
      }
    }
  },
  async created() {
    const res = await getMoreInfo(this.$route.params.id)
    // 把res合并到 this.form上
    Object.assign(this.form, res)
    // console.log("res:", res);
  },
  methods: {
    async onSubmit() {
      const res = await saveUserDetailById({
        ...this.form,
        password: this.form.nPassword
      })
      // console.log("res:", res);
      this.$message.success('修改成功!')
      this.$router.back()
    }
  }
}
</script>

<style lang="scss">
.detail {
  .login-form {
    .el-form-item__content {
      width: 560px;
    }
  }
}
</style>
