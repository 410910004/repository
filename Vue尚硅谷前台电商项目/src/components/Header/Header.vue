<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <p v-if="!userName">
            <span>请</span>
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register">免费注册</router-link>
          </p>
          <p v-else>
            <span>{{userName}}</span>|
            <a @click="logOut">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center/myOrder">我的订单</router-link>
          <router-link to="/shopCart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="./images/logo.png"  alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
          />
          <button class="sui-btn btn-xlarge btn-danger" type="button"  @click="Search">
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
  export default {
    name: "Header",
    data() {
      return {
        keyword:''
      }
    },
    methods:{
      Search(){
        //第一种形式 字符串
        // this.$router.push('/search/'+this.keyWord+'?k='+this.keyWord.toUpperCase())
        //第二种形式  模板字符串
        // this.$router.push(`/search/${this.keyWord}?k=${this.keyWord.toUpperCase()}`)
        //第三种 对象形式
        // this.$router.push({
        //   name:'search',
        //   params:{
        //    keyWord:this.keyWord
        //   },  
        //   query:{
        //     k:this.keyWord.toUpperCase()
        //   }
        // })
        if(this.$route.query){
          let location = {name:'search',params:{keyword:this.keyword||undefined}};
          location.query = this.$route.query;
          this.$router.push(location)
        }
      },
      //退出登录
      async logOut(){
        try {
          await this.$store.dispatch('Logout');
          this.$router.push('/home');
        } catch (error) {
          alert(error.message);
        }
      }
    },
    mounted(){
      this.$bus.$on('clear',()=>{
        this.keyword='';
      })
    },
    computed:{
      ...mapGetters(['userName'])
    }
  }; 
</script>

<style scoped lang="less">
    .header {
        &>.top {
            background-color: #eaeaea;
            height: 30px;
            line-height: 30px;

            .container {
                width: 1200px;
                margin: 0 auto;
                overflow: hidden;

                .loginList {
                    float: left;

                    p {
                        float: left;
                        margin-right: 10px;

                        .register {
                            border-left: 1px solid #b3aeae;
                            padding: 0 5px;
                            margin-left: 5px;
                        }
                    }
                }

                .typeList {
                    float: right;

                    a {
                        padding: 0 10px;

                        &+a {
                            border-left: 1px solid #b3aeae;
                        }
                    }

                }

            }
        }

        &>.bottom {
            width: 1200px;
            margin: 0 auto;
            overflow: hidden;

            .logoArea {
                float: left;

                .logo {
                    img {
                        width: 175px;
                        margin: 25px 45px;
                    }
                }
            }

            .searchArea {
                float: right;
                margin-top: 35px;

                .searchForm {
                    overflow: hidden;

                    input {
                        box-sizing: border-box;
                        width: 490px;
                        height: 32px;
                        padding: 0px 4px;
                        border: 2px solid #ea4a36;
                        float: left;

                        &:focus {
                            outline: none;
                        }
                    }

                    button {
                        height: 32px;
                        width: 68px;
                        background-color: #ea4a36;
                        border: none;
                        color: #fff;
                        float: left;
                        cursor: pointer;

                        &:focus {
                            outline: none;
                        }
                    }
                }
            }
        }
    }
</style>