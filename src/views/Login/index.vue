<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <el-form ref="form" :model="formData" :rules="rules">
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input v-model="formData.username" />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="formData.password" />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="formData.remember">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="doLogin()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { USER_INFO } from '@/constants/KEY.js'
import { jiaoben } from '@/views/Login/jiaoben.js'
export default {
  name: 'Login',
  data() {
    return {
      formData: {
        username: '',
        password: '',
        remember: false
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    const userData = localStorage.getItem(USER_INFO)
    if (userData) {
      const userinfo = JSON.parse(userData)
      this.formData.username = userinfo.username
      this.formData.password = userinfo.password
      this.formData.remember = true
    }
  },
  methods: {
    doLogin() {
      this.$refs.form.validate(async(valid) => {
        console.log(valid)
        if (valid) {
          // TODO
          console.log('登录')
          await this.$store.dispatch('user/doLogin', this.formData)
          await jiaoben()
          this.$router.push(`${this.$route.query.redirect || '/workbench'}`)
          if (this.formData.remember) {
            localStorage.setItem(USER_INFO, JSON.stringify(this.formData))
          } else {
            localStorage.removeItem(USER_INFO)
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .login_body {
    display: flex;
  }
  .bg {
    width: 60vw;
    height: 100vh;
    background: url('~@/assets/login-bg.svg') no-repeat;
    background-position: right top;
    background-size: cover;
  }
  .box {
    margin: 200px 10% 0;
    flex: 1;
    .title {
      padding-bottom: 76px;
      font-size: 26px;
      font-weight: 500;
      color: #1e2023;
    }
    ::v-deep() {
      .ant-form-item {
        display: flex;
        margin-bottom: 62px;
        flex-direction: column;
      }
      .ant-form-item-label label {
        font-size: 16px;
        color: #8b929d;
      }
      .ant-input,
      .ant-input-password {
        border-radius: 8px;
      }
    }
  }
  .login_btn{
    width: 100%;
  }
</style>
