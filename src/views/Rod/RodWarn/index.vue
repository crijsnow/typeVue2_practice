<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">一体杆名称：</div>
      <el-input v-model="params.poleName" placeholder="请输入一体杆名称" class="search-main" size="small" />
      <div class="search-label">一体杆编号：</div>
      <el-input v-model="params.poleNumber" placeholder="请输入一体杆编号" class="search-main" size="small" />
      <div class="search-label">处置状态：</div>
      <el-select v-model="params.handleStatus" placeholder="请选择处置状态" class="search-main" size="small">
        <el-option value="0" label="未派单" />
        <el-option value="1" label="已派单" />
        <el-option value="2" label="已接单" />
        <el-option value="3" label="已完成" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="getdata">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="datalist"
      >
        <el-table-column
          label="序号"
          width="160"
        >
          <template slot-scope="scope">
            {{ scope.$index + (params.page - 1) * params.pageSize + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="poleName"
          label="一体杆名称"
          width="180"
        />
        <el-table-column
          prop="poleNumber"
          label="一体杆编号"
          width="160"
        />
        <el-table-column
          prop="errorType"
          label="故障类型"
          width="150"
        />
        <el-table-column
          prop="handleStatus"
          label="处置状态"
          width="130"
        >
          <template #default="scope">
            {{ mapStatus(scope.row.handleStatus) }}
          </template>
        </el-table-column>
        <el-table-column
          label="告警时间"
          prop="warningTime"
          width="180"
        />
        <el-table-column
          label="操作"
        >
          <!-- <template #default="scope"> -->
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              :disabled="scope.row.handleStatus!==0"
              @click="open(scope.row.id,false)"
            >派单</el-button>
            <el-button
              size="mini"
              type="text"
              @click="open(scope.row.id,true)"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              :disabled="scope.row.handleStatus!==3"
              @click="del(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-container">
        <el-pagination
          layout="total, prev, pager, next"
          :total="total"
          :page-size="params.pageSize"
          @current-change="pageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { get_list, del_ } from '@/apis/warning.js'
export default {
  name: 'Building',
  data() {
    return {
      datalist: [],
      params: {
        page: 1,
        pageSize: 10,
        poleName: null,
        poleNumber: null,
        handleStatus: null
      },
      total: 0
    }
  },
  created() {
    this.getdata()
  },
  methods: {
    async getdata() {
      const res = await get_list(this.params)
      this.datalist = res.data.rows
      this.total = res.data.total
      console.log(this.datalist)
    },
    pageChange(current) {
      console.log(current)
      this.params.page = current
      this.getdata()
    },
    mapStatus(data) {
      const map = {
        0: '未派单',
        1: '已派单',
        2: '已接单',
        3: '已完成'
      }
      return map[data]
    },
    open(id, isfinish) {
      this.$router.push(`/addordetail?id=${id}&istrue=${isfinish}`)
    },
    del(id) {
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await del_(id)
        console.log(res)
        this.$message.success(`${res.msg}`)
        this.getdata()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container{
  padding:10px;
}
.btn-set{
    height: 52px;
    padding: 10px 16px;
}
.search-container{
  display: flex;
  align-items:center;
  border-bottom: 1px solid rgb(237,237,237,.9);;
  padding-bottom: 20px;
  // vertical-align: middle;
  .search-label{
    text-align: center;
    width:90px;
    font-size: 14px;
  }
  .search-main{
      display: inline-block;
      margin-right: 10px;
      width: 220px;
      height: 32px;
      padding: -1px 11px;
      font-size: 14px;
      line-height: 1.5715;
  }
  .search-btn{
    padding: 7px 18px;
    width: 64px;
    height: 32px;
  }
}
  .page-container{
    padding:4px 0px;
    text-align: right;
  }
</style>
