<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header content="增加月卡" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form ref="form_car" label-width="100px" :model="datalist" :rules="rules">
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="datalist.personName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="datalist.phoneNumber" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="datalist.carNumber" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="datalist.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form ref="form_pay" label-width="100px" :model="datalist2" :rules="rules2">
            <el-form-item label="有效日期" prop="payTime">
              <el-date-picker
                v-model="datalist2.payTime"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="datalist2.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="datalist2.paymentMethod">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="comfire">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { add_card, update, get_card } from '@/apis/card.js'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      datalist: {
        personName: '',
        phoneNumber: '',
        carNumber: '',
        carBrand: ''
      },
      rules: {
        personName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        phoneNumber: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '请输入正确格式手机号', trigger: 'blur' }
        ],
        carNumber: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使]{1}[A-Z]{1}[A-Z0-9]{5,6}$/, message: '请输入正确的车牌号', trigger: 'blur' }
        ],
        carBrand: [{ required: true, message: '车辆品牌不能为空', trigger: 'blur' }]
      },
      datalist2: {
        payTime: [],
        paymentAmount: null,
        paymentMethod: null
      },
      rules2: {
        payTime: [{ required: true, message: '请选择支付时间' }],
        paymentAmount: [{ required: true, message: '请选择支付金额', trigger: 'blur' }],
        paymentMethod: [{ required: true, message: '请选择支付方式', trigger: 'change' }]
      },
      options: [
        { id: 'Alipay', name: '支付宝' },
        { id: 'WeChat', name: '微信' },
        { id: 'Cash', name: '线下' }
      ]
    }
  },
  async created() {
    const id = this.$route.query.id
    if (id) {
      const res = await get_card(id)
      console.log(res)
      const { carInfoId, personName, phoneNumber, carNumber, carBrand } = res.data
      this.datalist = {
        personName, phoneNumber, carNumber, carBrand, carInfoId
      }

      // 回填缴费信息表单
      const { rechargeId, cardStartDate, cardEndDate, paymentAmount, paymentMethod } = res.data.rechargeList[0]
      this.datalist2 = {
        rechargeId,
        paymentAmount,
        paymentMethod,
        payTime: [cardStartDate, cardEndDate]
      }
    }
  },
  methods: {
    comfire() {
      this.$refs.form_car.validate((valid) => {
        if (valid) {
          this.$refs.form_pay.validate(async(valid2) => {
            if (valid2) {
              const id = this.$route.query.id
              const data = {
                ...this.datalist,
                ...this.datalist2,
                cardStartDate: this.datalist2.payTime[0],
                cardEndDate: this.datalist2.payTime[1]
              }
              delete data.payTime
              console.log(id)
              if (id) {
                data.carInfoId = id
                data.rechargeId = id
                const res = await update(data)
                console.log(res)
                Message.success('修改成功,即将返回上一页')
                setTimeout(() => {
                  this.$router.push('/parking/card')
                }, 1800)
              } else {
                const res = await add_card(data)
                console.log(res)
                Message.success('添加成功,即将返回上一页')
                setTimeout(() => {
                  this.$router.push('/parking/card')
                }, 1800)
              }
            }
          })
        }
      })
    },
    reset() {
      this.$refs.form_car.resetFields()
      this.$refs.form_pay.resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
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
        padding-left: 20px;
      }

      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;

          .el-form-item {
            width: 50%;
          }
        }
      }
    }
    .preview{
      img{
        width: 100px;
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
