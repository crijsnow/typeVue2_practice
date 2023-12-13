<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="input_num" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">车主姓名：</span>
      <el-input v-model="input_name" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">状态：</span>
      <el-select v-model="input_status">
        <el-option v-for="item in optionlist" :key="item.id" :value="item.id" :label="item.name" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="search">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/addcard')">添加月卡</el-button>
      <el-button @click="delall(select)">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="datalist"
        @selection-change="selectChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column type="index" label="序号" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column label="状态" prop="cardStatus" :formatter="mapStatus" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scoped">
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="edit(scoped.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delc(scoped.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="params.pageSize" @current-change="pagechange" />
    </div>
  </div>
</template>

<script>
import { card, del, delAll } from '@/apis/card.js'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      datalist: [],
      params: {
        page: 1,
        pageSize: 2
      },
      input_num: '',
      input_name: '',
      input_status: null,
      total: 0,
      optionlist: [
        { id: null, name: '全部' },
        { id: 0, name: '可用' },
        { id: 1, name: '已过期' }
      ],
      select: []
    }
  },
  async mounted() {
    this.getCardList()
  },
  methods: {
    async getCardList(pa = this.params) {
      const res = await card(pa)
      this.datalist = res.data.rows
      this.total = res.data.total
      console.log(res)
    },
    mapStatus(row) {
      const MAP = {
        0: '可用',
        1: '已过期'
      }
      return MAP[row.cardStatus]
    },
    pagechange(page) {
      this.params.page = page
      this.getCardList()
    },
    search() {
      this.params.page = 1
      const search_params = {
        ...this.params,
        carNumber: this.input_num,
        personName: this.input_name,
        cardStatus: this.input_status
      }
      console.log(search_params)
      this.getCardList(search_params)
    },
    edit(id) {
      this.$router.push(`/addcard?id=${id}`)
    },
    async delc(id) {
      this.$confirm('此操作将永久删除该月卡, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await del(id)
        Message.success('删除成功')
        this.getCardList()
      }).catch((error) => {
        console.log(error)
      })
    },
    selectChange(rowList) {
      console.log(rowList)
      this.select = rowList
    },
    async delall(ids) {
      if (this.select.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的月卡!'
        })
      } else {
        this.$confirm('此操作将永久删除选择的月卡, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await delAll(ids.map(ele => ele.id))
          this.getCardList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;

  .search-main {
    width: 220px;
    margin-right: 10px;
  }

  .search-btn {
    margin-left: 20px;
  }
}

.create-container {
  margin: 10px 0px;
}

.page-container {
  padding: 4px 0px;
  text-align: right;
}

.form-container {
  padding: 0px 80px;
}
</style>
