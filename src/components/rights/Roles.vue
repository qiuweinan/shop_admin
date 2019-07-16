<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-button @click="showAddDialog" type="success" plain>添加角色</el-button>
    <el-table :data="roleList" style="width: 100%">
      <el-table-column type="expand">
        <template v-slot:default="{ row }">
          <!-- row是当前角色 一个一级权限应该独占一行 -->
          <span v-show="row.children.length === 0">当前角色没有任何权限信息</span>
          <el-row class="l1" v-for=" l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag @close="delRoles(row, l1.id)" closable>{{ l1.authName }}</el-tag>
              <span class="el-icon-arrow-right"></span>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限 二级权限也要占一行 -->
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag @close="delRoles(row, l2.id)" type="success" closable>{{ l2.authName }}</el-tag>
                  <span class="el-icon-arrow-right"></span>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限 不会独占一行 -->
                  <el-tag @close="delRoles(row, l3.id)" class="l3" type="warning" closable v-for="l3 in l2.children" :key="l3.id">{{ l3.authName }}</el-tag>
                  <span></span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button @click="showEditDialog(row)" type="primary" plain circle icon="el-icon-edit" size="small"></el-button>
          <el-button @click="delUser(row.id, $event)" type="danger" plain circle icon="el-icon-delete" size="small"></el-button>
          <el-button @click="showRolesDialog(row)" type="success" plain round icon="el-icon-check" size="small">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible"
      width="35%">
      <el-tree
       :data="data"
       :props="defaultProps"
       default-expand-all
       show-checkbox
       node-key="id"
       ref="tree">
       </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rolesAllot">分 配</el-button>
      </span>
    </el-dialog>
    <!-- 添加和修改对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="saveVisible"
      width="35%">
      <el-form :model="saveForm" ref="saveForm" :rules="rules" label-width="80px" statys-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="saveForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="saveForm.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      dialogVisible: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      saveVisible: false,
      saveForm: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: ['change', 'blur'] }
        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.roleList = data
        // console.log(this.roleList)
      }
    },
    async delRoles (row, rolesI) {
      const res = await this.$axios.delete(`roles/${row.id}/rights/${rolesI}`)
      if (res.meta.status === 200) {
        // console.log(res)
        // 删除成功
        this.$message.success(res.meta.msg)
        // 重新渲染当前返回的children数据
        // 接口返回的删除后的新数据
        row.children = res.data
      }
    },
    async showRolesDialog (row) {
      // 点击的角色id
      this.roleId = row.id
      // 显示对话框
      this.dialogVisible = true
      // 发送ajax 获取树状tree权限列表
      const { meta, data } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        this.data = data
        // console.log(this.data)
      }
      // 权限列表id回显选中
      let ids = []
      row.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id)
          })
        })
      })
      // 通过id回显已有权限
      this.$refs.tree.setCheckedKeys(ids)
    },
    async rolesAllot () {
      // 获取到全选和半选中的id
      let ls = this.$refs.tree.getCheckedKeys()
      let hs = this.$refs.tree.getHalfCheckedKeys()
      let rids = [...ls, ...hs].join()
      const res = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      const { status, msg } = res.meta
      if (status === 200) {
        this.$message.success(msg)
        // 关闭对话框
        this.dialogVisible = false
        // 重新渲染
        this.getRoleList()
      }
    },
    showAddDialog () {
      this.saveVisible = true
      this.saveForm.roleName = ''
      this.saveForm.roleDesc = ''
      this.saveForm.id = ''
      // 点击添加时候要重置表单
      this.$nextTick(() => {
        this.$refs.saveForm.clearValidate()
      })
    },
    showEditDialog (row) {
      // console.log(row)
      this.saveVisible = true
      this.saveForm.roleName = row.roleName
      this.saveForm.roleDesc = row.roleDesc
      this.saveForm.id = row.id
    },
    async saveUser () {
      try {
        // 表单校验
        await this.$refs.saveForm.validate()
        // 发送ajax
        const { id } = this.saveForm
        let method = id ? 'put' : 'post'
        let url = id ? `roles/${id}` : `roles`
        const res = await this.$axios[method](url, this.saveForm)
        const { status, msg } = res.meta
        if (status === 200 || status === 201) {
          this.$message.success('操作成功')
          // 成功了 关闭对话框
          this.saveVisible = false
          // 重置表单
          this.$refs.saveForm.resetFields()
          // 重新渲染
          this.getRoleList()
        } else {
          this.$message.error(msg)
        }
      } catch (e) {}
    },
    async delUser (id, e) {
      try {
        await this.$confirm('你确定要删除该角色吗?', '温馨提示', { type: 'warning' })
        const res = await this.$axios.delete(`roles/${id}`)
        const { status, msg } = res.meta
        if (status === 200) {
          this.$message.success(msg)
          // 重新渲染
          this.getRoleList()
        } else {
          this.$message(msg)
        }
      } catch (e) {
        // 取消删除
        this.$message('取消删除')
      } finally {
        // 点击删除的时候不会失去焦点
        if (e.target.nodeName === 'I') {
          e.target.parentNode.blur()
        } else {
          e.target.blur()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .roles {
    .l1 {
      border-bottom: 1px dotted #ccc;
      padding: 5px 0;
    }
    .l2 {
      margin: 0 5px 5px 0;
    }
    .l3 {
      margin-right: 5px;
    }
  }
</style>
