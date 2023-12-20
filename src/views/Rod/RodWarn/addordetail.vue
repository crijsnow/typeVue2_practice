<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>{{ $route.query.istrue?'告警详情':'告警处理' }}</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">告警详情</div>
        <div class="form">
          <div class="main">
            <div class="row">
              <div class="box"><div class="left">告警时间:</div><div class="right">{{ datalist.warningTime }}</div></div>
              <div class="box"><div class="left">一体杆名称:</div><div class="right">{{ datalist.poleName }}</div></div>
            </div>
            <div class="row">
              <div class="box"><div class="left">告警区域:</div><div class="right">{{ datalist.areaName }}</div></div>
              <div class="box"><div class="left">一体杆编号:</div><div class="right">{{ datalist.poleNumber }}</div></div>
            </div>
            <div class="row">
              <div class="box"><div class="left">故障类型:</div><div class="right">{{ datalist.errorType }}</div></div>
              <div class="box"><div class="left">处置状态:</div><div class="right">{{ datalist.handleStatus }}</div></div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <main v-if="$route.query.istrue" class="add-main">
      <div class="form-container">
        <div class="title">告警处理</div>
        <div class="form">
          <div class="main">
            <div class="row">
              <div class="box"><div class="left">处理人:</div><div class="right">{{ datalist.handleUser }}</div></div>
              <div class="box"><div class="left">联系方式:</div><div class="right">{{ datalist.phonenumber }}</div></div>
            </div>
            <div class="row">
              <div class="box"><div class="left">处理结果:</div><div class="right">{{ datalist.handleResult }}</div></div>
              <div class="box"><div class="left">完成时间:</div><div class="right">{{ datalist.handleTime }}</div></div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer v-else class="add-footer">
      <div class="btn-container">
        <el-button @click="finish">完成</el-button>
        <el-button type="primary" @click="confirm">派单</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { get_detail } from '@/apis/warning.js'
export default {
  data() {
    return {
      datalist: []
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  created() {
    this.getdetail()
  },
  methods: {
    async getdetail() {
      const res = await get_detail(this.id)
      this.datalist = res.data
    },
    confirm() {
      console.log('暂时保留')
    },
    finish() {
      console.log('暂时保留')
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
        margin-right: 6px;
        font-weight: 400;
        i{
          margin-right: 12px;
        }
      }
      .arrow{
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
      font-weight: 400;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      padding-top: 18px;
      .title {
        height: 14px;
        line-height: 14px;
        font-size: 14px;
        padding-left:8px;
        border-left:2px solid #4770ff
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .main{
          width: 100%;
          .row{
            display: flex;
            height: 42px;
            width: 100%;
            .box{
              width: 516px;
              display: flex;
              .left{
                width: 138px;
                font-size: 14px;
                line-height: 21px;
                color: #909399;
                text-align: right;
                padding-right: 5px;
              }
              .right{
                text-align: left;
                font-size: 14px;
                line-height: 21px;
              }
            }
          }
        }
      }
    }
  }
}

</style>
