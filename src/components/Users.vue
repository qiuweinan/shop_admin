<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <div style="margin-top: 15px;" class="btn">
      <el-input placeholder="请搜索输入内容" v-model="query">
        <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
      </el-input>
      <el-button type="success" plain @click="showDialog">添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="scope">
          <el-button @click="showEditDialog(scope.row)" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button @click="delUser(scope.row.id)" plain type="danger" icon="el-icon-delete" circle></el-button>
          <el-button type="success" round plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="form" :rules="rules" label-width="80px" status-icon ref="form">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱地址" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
        <el-dialog
      title="修改用户"
      :visible.sync="editVisible"
      width="35%">
      <el-form :model="editForm" :rules="rules" label-width="80px" status-icon ref="editForm">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱地址" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary"  @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      userList: [],
      total: 1,
      dialogVisible: false,
      editVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: ['blur', 'change'] },
          { min: 5, max: 16, message: '长度在 3 到 10 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      },
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const res = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      const { meta, data } = res
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    async delUser (id) {
      try {
        await this.$confirm('你确定要删除吗?', '温馨提示', {
          type: 'warning'
        })
        // 发送ajax
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success('删除成功')
          // console.log(this.userList.length)
          // 如果 当前页只有一条，就不能在获取当前页了
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          // 重新渲染
          this.getUserList()
        }
      } catch (e) {
        this.$message('取消删除')
      }
    },
    showDialog () {
      this.dialogVisible = true
    },
    searchUser () {
      this.pagenum = 1
      this.getUserList()
    },
    async addUser (row) {
      try {
        await this.$refs.form.validate()
        const res = await this.$axios.post('users', this.form)
        const { status, msg } = res.meta
        if (status === 201) {
          this.$message.success('添加成功')
          // 重置表单
          this.$refs.form.resetFields()
          // 隐藏对话框
          this.dialogVisible = false
          // 重新渲染第一页
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)

          this.getUserList()
        } else {
          this.$message.error(msg)
        }
      } catch (e) {}
    },
    async changeState (row) {
      const res = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
      const { status, msg } = res.meta
      if (status === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.error(msg)
      }
    },
    showEditDialog (row) {
      this.editVisible = true
      // const { username, email, mobile, id } = row
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
      // this.editForm = { ...row }
    },
    async editUser () {
      try {
        await this.$refs.editForm.validate()
        const { id, email, mobile } = this.editForm
        const res = await this.$axios.put(`users/${id}`, { email, mobile })
        const { status, msg } = res.meta
        if (status === 200) {
          this.$message.success('修改成功')
          // 重置表单
          this.$refs.editForm.resetFields()
          // 关闭修改框
          this.editVisible = false
          // 重新渲染
          this.getUserList()
        } else {
          this.$message.error(msg)
        }
      } catch (e) {}
    }
  }
}
</script>

<style lang="scss" scoped>
  .users {
    .el-breadcrumb {
      height: 50px;
      line-height: 50px;
      padding-left: 6px;
      background-color: #d4dae0;
      font-size: 16px;
    }
    .icn {
      position: absolute;
      left: 162px;
      top: 0;
    }
    .btn {
      .el-input {
        width: 350px;
      }
    }
  }
</style>
