<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/addenterprise')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="datalist" @expand-change="expandHandle">
        <el-table-column type="index" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column label="联系电话" prop="contactNumber" />
        <el-table-column label="操作">
          <template #default="scoped">
            <el-button size="mini" type="text" @click="addrent(scoped.row.id)">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="$router.push(`/addenterprise?id=${scoped.row.id}`)">编辑</el-button>
            <el-button size="mini" type="text" @click="delitem(scoped.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template #default="{row}">
            <el-table :data="row.rentnow">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="startTime" />
              <el-table-column label="合同状态" prop="status">
                <template #default="scope">
                  <el-tag :type="renType(scope.row.status)">
                    {{ formatStatus(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button size="mini" type="text" @click="xuzurent">续租</el-button>
                  <el-button size="mini" type="text" :disabled="scope.row.status === 3" @click="outRent(scope.row.id)">退租</el-button>
                  <el-button size="mini" type="text" :disabled="scope.row.status !== 3" @click="delRent(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加合同" :visible="dialogVisible" width="580px" @close="dialogVisible=false">
        <!-- 表单区域 -->
        <div class="form-container">
          <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
            <el-form-item label="租赁楼宇" prop="buildingId">
              <el-select v-model="rentForm.buildingId" placeholder="请选择">
                <el-option
                  v-for="item in building"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="租赁起止日期" prop="rentTime">
              <el-date-picker
                v-model="rentForm.rentTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="租赁合同" prop="contractId">
              <el-upload
                action="#"
                :http-request="uploadHandle"
                :before-upload="beforeUpload"
                :file-list="rentList"
              >
                <el-button size="small" type="primary" plain>上传合同文件</el-button>
                <div slot="tip" class="el-upload__tip">支持扩展名：.doc .pdf, 文件大小不超过5M</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button size="mini" @click="dialogVisible=false">取 消</el-button>
          <el-button size="mini" type="primary" @click="create">确 定</el-button>
        </template>
      </el-dialog>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="pagechange"
      />
    </div>
  </div>
</template>

<script>
import { getlist, del, getrbuilding, upload, create_rent, get_rent_list, outrent, del_rent } from '@/apis/enterprise.js'

export default {
  data() {
    return {
      datalist: [],
      params: {
        page: 1,
        pageSize: 4,
        name: ''
      },
      dialogVisible: false,
      total: 0,
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      },
      rentRules: {
        buildingId: [{ required: true, message: '请选择楼宇', trigger: 'change' }],
        rentTime: [{ required: true, message: '请选择租赁日期', trigger: 'change' }],
        contractId: [{ required: true, message: '请上传合同文件' }]
      },
      building: [],
      rentList: [],
      xuzuflag: false
    }
  },
  async created() {
    this.List()
    const res = await getrbuilding()
    this.building = res.data
  },
  methods: {
    async List() {
      const res = await getlist(this.params)
      this.datalist = res.data.rows
      this.total = res.data.total
      // this.dataList = res.data?.rows.filter((item) => {
      //   this.$set(item, 'rentnow', [])
      // })

      this.datalist = res.data?.rows.map((item) => {
        return {
          ...item,
          rentnow: [] // 每一行补充存放合同的列表
        }
      })
    },
    pagechange(cur) {
      this.params.page = cur
      this.List()
    },
    search() {
      this.params.page = 1
      this.List()
    },
    delitem(id) {
      this.$confirm('确定删除该企业码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await del(id)
        this.List()
        this.$message({
          type: 'success',
          message: '删除成功!'
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
          const data = {
            ...this.rentForm,
            startTime: this.rentForm.rentTime[0],
            endTime: this.rentForm.rentTime[1]
          }
          delete data.rentTime
          console.log(data)
          if (this.xuzuflag) {
            data.type = 1
          } else {
            data.type = 0
          }
          await create_rent(data)
          this.dialogVisible = false
          this.$refs.addForm.resetFields()
          this.rentForm.contractUrl = ''
          this.rentForm.contractId = ''
          this.rentList = []
        }
      })
    },
    addrent(id) {
      this.xuzuflag = false
      this.dialogVisible = true
      this.rentForm.enterpriseId = id
    },
    async expandHandle(row, rows) {
      console.log(1)
      // rows 中包含当前展开行数据，说明是展开状态
      const isExpend = rows.find(item => item.id === row.id)
      // 因为展开/关闭都会触发此事件函数，做个判断只有展开时获取数据
      if (isExpend) {
        this.rentForm.enterpriseId = isExpend.id
        console.log(2)
        const res = await get_rent_list(row.id)
        // eslint 警告说：row.rentList 可能会被重新分配数据，所以加上下面一行注释，暂时关闭 eslint 警告提示
        // eslint-disable-next-line require-atomic-updates
        this.datalist.map(ele => {
          if (ele.id === row.id) {
            res.data.forEach(obj => {
              ele.rentnow.push(obj)
            })
            // ele.rentnow.concat(res.data)
          }
        })
      }
    },
    renType(status) {
      const MAP = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      // return 格式化之后的中文显示
      return MAP[status]
    },
    formatStatus(status) {
      const TYPEMAP = {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      }
      return TYPEMAP[status]
    },
    outRent(id) {
      this.$confirm('确认退租吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 1. 调用接口
        await outrent(id)
        // 2. 重新拉取列表
        this.List()
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
    async delRent(id) {
      this.$confirm('确定删除该合同吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await del_rent(id)
        this.List()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    async xuzurent() {
      this.xuzuflag = true
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container {
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
  padding:0px 80px;
}
</style>
