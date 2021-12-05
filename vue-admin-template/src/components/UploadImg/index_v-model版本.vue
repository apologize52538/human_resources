<template>
  <div class="app-container">
    <el-upload
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :http-request="requestHandler"
    >
      <!-- img标签 预览图片 -->
      <template v-if="value">
        <img :src="value" class="avatar">
        <i class="el-icon-error" @click.self.stop="clearImg" />
      </template>
      <!-- 图标 默认的 + -->
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
// 导包
import COS from 'cos-js-sdk-v5'
// 实例化
const cos = new COS({
  // 你自己的秘钥
  SecretId: 'AKIDYpzB9qoNL2pLaX8eZQ3RXMvCFUR7looX', // 身份识别 ID
  SecretKey: '0gANQCUTxAICpBTUUDh3OUO2OVLvDIAl' // 身份密钥
})
export default {
  props: {
    value: String
  },
  data() {
    return {
      // imageUrl: ''
    }
  },
  methods: {
    // 清除图片
    clearImg() {
      this.$emit('input', '')
    },
    requestHandler(params) {
      // console.log('requestHandler')
      // console.log('params:', params)
      // 自己提交file这个文件
      // 在需求的时候调用方法即可
      cos.putObject(
        {
          Bucket: 'autumnfish-1256028814' /* 容器名 必须 */,
          Region: 'ap-shenzhen-fsi' /* 存储桶所在地域，必须 */,
          Key: params.file.name /* 文件标记,可以用名字代替 必须 */,
          StorageClass: 'STANDARD' /* 固定值可以不管他 必须 */,
          Body: params.file, // 上传文件对象
          // 上传文件时,会一直执行
          onProgress: (progressData) => {
            // 上传进度
            console.log(JSON.stringify(progressData))
          }
        },
        // 上传完毕
        (err, data) => {
          // 有错就是err 没错就是 data
          console.log(err || data)
          if (data.statusCode === 200) {
            // console.log(data.Location);
            // this.imageUrl = 'https://' + data.Location
            // 通知父组件
            this.$emit('input', 'https://' + data.Location)
          }
        }
      )
    },
    handleAvatarSuccess(res, file) {
      // console.log("success");
      console.log('res:', res)
      console.log('file:', file)
      // 生成一个本地的临时路径
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      console.log('file.type', file.type)
      // 类型判断

      const isJPG = ['image/png', 'image/jpeg', 'image/gif'].includes(file.type)
      // 大小判断
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        // 类型不匹配
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        // 大小不匹配
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      // 返回 false 阻断 true 正常上传
      return isJPG && isLt2M
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  /* overflow: hidden; */
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.app-container .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-icon-error {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 30px;
  color: #ff00006e;
}
</style>
