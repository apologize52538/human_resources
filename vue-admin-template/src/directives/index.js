// 导入Vue
import Vue from 'vue'

/*
  v-err
  默认图片直接写死
  默认图片外部传入
*/
Vue.directive('err', {
  bind(el, binding) {
    // 加载失败
    el.onerror = function() {
      console.log('我裂开啦!')
      el.src = require('../assets/common/img.jpeg')
    }
  }
})

/*
  v-errplus="图片资源"
*/
Vue.directive('errplus', {
  bind(el, binding) {
    // 加载失败
    el.onerror = function() {
      console.log('我裂开啦!')
      el.src = binding.value
    }
  }
})
