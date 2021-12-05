<template>
  <div class="import">
    <el-card>
      <h3>员工导入</h3>
      <el-alert
        title="每次导入仅添加1000名员工哦,姓名、手机、入职时间、聘用形式为必填项"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 上传组件 -->
      <UploadExcel
        :beforeUpload="beforeUpload"
        :onSuccess="onSuccess"
      ></UploadExcel>
    </el-card>
  </div>
</template>

<script>
import UploadExcel from "@/components/UploadExcel";
import { importEmployees } from "@/api/employees";
// 导入枚举
import EMPLOYEECON from "@/api/constant/employees";

const formatDate = (numb, format) => {
  const time = new Date((numb - 1) * 24 * 3600000 + 1);
  time.setYear(time.getFullYear() - 70);
  const year = time.getFullYear() + "";
  const month = time.getMonth() + 1 + "";
  const date = time.getDate() - 1 + "";
  if (format && format.length === 1) {
    return year + format + month + format + date;
  }
  return (
    year + (month < 10 ? "0" + month : month) + (date < 10 ? "0" + date : date)
  );
};

export default {
  name: "import",
  components: {
    UploadExcel,
  },
  methods: {
    // 上传之前的逻辑
    // 返回 true 或者false 让逻辑是否继续执行
    // file 当前选择的那个文件
    async beforeUpload(file) {
      // console.log('file:', file)
      // 返回true 继续上传
      // 1m=1024kb=1kb=1024b
      // 转为mb
      if (file.size / 1024 / 1024 > 1) {
        // 太大了 大于1mb
        this.$message.warning("服务器接受不了这么大的文件哦!");
        return false;
      } else {
        // const res = await importEmployees(file)
        // console.log('res:', res)
        // ok
        return true;
      }
      // 返回false 阻断
      // 方法的默认返回值是undefined
    },
    async onSuccess(data) {
      // 2019/3/11
      // console.log("数据:", data.results);
      const _arr = data.results.map((v) => {
        // 保存数据的对象
        const _obj = {};
        for (const key in v) {
          // 正确的key
          const currentKey = EMPLOYEECON.excelMap[key];
          // 正确的value
          let cirrentValue = v[key];
          // 特殊处理日期
          if (currentKey === "timeOfEntry" || currentKey === "correctionTime") {
            cirrentValue = formatDate(cirrentValue, "/");
          }
          _obj[currentKey] = cirrentValue;
        }
        return _obj;
      });
      // console.log("_arr:", _arr);
      // 测试发现 提交的数据格式 key 应该是 英文
      // 默认现在是 中文
      const res = await importEmployees(_arr);
      // 提示用户
      this.$message.success("导入成功哦!");
      // 返回用户页
      this.$router.push("/employees");
      // console.log("res:", res);
    },
  },
};
</script>

<style lang="scss">
.import {
  h3 {
    text-align: center;
  }
}
</style>
