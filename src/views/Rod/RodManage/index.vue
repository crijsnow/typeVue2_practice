<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">一体杆名称：</div>
      <el-input v-model="params.poleName" placeholder="请输入一体杆名称" class="search-main" size="small" />
      <div class="search-label">一体杆编号：</div>
      <el-input v-model="params.poleNumber" placeholder="请输入一体杆编号" class="search-main" size="small" />
      <div class="search-label">运行状态：</div>
      <el-select v-model="params.poleStatus" placeholder="请选择运行状态" class="search-main" size="small">
        <el-option :value="0" :label="'正常'" />
        <el-option :value="1" :label="'异常'" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="getdata">查询</el-button>
    </div>
    <div class="btn-set">
      <el-button type="primary" class="input-btn" size="small" @click="add">添加一体杆</el-button>
      <el-button type="normal" class="input-btn" size="small" @click="delAll">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="datalist"
        tooltip-effect="dark"
        @selection-change="selectchange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          label="序号"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.$index + (params.page - 1) * params.pageSize + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="poleName"
          label="一体杆名称"
          width="160"
        />
        <el-table-column
          prop="poleNumber"
          label="一体杆编号"
          width="160"
        />
        <el-table-column
          prop="poleIp"
          label="一体杆IP"
          width="130"
        />
        <el-table-column
          prop="areaName"
          label="安装区域"
          width="160"
        />
        <el-table-column
          label="一体杆类型"
          prop="poleType"
          width="130"
        >
          <template #default="scope">
            {{ mapType(scope.row.poleType) }}
          </template>
        </el-table-column>
        <el-table-column
          label="运行状态"
          prop="poleStatus"
        >
          <template #default="scope">
            {{ mapStatus(scope.row.poleStatus) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <!-- <template #default="scope"> -->
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              @click="edit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
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
      <el-dialog
        :title="addForm.id?'编辑一体杆':'添加一体杆'"
        :visible="dialogVisible"
        width="580px"
        custom-class="dialog"
        @close="close"
      >
        <div class="form-container">
          <el-form ref="form" :model="addForm" :rules="rules">
            <el-form-item label="一体杆名称" prop="poleName" size="small">
              <el-input v-model="addForm.poleName" placeholder="请输入一体杆名称" size="small" />
            </el-form-item>
            <el-form-item label="一体杆编号" prop="poleNumber" size="small">
              <el-input v-model="addForm.poleNumber" placeholder="请输入一体杆编号" size="small" />
            </el-form-item>
            <el-form-item label="一体杆IP" prop="poleIp" size="small">
              <el-input v-model="addForm.poleIp" placeholder="请输入一体杆IP" size="small" />
            </el-form-item>
            <el-form-item label="关联区域" prop="areaId">
              <el-select v-model="addForm.areaId" placeholder="请选择关联区域" size="small">
                <el-option v-for="item in arealist" :key="item.id" :label="item.areaName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="一体杆类型" prop="poleType">
              <el-select v-model="addForm.poleType" placeholder="请选择一体杆类型" size="small">
                <el-option value="entrance" label="入口" />
                <el-option value="export" label="出口" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button size="mini" @click="close">取 消</el-button>
          <el-button size="mini" type="primary" @click="addrod">确 定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { get_arm, del, edit, add, get_area_list } from '@/apis/rod.js'
export default {
  name: 'Building',
  data() {
    return {
      datalist: [],
      dialogVisible: false,
      params: {
        page: 1,
        pageSize: 10,
        poleName: null,
        poleNumber: null,
        poleStatus: null
      },
      total: 10,
      addForm: {
        id: 0,
        poleName: '',
        poleNumber: '',
        poleIp: '',
        areaId: '',
        poleType: ''
      },
      rules: {
        poleName: [{ required: true, message: '请输入一体杆名称', trigger: 'blur' }],
        poleNumber: [{ required: true, message: '请输入一体杆编号', trigger: 'blur' }],
        poleIp: [
          { required: true, message: '请输入一体杆IP', trigger: 'blur' },
          { pattern: /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/, message: '请输入正确的IP', trigger: 'blur' }
        ],
        areaId: [{ required: true, message: '请选择关联区域', trigger: 'blur' }],
        poleType: [{ required: true, message: '请选择一体杆类型', trigger: 'blur' }]
      },
      arealist: [],
      select: []
    }
  },
  created() {
    this.getdata()
    this.getarea()
  },
  methods: {
    async getarea() {
      const res = await get_area_list()
      this.arealist = res.data.rows
    },
    async getdata() {
      const res = await get_arm(this.params)
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
        0: '正常',
        1: '异常'
      }
      return map[data]
    },
    mapType(data) {
      const map = {
        'entrance': '入口',
        'export': '出口',
        'center': '中央'
      }
      return map[data]
    },
    add() {
      this.dialogVisible = true
    },
    addrod() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          if (this.addForm.id) {
            const res = await edit(this.addForm)
            console.log(res)
          } else {
            const data = this.addForm
            delete data.id
            console.log(data)
            const res = await add(data)
            console.log(res)
          }
          this.$message.success(`${this.addForm.id ? '编辑成功' : '添加成功'}`)
          this.dialogVisible = false
          this.$refs.form.resetFields()
          this.addForm.id = 0
          this.getdata()
        }
      })
    },
    edit(row) {
      console.log(row)
      const { areaId, areaName, id, poleIp, poleName, poleNumber, poleType } = row
      this.addForm = { areaId, areaName, id, poleIp, poleName, poleNumber, poleType }
      this.dialogVisible = true
    },
    del(id) {
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
    delAll() {
      this.$confirm('确认要删除所有选中项吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const ids_arr = this.select.map(ele => ele.id)
        const ids = ids_arr.join(',')
        const res = await del(ids)
        console.log(res)
        this.$message.success(`${res.msg}`)
        this.getdata()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    close() {
      this.addForm.id = 0
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    selectchange(rows) {
      this.select = rows
      console.log(this.select)
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
  .form-container{
    width: 380px;
    height: 360px;
    margin: 20px auto;
  }
  ::v-deep .dialog{
    border-radius: 8px !important;
    .el-dialog__footer{
      background-color: #eee;
      border-radius: 0px 0px 8px 8px;
      .el-button{
        border-radius: 8px;
        height: 32px;
        width: 63px;
      }
    }
  }
</style>
