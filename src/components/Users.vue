<template>
  <div class="users">
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="scope">
          <el-button plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button @click="delUser(scope.row.id)" plain type="danger" icon="el-icon-delete" circle></el-button>
          <el-button type="success" round plain>修改信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
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
      total: 1
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    getUserList () {
      this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
        .then(res => {
          const { meta, data } = res
          if (meta.status === 200) {
            this.userList = data.users
            this.total = data.total
            // console.log(data.total)
          }
        })
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
    delUser (id) {
      this.$confirm('你确定要删除吗?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`users/${id}`).then(res => {
          const { meta } = res
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
        })
      }).catch(() => {
        this.$message('取消删除')
      })
    }
  }
}
</script>

<style>

</style>
