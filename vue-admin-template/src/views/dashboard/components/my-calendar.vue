<template>
  <div class="my-calendar-container">
    <el-row type="flex" justify="end">
      <!-- 年下拉框 -->
      <el-select
        v-model="currentYear"
        size="small"
        style="width: 120px"
        @change="yearChange"
      >
        <el-option
          v-for="item in years"
          :key="item"
          :label="item"
          :value="item"
        >{{ item }}</el-option>
      </el-select>
      <!-- 月下拉框 -->
      <el-select
        v-model="currentMonth"
        size="small"
        style="width: 120px;margin-left:10px"
        @change="monthChange"
      >
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item - 1"
        >{{ item }}</el-option>
      </el-select>
    </el-row>
    <!-- :value 单向绑定 父组件数据改变 流向子组件  v-model的本质 :value @input="xx=$event" -->
    <el-calendar :value="currentDate">
      <template v-slot:dateCell="{ date, data }" class="content">
        <div class="date-content">
          <span class="text"> {{ data.day.split('-')[2] }}</span>
          <span v-if="canRelx(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'MyCalendarContainer',
  data() {
    console.log(new Date().getMonth())
    return {
      years: ['2020', '2021'],
      currentYear: '2021',
      currentMonth: new Date().getMonth(),
      currentDate: new Date()
    }
  },
  methods: {
    // 月改变
    monthChange() {
      // 设置日期选择器的当前日期
      // Date中的3个参数分别是 年 月 日
      console.log(new Date().getDate())
      console.log(new Date().getMonth())
      this.currentDate = new Date(
        this.currentYear,
        this.currentMonth,
        new Date().getDate()
      )
    },
    // 年改变
    yearChange() {
      this.currentMonth = 1
    },
    canRelx(date) {
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>

<style lang="scss">
.my-calendar-container {
  .el-calendar-day {
    height: auto;
  }
  .el-calendar-table__row td,
  .el-calendar-table tr td:first-child,
  .el-calendar-table__row td.prev {
    border: none;
  }
  .date-content {
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
  }
  .date-content .rest {
    color: #fff;
    border-radius: 50%;
    background: rgb(250, 124, 77);
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    font-size: 12px;
    margin-left: 10px;
  }
  .date-content .text {
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
  }
  // .el-calendar-table td.is-selected {
  //   background-color: #fff;
  // }
  // .el-calendar-table td.is-selected .text {
  //   color: #000;
  // }

  .el-calendar-table td.is-selected .text {
    background: #409eff;
    color: #fff;
    border-radius: 50%;
  }
  .el-calendar__header {
    display: none;
  }
}
</style>
