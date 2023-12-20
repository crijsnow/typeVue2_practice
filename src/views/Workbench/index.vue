<template>
  <div class="databoard-container">
    <div class="left">
      <div class="total-data">
        <div class="total-title">园区数据</div>
        <div class="total-data-display">
          <div class="item1"><span class="set1">年度累计收费（元）</span><span class="set2">{{ datalist.annualIncome }}</span></div>
          <div class="item1"><span class="set1">入驻企业总数（个）</span><span class="set2">{{ datalist.enterpriseTotal }}</span></div>
          <div class="item1"><span class="set1">月卡车辆总数（辆）</span><span class="set2">{{ datalist.monthCardTotal }}</span></div>
          <div class="item1"><span class="set1">一体杆总数（台）</span><span class="set2">{{ datalist.chargePoleTotal }}</span></div>
        </div>
      </div>
      <div class="data-watch">echarts登不上去，等以后echarts能上去了再写</div>
      <div class="lsattip">
        <p class="pset">合同临期提醒</p>
        <el-table
          style="width: 100%"
          :data="billist"
        >
          <el-table-column
            type="index"
            label="序号"
          >
            <template slot-scope="scope">
              {{ scope.$index + (params.page - 1) * params.pageSize + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            label="企业名称"
            width="300"
            prop="enterpriseName"
          />
          <el-table-column
            label="租赁楼宇"
            width="140"
            prop="buildingName"
          />
          <el-table-column
            label="租赁时间"
            width="180"
            prop="date"
          />
          <el-table-column
            label="操作"
          >
            <!-- <template #default="scope"> -->
            <template #default="scope">
              <el-button
                size="mini"
                type="text"
                @click="xuzurent(scope.row)"
              >续签</el-button>
              <el-button
                size="mini"
                type="text"
                @click="outrent(scope.row.id)"
              >退租</el-button>
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
        <el-dialog title="续租合同" :visible="dialogVisible" width="580px" custom-class="deep" @close="close1">
          <!-- 表单区域 -->
          <div class="form-container">
            <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
              <el-form-item label="租赁楼宇" prop="buildingId">
                <el-input v-model="rentForm.buildingName" disabled />
              </el-form-item>
              <el-form-item label="租赁起止日期" prop="rentTime">
                <el-date-picker
                  v-model="rentForm.rentTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  unlink-panels
                />
              </el-form-item>
              <el-form-item label="租赁合同" prop="contractId">
                <el-upload
                  action="#"
                  :http-request="uploadHandle"
                  :before-upload="beforeUpload"
                  :file-list="rentList"
                  :headers="{Authorization: `Bearer ${$store.state.user.token}`}"
                >
                  <el-button size="small" type="primary" plain>上传合同文件</el-button>
                  <div slot="tip" class="el-upload__tip">支持扩展名：.doc .pdf, 文件大小不超过5M</div>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
          <template #footer>
            <el-button size="mini" @click="close1">取 消</el-button>
            <el-button size="mini" type="primary" @click="create">确 定</el-button>
          </template>
        </el-dialog>
      </div>
    </div>
    <div class="right">
      <div class="quick-access">
        <div class="title">快捷入口</div>
        <div class="ul">
          <a class="small-box" href="/addenterprise">
            <img src="@/assets/add-enterprise.png" class="img">
            <p class="p">添加企业</p>
          </a>
          <a class="small-box" href="/sys/user">
            <img src="@/assets/employee-manage.png" class="img">
            <p class="p">员工管理</p>
          </a>
          <a class="small-box" href="/propety?workspace=true">
            <img src="@/assets/add-bill.png" class="img">
            <p class="p">添加账单</p>
          </a>
          <a class="small-box">
            <img src="@/assets/data-screen.png" class="img">
            <p class="p">数据大屏</p>
          </a>
        </div>
      </div>
      <div class="warning">
        <p class="title">设备告警派单</p>
        <div class="img-box">
          <img v-if="warninglist.length===0" class="img" src="@/assets/empty.svg">
          <div v-else class="list">2</div>
          <button class="button" @click="$router.push('/pole/waring')">更多<span class="el-icon-arrow-right" style="margin-left: 8px;" /></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { get_data, bill, outrent, upload, xuzu } from '@/apis/table.js'
export default {
  data() {
    return {
      datalist: {},
      billist: [],
      warninglist: [],
      dialogVisible: false,
      total: 0,
      params: {
        page: 1,
        pageSize: 5
      },
      rentForm: {
        buildingId: null, // 楼宇id
        buildingName: '',
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 1, // 合同类型
        rentTime: [] // 合同时间
      },
      rentList: [],
      rentRules: {
        buildingId: [{ required: true, message: '请选择楼宇', trigger: 'change' }],
        rentTime: [{ required: true, message: '请选择租赁日期', trigger: 'change' }],
        contractId: [{ required: true, message: '请上传合同文件' }]
      }
    }
  }, watch: {
    'rentForm.rentTime'(newv) {
      this.rentForm.startTime = newv[0]
      this.rentForm.endTime = newv[1]
      console.log(1)
    }
  },
  created() {
    this.getdata()
    this.getbill()
  },
  methods: {
    async getdata() {
      const res = await get_data()
      this.datalist = res.data
    },
    async getbill() {
      const res = await bill(this.params)
      this.billist = res.data.rows
      this.total = res.data.total
      this.billist.map(ele => {
        ele.date = `${ele.startTime}至${ele.endTime}`
        return ele
      })
    },
    pageChange(current) {
      this.params.page = current
      this.getdata()
    },
    xuzurent(row) {
      const { buildingId, buildingName, endTime, enterpriseId } = row
      const date = endTime.split('-')
      const newdate = `${date[0]}-${date[1]}-${Number(date[2]) + 1}`
      const newdate2 = `${date[0]}-${date[1]}-${Number(date[2]) + 2}`
      this.rentForm.rentTime = [newdate, newdate2]
      this.rentForm.buildingId = buildingId
      this.rentForm.buildingName = buildingName
      this.rentForm.startTime = newdate
      this.rentForm.enterpriseId = enterpriseId
      this.dialogVisible = true
      console.log(this.rentForm)
    },
    close1() {
      this.dialogVisible = false
      this.$refs.addForm.resetFields()
    },
    outrent(id) {
      this.$confirm('该操作无法取消，确认退租吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 1. 调用接口
        await outrent(id)
        // 2. 重新拉取列表
        this.getbill()
        this.$message({
          type: 'success',
          message: '退租成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    beforeUpload(file) {
      const allowImgType = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!allowImgType) {
        this.$message.error('上传合同文件只能是 .doc, .pdf 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传合同文件大小不能超过 5MB!')
      }
      return true
    },
    // 上传合同
    async uploadHandle(fileData) {
      // 1. 处理FormData
      const { file } = fileData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'contract')
      // 2. 上传并赋值
      const res = await upload(formData)
      const { id, url } = res.data
      console.log(res)
      this.rentForm.contractId = id
      this.rentForm.contractUrl = url
      this.rentList.push({ name: file.name, url: url })
      // 单独校验表单
      this.$refs.addForm.validateField('contractId')
    },
    create() {
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.rentForm))
          delete data.rentTime
          delete data.buildingName
          await xuzu(data)
          this.$message.success('续签成功！')
          this.getbill()
          this.close1()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .databoard-container{
    display: flex;
    justify-content: space-between;
    margin: 0px 20px;
    .left{
      width: 70%;
      min-width: 260px;
      margin-right: 20px;
      .total-data{
        background-color: rgb(255, 255, 255);
        padding: 20px;
        margin-bottom: 20px;
        min-width: 260px;
        .total-title{
          font-size: 14px;
          color: rgb(48, 48, 53);
          font-weight: 500;
          margin-bottom: 22px;
          line-height: 22px;
        }
        .total-data-display{
          display: flex;
          justify-content: space-between;
          .item1{
            display: flex;
            flex-direction: column;
            .set1{
              color: rgb(144, 147, 153);
              margin-bottom: 15px;
              font-size:14px;
            }
            .set2{
              color: rgb(48, 48, 53);
              font-weight: 700;
              font-size: 24px;
            }
          }
        }
      }
      .data-watch{
        background-color: #fff;
        padding: 20px;
        margin-bottom: 20px;
        min-width: 260px;
        color: #000000d9;
        font-size: 14px;
      }
      .lsattip{
        background-color: #fff;
        padding: 20px;
        margin-bottom: 20px;
        min-width: 260px;
        .pset{
          font-size: 14px;
          color: #303035;
          font-weight: 500;
          margin-bottom: 20px;
          margin-top: 0;
        }
        .page-container{
          text-align: right;
        }
      }
    }
    .right{
      width: calc(30% - 20px);
      min-width: 130px;
      .quick-access{
        background-color: #fff;
        padding: 20px;
        margin-bottom: 20px;
        min-width: 260px;
        .title{
          font-size: 14px;
          color: #303035;
          font-weight: 500;
          margin-bottom: 20px;
        }
        .ul{
          display: flex;
          justify-content: space-between;
          .small-box{
            width: 48px;
            display: flex;
            text-align: center;
            flex-direction: column;
            cursor: pointer;
            .img{
              width: 44px;
              height: 44px;
              margin-bottom: 9px;
            }
            p{
              font-size: 12px;
              line-height: 14px;
              font-weight: 500;
              white-space: nowrap;
              margin: 0 0;
            }
          }
        }
      }
      .warning{
        background-color: #fff;
        padding: 20px;
        margin-bottom: 20px;
        min-width: 260px;
        .title{
          font-size: 14px;
          color: #303035;
          font-weight: 500;
          margin-bottom: 20px;
          margin-top: 0;
        }
        .img-box{
          padding-left: 20px;
          text-align: center;
          .button{
            margin-top: 20px;
            font-size: 14px;
            width: 100%;
            border-radius: 22px!important;
            height: 36px;
            color: #fff;
            border-color: #4770ff;
            background: #4770FF;
            cursor: pointer;
          }
          .img{
            width: 160px;
            height: 160px;
          }
        }
      }
    }
  }
  .form-container{
    padding:0px 80px
  }
  ::v-deep .deep{
    border-radius: 8px;
    .ant-modal-root .ant-modal .ant-modal-content .ant-modal-footer{
      background-color: #eee;
    }
  }
</style>
