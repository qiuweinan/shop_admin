<template>
  <div class="goods-add">
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step :title="t1" description="基本信息"></el-step>
      <el-step :title="t2" description="商品图片"></el-step>
      <el-step :title="t3" description="商品内容"></el-step>
    </el-steps>
    <!-- tab栏 -->
  <el-tabs tab-position="left" v-model="activeTab" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="0">
      <el-form :model="form" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="form.goods_name" placeholder="请输出商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="form.goods_price" placeholder="请输出商品价格"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="form.goods_number" placeholder="请输出商品数量"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="form.goods_weight" placeholder="请输出商品数量"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-cascader
          :props="props"
          v-model="form.goods_cat"
          :options="options">
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="next">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="1">
      <el-upload
        multiple
        action="http://localhost:8888/api/private/v1/upload"
        list-type="picture-card"
        name="file"
        :headers="headers"
        :on-success="handleSuccess">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url" alt=""
            >
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
      </el-upload>
      <el-button type="primary" @click="next">下一步</el-button>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="2">
      <quill-editor v-model="form.goods_introduce"></quill-editor>
      <el-button type="primary" @click="addGood">添加</el-button>
    </el-tab-pane>
  </el-tabs>
  <!-- 图标放大 -->
  <el-dialog :visible.sync="dialogVisible">
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 预览图片的列表
      fileList: [],
      active: 0,
      activeTab: '0',
      t1: '',
      t2: '',
      t3: '',
      form: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: []
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      dialogImageUrl: '',
      dialogVisible: false,
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  async created () {
    const res = await this.$axios.get('categories?type=3')
    if (res.meta.status === 200) {
      // console.log(res)
      this.options = res.data
    }
  },
  watch: {
    active: {
      immediate: true,
      handler (value) {
        if (value === 0) {
          this.t1 = '进行中'
          this.t2 = '未完成'
          this.t3 = '未完成'
        }
        if (value === 1) {
          this.t1 = '已完成'
          this.t2 = '进行中'
          this.t3 = '未完成'
        }
        if (value === 2) {
          this.t1 = '已完成'
          this.t2 = '已完成'
          this.t3 = '进行中'
        }
      }
    }
  },
  methods: {
    handleClick (tab) {
      // console.log(tab)
      this.active = +tab.index
    },
    next () {
      this.active++
      this.activeTab = this.active + ''
    },
    handleSuccess (res, file, fileList) {
      // console.log(res, file, fileList)
      this.form.pics.push({
        pic: res.data.tmp_path
      })
      this.fileList = fileList
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove (file) {
      // console.log(file)
      let path = file.response.data.tmp_path
      this.form.pics = this.form.pics.filter(item => item.pic !== path)
      // 把fileList中的文件也删除
      const idx = this.fileList.findIndex(item => item.uid === file.uid)
      this.fileList.splice(idx, 1)
    },
    async addGood () {
      const res = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      const { status, msg } = res.meta
      if (status === 201) {
        // 成功跳转到goods
        this.$message.success(msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/*
  1. 给当前组件中所有的元素添加了一个自定义属性  data-v-123iouskd(仅限于模板中的)
  2. 给当前组件中写的所有的样式也添加 一个自定义的属性选择器 .ql-editor[data-v-123iouskd]

  >>>     css本身支持
  /deep/  less支持
  ::v-deep  sass
*/
.quill-editor {
  background-color: #fff;

  ::v-deep .ql-editor {
    height: 300px;
  }
}
</style>
