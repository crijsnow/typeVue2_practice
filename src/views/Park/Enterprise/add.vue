<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>{{ id?'编辑企业':'新增企业' }}</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form ref="ruleForm" label-width="100px" :rules="rules" :model="addForm">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select v-model="addForm.industryCode">
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :value="item.industryCode"
                  :label="item.industryName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseId">
              <el-upload
                action="#"
                :file-list="fileList"
                :http-request="uploadfile"
                :before-upload="beforecheck"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过 5MB</div>
              </el-upload>
              <div>
                <div v-for="(file, index) in fileList" :key="index">
                  <img :src="file.url" :alt="file.name" style="max-width: 200px; max-height: 200px; margin: 10px;">
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { minilist, upload, add, getdetial, edit } from '@/apis/enterprise'
export default {
  data() {
    return {
      addForm: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 所在行业
        contact: '', // 企业联系人
        contactNumber: '', // 联系人电话
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },
      industryList: [],
      fileList: [],
      rules: {
        name: [{ required: true, message: '企业名称为必填', trigger: 'blur' }],
        legalPerson: [{ required: true, message: '法人为必填', trigger: 'blur' }],
        registeredAddress: [{ required: true, message: '注册地址为必填', trigger: 'blur' }],
        industryCode: [{ required: true, message: '所在行业为必填', trigger: 'change' }],
        contact: [{ required: true, message: '企业联系人为必填', trigger: 'blur' }],
        contactNumber: [
          { required: true, message: '企业联系人电话为必填', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的电话号码' }
        ],
        businessLicenseId: [{ required: true, message: '请上传营业执照', trigger: 'blur' }]
      }
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  async created() {
    this.getminilist()
    if (this.id) {
      const res = await getdetial(this.id)
      const { name, legalPerson, registeredAddress, industryCode, contact, contactNumber, businessLicenseUrl, businessLicenseId, businessLicenseName } = res.data
      this.addForm = { name, legalPerson, registeredAddress, industryCode, contact, contactNumber, businessLicenseUrl, businessLicenseId }
      this.fileList = [{ name: businessLicenseName, url: businessLicenseUrl, uid: businessLicenseId, status: 'success' }]
    }
  },
  methods: {
    async getminilist() {
      const res = await minilist()
      this.industryList = res.data
      console.log(this.industryList)
    },
    async uploadfile(data) {
      const file = data.file

      // 处理formData类型参数
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'businessLicense')
      const res = await upload(formData)

      // 赋值表单数据
      this.addForm.businessLicenseId = res.data.id
      this.addForm.businessLicenseUrl = res.data.url

      // el-upload 显示已上传文件列表
      // el-upload 组件要求列表对象必须有 name 和 url 属性才可以
      this.fileList.push({
        name: file.name,
        url: res.data.url
      })
      this.$refs.ruleForm.validateField('businessLicenseId')
    },
    beforecheck(file) {
    //   const allowImgType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
    //   const isLt5M = file.size / 1024 / 1024 < 5

      //   if (!allowImgType) {
      //     this.$message.error('上传营业执照图片只能是 PNG/JPG/JPEG 格式!')
      //   }
      //   if (!isLt5M) {
      //     this.$message.error('上传营业执照图片大小不能超过 5MB!')
      //   }
      //   return allowImgType && isLt5M
      const imgtype = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
      const large = file.size / 1024 / 1024 < 5
      if (!imgtype) {
        this.$message.error('上传营业执照图片只能是 PNG/JPG/JPEG 格式!')
      } else if (!large) {
        this.$message.error('上传营业执照图片大小不能超过 5MB!')
      } else {
        return true
      }
    },
    reset() {
      this.$refs.ruleForm.resetFields()
    },
    confirm() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          if (this.id) {
            await edit({
              ...this.addForm,
              id: this.id
            })
            this.$message.success('编辑企业成功，即将返回之前页')
            setTimeout(() => {
              this.$router.push('/park/enterprise')
            }, 1800)
          } else {
            await add(this.addForm)
            this.$message.success('新增企业注册成功，即将返回之前页')
            setTimeout(() => {
              this.$router.push('/park/enterprise')
            }, 1800)
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.add-enterprise {
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
      .arrow{
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left:20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form{
          display: flex;
          flex-wrap: wrap;
          .el-form-item{
            width: 50%;
          }
        }
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
  }
}
</style>
