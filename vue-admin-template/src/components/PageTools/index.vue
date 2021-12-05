<template>
  <el-row type="flex" justify="space-between">
    <el-col :span="6">
      <div v-if="showBefore" class="info-box">
        <!-- 图标 -->
        <i class="el-icon-info" />
        <span>
          <slot name="before" />
        </span>
      </div>
    </el-col>
    <el-col :span="6">
      <slot name="after" />
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'PageTools',
  props: {
    'show-before': Boolean
  }
}
</script>

<style lang="scss">
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
</style>
