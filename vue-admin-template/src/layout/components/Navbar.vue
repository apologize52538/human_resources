<template>
  <div class="navbar">
    <!-- 汉堡菜单 fill 改色 -->
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <div class="title-wrapper">
      <h3>XX公司</h3>
      <span class="tag">体验版</span>
    </div>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 头像 -->
          <!-- <img v-err :src="userInfo.staffPhoto" class="user-avatar"> -->
          <img
            v-errplus="require('@/assets/common/fly.gif')"
            :src="userInfo && userInfo.staffPhoto"
            class="user-avatar"
          >
          <span>{{ userInfo && userInfo.username }} </span>
          <!-- 图标 -->
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>

          <!-- native 把事件绑定给组件的根标签 -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  // 测试用
  // created() {
  //   this.$store.dispatch('user/getUserInfoAction')
  // },
  computed: {
    ...mapGetters(['sidebar', 'userInfo'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      // 弹框提示用户
      this.$confirm('你确认要退出', '友情提示', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'success' // 提示图标的风格
      })
        .then(async() => {
          await this.$store.dispatch('user/logout')
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          // 点了确定
          this.$message({
            type: 'success',
            message: '已登出'
          })
        })
        .catch((err) => {
          // 不写.catch 会有一个Promise的错误提示
          // 提示你没有捕获
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #4778fb;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  // 标题部分
  .title-wrapper {
    float: left;
    line-height: 50px;
    h3 {
      display: inline-block;
      color: white;
      margin: 0;
    }
    span {
      color: white;
      margin-left: 15px;
      background-color: #84a9fe;
      padding: 10px;
      border-radius: 10px;
    }
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        .user-avatar {
          cursor: pointer;
          width: 25px;
          height: 25px;
          border-radius: 50%;
        }
        span {
          color: black;
          margin-left: 10px;
          margin-right: 10px;
        }

        .el-icon-arrow-down {
          cursor: pointer;
          // position: absolute;
          // right: -20px;
          // top: 25px;
          font-size: 12px;
          color: white;
        }
      }
    }
  }
}
</style>
