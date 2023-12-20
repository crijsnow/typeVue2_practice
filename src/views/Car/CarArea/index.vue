<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="btn-set">
      <el-button type="primary" class="input-btn" size="small" @click="open">添加区域</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        tooltip-effect="dark"
        :data="datalist"
      >
        <!-- <el-table-column
          type="selection"
          width="55"
        /> -->
        <el-table-column
          label="序号"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.$index + (params.page - 1) * params.pageSize + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="areaName"
          label="区域名称"
          width="180"
        />
        <el-table-column
          prop="spaceNumber"
          label="车位数(个)"
          width="180"
        />
        <el-table-column
          prop="areaProportion"
          label="面积（㎡）"
          width="160"
        />
        <el-table-column
          prop="ruleName"
          label="计费规则"
          width="160"
        />
        <el-table-column
          label="备注"
          prop="remark"
          width="160"
        />
        <el-table-column
          label="操作"
        >
          <!-- <template #default="scope"> -->
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              @click="open(scope.row)"
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
        :title="addForm.id?'编辑区域':'添加区域'"
        :visible="dialogVisible"
        width="580px"
        @close="close"
      >
        <div class="form-container">
          <el-form ref="form" :model="addForm" :rules="rules">
            <el-form-item prop="areaName" label="区域名称">
              <el-input v-model="addForm.areaName" placeholder="请输入区域名称" size="small" />
            </el-form-item>
            <el-form-item prop="spaceNumber" label="车位数(个)">
              <el-input v-model="addForm.spaceNumber" placeholder="请输入车位个数" size="small" />
            </el-form-item>
            <el-form-item prop="areaProportion" label="面积（㎡）">
              <el-input v-model="addForm.areaProportion" placeholder="请输入面积" size="small">
                <template #suffix>㎡</template>
              </el-input>
            </el-form-item>
            <el-form-item prop="ruleId" label="关联计费规则">
              <el-select v-model="addForm.ruleId" placeholder="请选择" size="small">
                <el-option v-for="item in droplist" :key="item.ruleId" :value="item.ruleId" :label="item.ruleName" />
              </el-select>
            </el-form-item>
            <el-form-item prop="remark" label="注释">
              <el-input v-model="addForm.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-form>

        </div>
        <template #footer>
          <el-button size="mini" @click="close">取 消</el-button>
          <el-button size="mini" type="primary" @click="add_put">确 定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { get_list, drop, add_new, del, edit } from '@/apis/area.js'
export default {
  name: 'Building',
  data() {
    return {
      datalist: [],
      dialogVisible: false,
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      droplist: [],
      addForm: {
        id: null,
        areaName: '',
        spaceNumber: 0,
        areaProportion: 0,
        ruleId: 0,
        remark: ''
      },
      rules: {
        areaName: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
        spaceNumber: [{ required: true, message: '请输入车位个数', trigger: 'blur' }],
        areaProportion: [{ required: true, message: '请输入区域面积', trigger: 'blur' }],
        ruleId: [{ required: true, message: '请选择计费方式', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getlist()
    this.getdrop()
  },
  methods: {
    async getlist() {
      const res = await get_list(this.params)
      this.datalist = res.data.rows
      this.total = res.data.total
    },
    async getdrop() {
      const res = await drop()
      this.droplist = res.data
    },
    pageChange(current) {
      this.params.page = current
      this.getlist()
    },
    close() {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    add_put() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          if (this.addForm.id) {
            await edit(this.addForm)
          } else {
            await add_new(this.addForm)
          }
          this.$message.success(`${this.addForm.id ? '修改成功' : '添加成功'}`)
          this.dialogVisible = false
          this.$refs.form.resetFields()
          this.getlist()
        }
      })
    },
    open(row) {
      const { id, areaName, spaceNumber, areaProportion, ruleId, remark } = row
      this.addForm = { id, areaName, spaceNumber, areaProportion, ruleId, remark }
      this.dialogVisible = true
    },
    async del(id) {
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await del(id)
        console.log(res)
        this.$message.success(`${res.msg}`)
        this.getlist()
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
    .form-container{
    width: 380px;
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
