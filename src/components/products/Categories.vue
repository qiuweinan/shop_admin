<template>
  <div class="Categories">
    <el-button type="success" plain>添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="categoryList" row-key="cat_id" v-loading="loading">
      <el-table-column label="角色名称" prop="cat_name"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot="{ row }">
          {{ row.cat_deleted ? "否" : '是'}}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" plain cricle icon="el-icon-edit" size="small"></el-button>
        <el-button type="danger" plain cricle icon="el-icon-delete" size="small"></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      loading: true
    }
  },
  created () {
    this.getcategoryList()
  },
  methods: {
    async getcategoryList () {
      this.loading = true
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          type: 3
        }
      })
      if (meta.status === 200) {
        console.log(data)
        this.categoryList = data.result
        this.total = data.total
        this.loading = false
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getcategoryList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getcategoryList()
    }
  }
}
</script>

<style>

</style>
