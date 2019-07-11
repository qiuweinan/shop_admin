<template>
  <el-container class="index">
    <el-header>
      <div class="logo"></div>
      <div class="title">
        <h2>电商后台管理系统</h2>
      </div>
      <div class="logout">
        欢迎你,XXX
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="1-1"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$confirm('你确定要退出吗?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        // 退出成功 删除token，返回登录页
        localStorage.removeItem('token')
        this.$router.push('/login')
        // 提示消息
        this.$message.success('退出成功')
      }).catch(() => {
        this.$message('取消退出')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;
    display: flex;
    height: 60px;
    line-height: 60px;

    .logo,
    .logout {
      width: 180px;
    }
    .logo {
      background: url("../assets/logo.png") no-repeat center center/contain;
    }
    .title {
      flex: 1;
      text-align: center;
      color: #fff;
    }
    .logout {
      text-align: right;

      a {
        color: red;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
  }

  .el-main {
    background-color: #eaeef1;
  }
}
</style>
