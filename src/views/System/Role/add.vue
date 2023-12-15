<template>
  <div class="add-role">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>{{ form1.roleId?'编辑角色':'添加角色' }}</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="step-container">
        <el-steps direction="vertical" :active="activeStep" space="80px" finish-status="success">
          <el-step>
            <template #title>
              <span :style="style">角色信息</span>
            </template>
          </el-step>
          <el-step>
            <template #title>
              <span :style="style">权限信息</span>
            </template>
          </el-step>
          <el-step>
            <template #title>
              <span :style="style">检查并完成</span>
            </template>
          </el-step>
        </el-steps>
      </div>
      <div v-show="activeStep === 1" class="form-container">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form ref="form1" class="form-box" :model="form1" :rules="rules1">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="form1.roleName" />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="form1.remark" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="activeStep === 2" class="form-container">
        <div class="title">权限配置</div>
        <div class="form">
          <div class="tree-wrapper">
            <div v-for="item in treelist" :key="item.id" class="tree-item">
              <div class="tree-title">{{ item.title }}</div>
              <el-tree
                ref="tree"
                :data="item.children"
                show-checkbox
                default-expand-all
                check-strictly
                node-key="id"
                highlight-current
                :props="{ label: 'title' }"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="activeStep === 3" class="form-container">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ form1.roleName }}</div>
            <div class="form-item">角色描述：{{ form1.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="item in treelist" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="diabledTree"
                  :data="item.children"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  :highlight-current="false"
                  :props="{ label: 'title',disabled:()=>true}"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button v-if="activeStep > 1" @click="decreseStep">上一步</el-button>
        <el-button v-if="activeStep < 3" type="primary" @click="increseStep">下一步</el-button>
        <el-button v-if="activeStep === 3" type="primary" @click="setnewrole">{{ form1.roleId?'确认修改':'添加角色' }}</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { get_all_tree, set_new_role, change_role, get_detail_rolepower } from '@/apis/roles.js'
export default {
  data() {
    return {
      activeStep: 1,
      style: 'font-size:12px;line-height:14px;font-weight:400',
      form1: {
        roleId: 0,
        roleName: '',
        remark: '',
        perms: []
      },
      rules1: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      treelist: []
    }
  },
  async created() {
    await this.getree()
    if (this.$route.params.roleId) {
      this.form1.roleId = this.$route.params.roleId
      const res = await get_detail_rolepower(this.form1.roleId)
      const { roleName, remark, perms } = res.data
      this.form1.roleName = roleName
      this.form1.remark = remark
      this.form1.perms = perms
      this.$refs.tree.forEach((tree, index) => {
        tree.setCheckedKeys(this.form1.perms[index])
      })
    }
  },
  methods: {
    async getree() {
      const res = await get_all_tree()
      this.treelist = res.data
    },
    decreseStep() {
      if (this.activeStep === 1) return
      this.activeStep--
    },
    increseStep() {
      if (this.activeStep === 3) return
      else if (this.activeStep === 1) {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            this.activeStep++
          }
        })
      } else if (this.activeStep === 2) {
        this.form1.perms = []
        this.$refs.tree.forEach(tree => {
          this.form1.perms.push(tree.getCheckedKeys())
        })
        if (this.form1.perms.flat().length !== 0) {
          this.activeStep++
          this.$refs.diabledTree.forEach((tree, index) => {
            tree.setCheckedKeys(this.form1.perms[index])
          })
          console.log(this.form1.perms)
        } else {
          this.$message({
            type: 'error',
            message: '请至少选择一个权限点'
          })
        }
      }
    },
    async setnewrole() {
      if (this.form1.roleId === 0) {
        await set_new_role(this.form1)
      } else {
        await change_role(this.form1)
      }setTimeout(() => {
        this.$message({
          type: 'success',
          message: this.form1.roleId ? '修改成功！即将返回上一页' : '添加成功！即将返回上一页'
        })
        this.$router.back()
      }, 1500)
    }
  }
}
</script>
<style scoped lang="scss">
.add-role {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }

      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 230px;
    display: flex;
    .step-container {
      height: 200px;
      width: 100px;
      margin-right: 30px;
    }
    .form-container {
      flex:1;
      background-color: #fff;
      overflow-y: auto;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form {
          display: flex;
          flex-wrap: wrap;
        }
        .info{
          font-size:14px;
          color:#666;
          .form-item{
            margin-bottom:20px;
          }
        }
      }
      .form-box{
        width: 600px;
        display: flex;
        flex-direction: column;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
    z-index: 10001;
  }
  .tree-wrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .tree-item {
        flex: 1;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }
}
</style>
