<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">车牌号码：</div>
      <el-input v-model="params.carNumber" placeholder="请输入车牌号码" class="search-main" size="small" />
      <div class="search-label">缴纳状态：</div>
      <el-select v-model="params.paymentStatus" placeholder="未选择" class="search-main" size="small">
        <el-option value="0" label="未缴纳" />
        <el-option value="1" label="已缴纳" />
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
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.$index + (params.page - 1) * params.pageSize + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="carNumber"
          label="车牌号码"
          width="130"
        />
        <el-table-column
          prop="chargeType"
          label="收费类型"
          width="120"
        >
          <template #default="scope">
            {{ mapType(scope.row.chargeType) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="parkingTime"
          label="停车总时长"
          width="130"
        />
        <el-table-column
          prop="actualCharge"
          label="缴纳费用(元)"
          width="130"
        />
        <el-table-column
          label="缴纳状态"
          prop="paymentStatus"
          width="130"
        >
          <template #default="scope">
            {{ mapStatus(scope.row.paymentStatus) }}
          </template>
        </el-table-column>
        <el-table-column
          label="缴纳方式"
          prop="paymentMethod"
        >
          <template #default="scope">
            {{ mapSide(scope.row.paymentMethod) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="paymentTime"
          label="缴纳时间"
          width="220"
        />
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
import { get_list } from '@/apis/carpay.js'
export default {
  name: 'Building',
  data() {
    return {
      datalist: [],
      params: {
        page: 1,
        pageSize: 10,
        carNumber: null,
        paymentStatus: null
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
    mapType(data) {
      const map = {
        'card': '月卡',
        'temp': '临时停车'
      }
      return map[data]
    },
    mapStatus(data) {
      const map = {
        0: '未缴纳',
        1: '已缴纳'
      }
      return map[data]
    },
    mapSide(data) {
      const map = {
        'Alipay': '支付宝',
        'WeChat': '微信',
        'Cash': '线下',
        null: '--'
      }
      return map[data]
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
