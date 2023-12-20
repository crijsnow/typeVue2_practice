<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.enterpriseName" clearable placeholder="请输入企业名称" class="search-main" size="small" />
      <div class="search-label">缴费时间：</div>
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="small"
        value-format="yyyy-MM-dd"
      />
      <div class="btn1">
        <el-button type="primary" size="small" @click="getlist">查询</el-button>
      </div>
    </div>
    <div class="create-container">
      <el-button type="primary" size="small" @click="open">添加账单</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="datalist">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column label="账单编号" width="160" prop="billNumber" />
        <el-table-column label="企业名称" width="180" prop="enterpriseName" />
        <el-table-column label="租赁楼宇" width="100" prop="buildingName" />
        <el-table-column label="物业费(元/m²)" width="120" prop="propertyFeePrice" />
        <el-table-column label="账单金额(元)" width="120" prop="paymentAmount" />
        <el-table-column label="缴费时间" prop="createTime" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text" @click="open(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="looks(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="pageChange"
      />
    </div>
    <!-- 添加员工 -->
    <el-dialog
      title="添加账单"
      width="600px"
      :visible="dialogVisible"

      @close="close"
    >
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="rules" label-width="auto">
          <el-form-item label="选择租户" prop="enterpriseId">
            <el-select v-model="addForm.enterpriseId" placeholder="请选择租户">
              <el-option
                v-for="item in enterpriselist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="选择楼宇" prop="buildingId">
            <el-select v-model="addForm.buildingId" placeholder="请选择租赁楼宇">
              <el-option
                v-for="item in buildlist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="缴费周期" prop="date">
            <el-date-picker
              v-model="addForm.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="支付金额" prop="paymentAmount">
            <el-input v-model="addForm.paymentAmount" placeholder="请输入支付金额" size="small" :disabled="true" :value="price" />
          </el-form-item>
          <el-form-item label="支付方式" prop="paymentMethod">
            <el-select v-model="addForm.paymentMethod" placeholder="请选择支付方式" size="small">
              <el-option :value="1" label="微信" />
              <el-option :value="2" label="支付宝" />
              <el-option :value="3" label="现金" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="close">取 消</el-button>
        <el-button size="mini" type="primary" @click="upload">确 定</el-button>
      </template>
    </el-dialog>
    <el-dialog
      title="查看账单"
      width="580px"
      :visible="look"
      :custom-class="'set'"
      @close="look=false"
    >
      <div class="box">
        <div class="row">
          <div class="left">租户名称:</div>
          <div class="right">{{ looklist.enterpriseName }}</div>
        </div>
        <div class="row">
          <div class="left">租赁楼宇:</div>
          <div class="right">{{ looklist.buildingName }}</div>
        </div>
        <div class="row">
          <div class="left">缴费周期:</div>
          <div class="right">{{ `${looklist.startTime}至${looklist.endTime}` }}</div>
        </div>
        <div class="row">
          <div class="left">物业费(元/m²):</div>
          <div class="right">{{ looklist.propertyFeePrice }}</div>
        </div>
        <div class="row">
          <div class="left">账单金额(元):</div>
          <div class="right">{{ looklist.paymentAmount }}</div>
        </div>
        <div class="row">
          <div class="left">支付方式:</div>
          <div class="right">{{ looklist.paymentMethodValue }}</div>
        </div>
        <div class="row">
          <div class="left">缴费时间:</div>
          <div class="right">{{ looklist.createTime }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { get_list, get_building, get_enterprise, get_price, add_property, edit_property, del, get_detail } from '@/apis/property.js'
export default {
  name: 'Employee',
  data() {
    return {
      datalist: [],
      buildlist: [],
      enterpriselist: [],
      date: '',
      params: {
        enterpriseName: null,
        start: null,
        end: null,
        page: 1,
        pageSize: 10
      },
      total: 0,
      price: 0,
      addForm: {
        id: null,
        enterpriseId: null, // 企业id
        buildingId: null, // 楼宇id
        startTime: '',
        endTime: '',
        paymentAmount: null,
        paymentMethod: null,
        date: ''
      },
      dialogVisible: false,
      look: false,
      rules: {
        enterpriseId: [{ required: true, message: '请选择租户', trigger: 'blur' }],
        buildingId: [{ required: true, message: '请选择楼宇', trigger: 'blur' }],
        date: [{ required: true, message: '请选择租赁时间', trigger: 'blur' }],
        paymentAmount: [{ required: true, message: '请填入金额', trigger: 'blur' }],
        paymentMethod: [{ required: true, message: '请选择支付方式', trigger: 'blur' }]
      },
      looklist: {
        enterpriseName: '',
        buildingName: '',
        startTime: '',
        endTime: '',
        propertyFeePrice: '',
        paymentAmount: '',
        paymentMethodValue: '',
        createTime: ''
      }
    }
  },
  watch: {
    date(newvalue) {
      const arr = newvalue.slice(' ')
      if (arr[0] !== '') this.params.start = arr[0]
      else this.params.start = null
      if (arr[1] !== '') this.params.end = arr[1]
      else this.params.end = null
    },
    async 'addForm.date'(newvalue) {
      this.addForm.startTime = newvalue[0]
      this.addForm.endTime = newvalue[1]
      if (this.addForm.buildingId) {
        const res = await get_price({
          buildingId: this.addForm.buildingId,
          startTime: this.addForm.startTime,
          endTime: this.addForm.endTime
        })
        this.addForm.paymentAmount = res.data
      }
    }
  },
  created() {
    this.getlist()
    this.getbuild()
    this.getenter()
    if (this.$route.query.workspace) this.dialogVisible = true
  },
  methods: {
    async getlist() {
      const res = await get_list(this.params)
      this.datalist = res.data.rows
      this.total = res.data.total
    },
    async getbuild() {
      const res = await get_building()
      this.buildlist = res.data
    },
    async getenter() {
      const res = await get_enterprise()
      this.enterpriselist = res.data
      console.log(this.enterpriselist)
    },
    pageChange(current) {
      this.params.page = current
      this.getlist()
    },
    close() {
      this.dialogVisible = false
      this.addForm.id = null
      this.$refs.addForm.resetFields()
    },
    mapState(data) {
      const map = {
        0: '未启用',
        1: '启用'
      }
      return map[data]
    }, del(id) {
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await del(id)
        console.log(res)
        this.$message.success(`${res.msg}`)
        this.getdata()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    upload() {
      this.$refs.addForm.validate((valid) => {
        console.log(this.addForm)
        if (valid) {
          if (this.addForm.id) {
            const data = JSON.parse(JSON.stringify(this.addForm))
            delete data.date
            edit_property(data)
          } else {
            const data = JSON.parse(JSON.stringify(this.addForm))
            delete data.id
            delete data.date
            add_property(data)
          }
          this.$message.success(this.addForm.id ? '编辑成功' : '添加成功')
          this.close()
        }
      })
    },
    open(row) {
      if (row.id) {
        const { id, enterpriseId, buildingId, startTime, endTime, paymentAmount, paymentMethod } = row
        const date = [startTime, endTime]
        this.addForm = { id, enterpriseId, buildingId, startTime, endTime, paymentAmount, paymentMethod, date }
      }
      this.dialogVisible = true
    },
    async looks(row) {
      const res = await get_detail(row.id)
      this.looklist = res.data
      console.log(this.looklist)
      this.look = true
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
    font-size: 14px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container{
  width: 360px;
  padding:0px 50px;
}
.btn1{
  margin: 0 20px;
}
::v-deep .set{
  width: 580px ;
  border-radius: 8px;
}
.box{
  width: 420px;
  height: 310px;
  margin: 15px auto;
  .row{
    display: flex;
    height: 44px;
    .left{
      width: 130px;
      line-height: 22px;
      font-size: 14px;
      color:#909399;
      text-align: right;
      padding-right: 5px;
    }
    .right{
      width:290px;
      line-height: 22px;
      font-size: 14px;
    }
  }
}
</style>
