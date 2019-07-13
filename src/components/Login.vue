<template>
  <div class="login">
    <div class="login-container">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules" status-icon>
        <img src="../assets/avatar.jpg" alt />
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 16, message: '长度在 5 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async login () {
      await this.$refs.form.validate()
      const res = await this.$axios.post('login', this.form)
      const { meta, data } = res
      if (meta.status === 200) {
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 把token存起来
        localStorage.setItem('token', data.token)
        // 跳转到首页
        this.$router.push('/')
      } else {
        this.$message.error(meta.msg)
      }
    },
    reset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  width: 100%;
  background-color: #2d434c;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .el-form {
    width: 400px;
    margin: 200px auto;
    background-color: #fff;
    padding: 75px 40px 15px;
    border-radius: 20px;
    position: relative;

    img {
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      top: -60px;
      border-radius: 50%;
      border: 2px solid #fff;
    }

    .el-button:last-child {
      margin-left: 80px;
    }
  }
}
</style>
