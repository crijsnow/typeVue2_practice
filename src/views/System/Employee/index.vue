<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" size="small" />
      <el-button type="primary" size="small" @click="getlist">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" size="small" @click="open">添加员工</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="datalist">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column label="员工姓名" width="140" prop="name" />
        <el-table-column label="登录账号" width="140" prop="userName" />
        <el-table-column label="联系方式" width="120" prop="phonenumber" />
        <el-table-column label="角色" width="120" prop="roleName" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            {{ mapState(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text" @click="open(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
            <el-button size="mini" type="text" @click="reset(scope.row.id)">重置密码</el-button>
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
      title="添加员工"
      width="480px"
      :visible="dialogVisible"
      @close="dialogVisible=false"
    >
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="addForm.userName" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phonenumber">
            <el-input v-model="addForm.phonenumber" />
          </el-form-item>
          <el-form-item label="默认密码">
            <span>123456</span>
          </el-form-item>
          <el-form-item label="分配角色" prop="roleId">
            <el-select v-model="addForm.roleId" placeholder="请选择角色">
              <el-option
                v-for="item in rolelist"
                :key="item.id"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="close">取 消</el-button>
        <el-button size="mini" type="primary" @click="update">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { get_list, get_role, add, edit, del_, reset } from '@/apis/workers.js'
export default {
  name: 'Employee',
  data() {
    return {
      datalist: [],
      params: {
        name: null,
        page: 1,
        pageSize: 10
      },
      total: 0,
      addForm: {
        id: null,
        name: '',
        userName: '',
        roleId: 2,
        roleName: '',
        status: 0,
        phonenumber: ''
      },
      dialogVisible: false,
      rolelist: [],
      rules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请分配角色', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择员工状态', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'addForm.roleId'(newvalue) {
      const data = this.rolelist.find(ele => ele.roleId === newvalue)
      this.addForm.roleName = data.roleName
    }
  },
  created() {
    this.getlist()
    this.getrole()
  },
  methods: {
    async getlist() {
      const res = await get_list(this.params)
      this.datalist = res.data.rows
      this.total = res.data.total
    },
    async getrole() {
      const res = await get_role()
      this.rolelist = res.data
      console.log(this.rolelist)
    },
    pageChange(current) {
      this.params.page = current
      this.getlist()
    },
    open(row) {
      this.dialogVisible = true
      if (row.id) {
        const { id, name, userName, roleId, roleName, status, phonenumber } = row
        this.addForm = { id, name, userName, roleId, roleName, status, phonenumber }
      }
    },
    update() {
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          console.log(this.addForm)
          if (this.addForm.id) {
            await edit(this.addForm)
          } else {
            const data = this.addForm
            delete data.id
            await add(data)
          }
          this.$message.success(this.addForm.id ? '编辑完成' : '添加完成')
          this.$refs.addForm.resetFields()
          this.dialogVisible = false
          this.addForm.id = null
          this.getlist()
        }
      })
    },
    close() {
      this.dialogVisible = false
      this.addForm.id = null
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
        const res = await del_(id)
        console.log(res)
        this.$message.success(`${res.msg}`)
        this.getdata()
      })
    },
    reset(id) {
      this.$confirm('确认要重置该用户密码吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await reset({ id })
        console.log(res)
        this.$message.success(`${res.msg}`)
        this.getdata()
      })
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
  padding:0px 80px;
}
</style>
