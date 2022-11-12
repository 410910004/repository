<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>注册新用户
        <span class="go">我有账号，去 <router-link to="/login">登陆</router-link><!--跳转路由--></span>
      </h3>
      <div class="content">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="手机号" prop="phone">
            <el-input type="text" v-model="ruleForm.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code" style="float:left">
            <el-input type="text" v-model="ruleForm.code" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="code" @click="getCode">验证码</el-button>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Register',
    data() {
      //验证手机号码
      var validateTele=(rule, value, callback)=>{
        //正则表达式
        let reg_phone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (value === '' || !reg_phone.test(value)) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          callback();
        }
      };
       //验证 验证码
      var validateCode=(rule, value, callback)=>{
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else {
          callback();
        }
      };
      //验证密码
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      //验证确认密码
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          phone:'',//手机号码
          code:'',//验证码
          password: '',//密码
          checkPass: '',//确认密码
        },
        rules: {
          phone:[
            { validator:validateTele,trigger: 'blur' }
          ],
          code:[
            { validator:validateCode }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      //提交
       submitForm(formName) {
         this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let {phone,code,password} = this.ruleForm;
            try {
               //派发数据仓库
              await this.$store.dispatch('userRegister',{phone,password,code});
              this.$router.push('/login');
            } catch (error) {
              alert(error.message);
            }
          } else {
            alert('error submit!!');
            return false;
          }
        });
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //获取验证码
      async getCode(){
        let phone = this.ruleForm.phone;//获取手机号码
        let reg_phone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;//正则
        if(reg_phone.test(phone)){
          //派发请求获取验证码
          await this.$store.dispatch('getCode',phone);//等待数据存入仓库
          //将验证码直接赋值到输入框
          this.ruleForm.code = this.$store.state.register.code;
        }else{
          alert('请输入正确的手机号码或格式!');
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .register-container {
    .register {
      width: 1200px;
      height: 445px;
      border: 1px solid rgb(223, 223, 223);
      margin: 0 auto;
      position: relative;
      h3 {
        background: #ececec;
        margin: 0;
        padding: 6px 15px;
        color: #333;
        border-bottom: 1px solid #dfdfdf;
        font-size: 20.04px;
        line-height: 30.06px;

        span {
          font-size: 14px;
          float: right;

          a {
            color: #e1251b;
          }
        }
      }
      .content{
        margin-top: 50px;
        width: 50%;
        position: absolute;
        text-align: center;
        //居中
        left: 50%;
        transform: translateX(-50%);
      }
      
    }

    .copyright {
      width: 1200px;
      margin: 0 auto;
      text-align: center;
      line-height: 24px;

      ul {
        li {
          display: inline-block;
          border-right: 1px solid #e4e4e4;
          padding: 0 20px;
          margin: 15px 0;
        }
      }
    }
  }
</style>