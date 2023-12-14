<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">楼宇名称：</div>
      <el-input v-model="params.name" placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="search">查询</el-button>
      <el-button type="primary" @click="dialogVisible=true">添加楼宇</el-button>
      <el-button @click="exportexcal">导出Excal</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="buildingList"
      >
        <el-table-column
          type="index"
          label="序号"
        />
        <el-table-column
          label="楼宇名称"
          width="180"
          prop="name"
        />
        <el-table-column
          label="层数"
          prop="floors"
        />
        <el-table-column
          label="在管面积(m²)"
          width="120"
          prop="area"
        />
        <el-table-column
          label="物业费(元/m²)"
          width="120"
          prop="propertyFeePrice"
        />
        <el-table-column
          label="状态"
          prop="status"
        >
          <template #default="scope">
            {{ formatStatus(scope.row.status) }}
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
        title="添加楼宇"
        :visible="dialogVisible"
        width="580px"
        @close="dialogVisible=false"
      >
        <div class="form-container">
          <el-form ref="form" :model="add" :rules="rules">
            <el-form-item label="楼宇名称" prop="name">
              <el-input v-model="add.name" />
            </el-form-item>
            <el-form-item label="楼宇层数" prop="floors">
              <el-input v-model="add.floors" />
            </el-form-item>
            <el-form-item label="在管面积" prop="area">
              <el-input v-model="add.area" />
            </el-form-item>
            <el-form-item label="物业费" prop="propertyFeePrice">
              <el-input v-model="add.propertyFeePrice" />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getBuildingList, create, deleteI, editI } from '@/apis/buildings.js'
import { Message } from 'element-ui'
import { utils, writeFileXLSX } from 'xlsx'
export default {
  name: 'Building',
  data() {
    return {
      buildingList: [],
      params: {
        page: 1,
        pageSize: 10,
        name: ''
      },
      add: {
        name: '',
        floors: '',
        area: '',
        propertyFeePrice: '',
        id: ''
      },
      rules: {
        name: [{ required: true, message: '请输入楼宇名称', trigger: 'blur' }],
        floors: [{ required: true, message: '请输入楼宇层数', trigger: 'blur' }],
        area: [{ required: true, message: '请输入楼宇面积', trigger: 'blur' }],
        propertyFeePrice: [{ required: true, message: '请输入楼宇物业费', trigger: 'blur' }]
      },
      dialogVisible: false,
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await getBuildingList(this.params)
      console.log(res)
      if (res.data.rows) {
        this.buildingList = res.data.rows
        this.total = res.data.total
      } else Message(res.msg)
    },
    formatStatus(data) {
      const map = {
        0: '租赁中',
        1: '闲置中'
      }
      return map[data]
    },
    pageChange(page) {
      this.params.page = page
      this.getList()
    },
    search() {
      this.params.page = 1
      this.getList()
    },
    confirm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          if (this.add.id) {
            const res = await editI(this.add)
            console.log(res)
          } else {
            const res = await create(this.add)
            console.log(res)
          }
        }
      })
      this.dialogVisible = false
      this.getList()
    },
    async del(id) {
      this.$confirm('确认删除当前楼宇吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteI(id)
        this.getList()
      }).catch((err) => {
        console.error(err)
      })
    },
    edit(row) {
      this.dialogVisible = true
      const { id, area, floors, name, propertyFeePrice } = row
      this.add = {
        id, area, floors, name, propertyFeePrice
      }
    },
    async exportexcal() {
      const res = await getBuildingList({
        page: 1,
        pageSize: this.total
      })
      const x_rosia = ['序号', '楼宇名称', '层数', '在管面积(m²)', '物业费(元/m²)', '状态']
      const tableHeader = ['index', 'name', 'floors', 'area', 'propertyFeePrice', 'status']
      const sheetData = res.data.rows.map((item, index) => {
        const obj = {}
        tableHeader.forEach(key => {
          if (key === 'index') {
            obj[key] = index + 1
          } else if (key === 'status') {
            obj[key] = this.formatStatus(item[key])
          } else {
            obj[key] = item[key]
          }
        })
        return obj
      })
      // 创建一个工作表
      const worksheet = utils.json_to_sheet(sheetData)
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      // 把工作表添加到工作簿
      utils.book_append_sheet(workbook, worksheet, 'Data')
      // 改写表头
      utils.sheet_add_aoa(worksheet, [x_rosia], { origin: 'A1' })
      writeFileXLSX(workbook, 'SheetJSVueAoO.xlsx')
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container{
  padding:10px;
}
.search-container{
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237,237,237,.9);;
  padding-bottom: 20px;
  .search-label{
    width:100px;
  }
  .search-main{
    width: 220px;
    margin-right: 10px;
  }
}
  .page-container{
    padding:4px 0px;
    text-align: right;
  }
</style>
