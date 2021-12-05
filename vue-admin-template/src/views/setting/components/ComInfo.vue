<template>
  <el-form label-width="200px" ref="form" :model="form">
    <el-form-item label="企业名称">
      <el-input disabled v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="公司地址">
      <el-input disabled v-model="form.companyAddress"></el-input>
    </el-form-item>
    <el-form-item label="公司电话">
      <el-input disabled v-model="form.companyPhone"></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input disabled v-model="form.mailbox"></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input disabled v-model="form.remarks"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { getCompanyById } from '@/api/setting'
// map辅助函数
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      form: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  async created () {
    const res = await getCompanyById(this.companyId)
    // console.log('res:', res)
    this.form = res
  }
}
</script>

<style></style>
