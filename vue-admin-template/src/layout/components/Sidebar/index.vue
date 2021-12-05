<template>
  <div :class="{ 'has-logo': showLogo }">
    <!-- 左侧顶部的logo -->
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <!-- 列表 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 组件  v-for  -->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar']),
    // 左侧的边栏是通过 路由的规则动态生成的
    // 要改左侧的列表,修改路由规则即可
    routes() {
      // 返回了 路由 options 中的 routes
      // 默认可以这么做因为默认加载了所有
      // return this.$router.options.routes
      // 添加了动态添加之后 不能这么获取了
      return this.$store.state.permission.allRoutes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      // 返回仓库中的一个值
      // modules/settings
      // /src/setting.js
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
