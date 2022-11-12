<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!--分类名称-->
            <li class="with-x" v-if="searchList.categoryName">{{searchList.categoryName}}<i @click="removeCategory">x</i></li>
            <!--关键字-->
            <li class="with-x" v-if="searchList.keyword">{{searchList.keyword}}<i @click="removeKeyWord">x</i></li>
            <!--品牌-->
            <li class="with-x" v-if="searchList.trademark">{{searchList.trademark.split(":")[1]}}<i @click="removeTradeMark">x</i></li>
            <!--售卖属性-->
            <li class="with-x" v-for="(props,index) in searchList.props" :key="index">{{props.split(":")[1]}}<i @click="removeProps(index)">x</i></li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrsInfo='attrsValue'/>

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!--
                    类名 order里面包含1表示综合 2表示销量
                    图标使用elementUI组件
                -->
                <li :class="{active:isOne}" @click="searchDescAndAsc('1')">
                  <a>综合<i v-show="isOne" :class="{'el-icon-caret-top':isAsc,'el-icon-caret-bottom':isDesc}"></i></a>
                </li>
                <li :class="{active:isTwo}" @click="searchDescAndAsc('2')">
                  <a>销量<i v-show="isTwo" :class="{'el-icon-caret-top':isAsc,'el-icon-caret-bottom':isDesc}"></i></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in getgoodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`"><img :src="good.defaultImg" /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{good.price}}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" :title="good.title">
                      {{good.title}}
                    </a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!--分页器-->
          <pagination :pageNo ='searchList.pageNo' :pageSize ='searchList.pageSize' :total='list.total' :continue='5' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import{mapGetters, mapState} from 'vuex'
  import SearchSelector from './SearchSelector/SearchSelector'
  export default {
    name: 'Search',
    data() {
      return {
        searchList:{
          //一级分类id
          category1Id:'',
          //二级分类id
          category2Id:'',
          //三级分类id
          category3Id:'',
          //分类名称
          categoryName:'',
          //关键字
          keyword:'',
          //售卖属性带的参数
          props:[],
          //品牌
          trademark:'',
          //排序
          order:'1:desc',
          //当前页
          pageNo:'1',
          //当前页展示的数量
          pageSize:'3'
        },
      }
    },
    beforeMount(){
      //将参数与query和params进行合并
      Object.assign(this.searchList,this.$route.params,this.$route.query);
    },
    mounted(){
      this.searchData();
      //分页器
      this.$bus.$on('searchPage',(index)=>{
          this.searchList.pageNo = index;
          this.searchData();
      })
    },
    methods:{
      //向数组仓库dispatch获取数据
      searchData(){
        this.$store.dispatch('getSearchList',this.searchList)
      },
      //品牌
      trademarkInfo(trademark){
          this.searchList.trademark=`${trademark.tmId}:${trademark.tmName}` 
          this.searchData();
      },
      //售卖属性
      attrsValue(attrs,attrsValue){
        //整理参数
        let prop = `${attrs.attrId}:${attrsValue}:${attrs.attrName}`;
        //数组去重 如果传入的参数为-1 则表示数组里面没有该元素
        if(this.searchList.props.indexOf(prop) == -1){
          //将参数传入searchList的数组中
          this.searchList.props.push(prop);
          
          this.searchData();
        }
      },
      //删除面包屑中的三级分类id
      removeCategory(){
        this.searchList.category1Id=undefined;
        this.searchList.category2Id=undefined;
        this.searchList.category3Id=undefined;
        this.searchList.categoryName=undefined;
        this.searchData();//重新加载数据
        this.$router.push({name:'search'})
      },
      //删除面包屑中的关键字
      removeKeyWord(){
        this.searchList.keyword=undefined;
        this.searchData();
        this.$bus.$emit('clear');//使用全局事件总线将关键字置空
        if(this.$route.query){
          this.$router.push({name:'search',query:this.$route.query})
        }
      },
      //删除面包屑的品牌信息
      removeTradeMark(){
        this.searchList.trademark=undefined;
        this.searchData();
      },
       //删除面包屑的售卖信息
      removeProps(index){
          //删除指定元素
          this.searchList.props.splice(index,1);
          //重新加载数据
          this.searchData();
      },
      //升降序
      searchDescAndAsc(index){
        //index 用来判断点击的是哪个
        //首先获取 序号 和 升降序号
        let originIndex = this.searchList.order.split(':')[0];//1
        let originSort = this.searchList.order.split(':')[1];//desc
        if(index == originIndex){//进行判断
            this.searchList.order = `${originIndex}:${originSort =='desc'?'asc':'desc'}`;
            this.searchData();
        }else{
          //将新序号赋值给 originIndex
          originIndex = index;
          //重新整理参数
          this.searchList.order = `${originIndex}:${originSort =='desc'?'desc':'asc'}`;
          //发送请求
          this.searchData();
        }
      },
      
    },
    computed:{
      //获取商品列表
      ...mapGetters(['getgoodsList']),
      //获取分页器所需要的参数
      ...mapState({
        list:(state)=> state.search.searchList
      }),
      //解决类名问题
      isOne(){
        return this.searchList.order.indexOf('1')!=-1;//不等于-1表示包含1
      },
      isTwo(){
        return this.searchList.order.indexOf('2')!=-1;//不等于-1表示包含2
      },
      //解决图标升降序问题
      isAsc(){
        return this.searchList.order.indexOf('asc')!=-1;//不等于-1表示包含asc 升序
      },
      isDesc(){
        return this.searchList.order.indexOf('desc')!=-1;//不等于-1表示包含asc 降序
      }
    },  
    components: {
      SearchSelector
    },
    //监听路由的变化
    watch:{
      $route(){
        //发送请求后 对三级分类id进行清空
        this.searchList.category1Id=undefined;
        this.searchList.category2Id=undefined;
        this.searchList.category3Id=undefined;
        //对搜索内容重新进行拼接
        Object.assign(this.searchList,this.$route.params,this.$route.query);
        //拼接后重新发送请求
        this.searchData();

      }
    }
  }
</script>

<style lang="less" scoped>
  .main {
    margin: 10px 0;

    .py-container {
      width: 1200px;
      margin: 0 auto;

      .bread {
        margin-bottom: 5px;
        overflow: hidden;

        .sui-breadcrumb {
          padding: 3px 15px;
          margin: 0;
          font-weight: 400;
          border-radius: 3px;
          float: left;

          li {
            display: inline-block;
            line-height: 18px;

            a {
              color: #666;
              text-decoration: none;

              &:hover {
                color: #4cb9fc;
              }
            }
          }
        }

        .sui-tag {
          margin-top: -5px;
          list-style: none;
          font-size: 0;
          line-height: 0;
          padding: 5px 0 0;
          margin-bottom: 18px;
          float: left;

          .with-x {
            font-size: 12px;
            margin: 0 5px 5px 0;
            display: inline-block;
            overflow: hidden;
            color: #000;
            background: #f7f7f7;
            padding: 0 7px;
            height: 20px;
            line-height: 20px;
            border: 1px solid #dedede;
            white-space: nowrap;
            transition: color 400ms;
            cursor: pointer;

            i {
              margin-left: 10px;
              cursor: pointer;
              font: 400 14px tahoma;
              display: inline-block;
              height: 100%;
              vertical-align: middle;
            }

            &:hover {
              color: #28a3ef;
            }
          }
        }
      }

      .details {
        margin-bottom: 5px;

        .sui-navbar {
          overflow: visible;
          margin-bottom: 0;

          .filter {
            min-height: 40px;
            padding-right: 20px;
            background: #fbfbfb;
            border: 1px solid #e2e2e2;
            padding-left: 0;
            border-radius: 0;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

            .sui-nav {
              position: relative;
              left: 0;
              display: block;
              float: left;
              margin: 0 10px 0 0;

              li {
                float: left;
                line-height: 18px;

                a {
                  display: block;
                  cursor: pointer;
                  padding: 11px 15px;
                  color: #777;
                  text-decoration: none;
                }

                &.active {
                  a {
                    background: #e1251b;
                    color: #fff;
                  }
                }
              }
            }
          }
        }

        .goods-list {
          margin: 20px 0;

          ul {
            display: flex;
            flex-wrap: wrap;

            li {
              height: 100%;
              width: 20%;
              margin-top: 10px;
              line-height: 28px;

              .list-wrap {
                .p-img {
                  padding-left: 15px;
                  width: 215px;
                  height: 255px;

                  a {
                    color: #666;

                    img {
                      max-width: 100%;
                      height: auto;
                      vertical-align: middle;
                    }
                  }
                }

                .price {
                  padding-left: 15px;
                  font-size: 18px;
                  color: #c81623;

                  strong {
                    font-weight: 700;

                    i {
                      margin-left: -5px;
                    }
                  }
                }

                .attr {
                  padding-left: 15px;
                  width: 85%;
                  overflow: hidden;
                  margin-bottom: 8px;
                  min-height: 38px;
                  cursor: pointer;
                  line-height: 1.8;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;

                  a {
                    color: #333;
                    text-decoration: none;
                  }
                }

                .commit {
                  padding-left: 15px;
                  height: 22px;
                  font-size: 13px;
                  color: #a7a7a7;

                  span {
                    font-weight: 700;
                    color: #646fb0;
                  }
                }

                .operate {
                  padding: 12px 15px;

                  .sui-btn {
                    display: inline-block;
                    padding: 2px 14px;
                    box-sizing: border-box;
                    margin-bottom: 0;
                    font-size: 12px;
                    line-height: 18px;
                    text-align: center;
                    vertical-align: middle;
                    cursor: pointer;
                    border-radius: 0;
                    background-color: transparent;
                    margin-right: 15px;
                  }

                  .btn-bordered {
                    min-width: 85px;
                    background-color: transparent;
                    border: 1px solid #8c8c8c;
                    color: #8c8c8c;

                    &:hover {
                      border: 1px solid #666;
                      color: #fff !important;
                      background-color: #666;
                      text-decoration: none;
                    }
                  }

                  .btn-danger {
                    border: 1px solid #e1251b;
                    color: #e1251b;

                    &:hover {
                      border: 1px solid #e1251b;
                      background-color: #e1251b;
                      color: white !important;
                      text-decoration: none;
                    }
                  }
                }
              }
            }
          }
        }

        .page {
          width: 733px;
          height: 66px;
          overflow: hidden;
          float: right;

          .sui-pagination {
            margin: 18px 0;

            ul {
              margin-left: 0;
              margin-bottom: 0;
              vertical-align: middle;
              width: 490px;
              float: left;

              li {
                line-height: 18px;
                display: inline-block;

                a {
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  border: 1px solid #e0e9ee;
                  margin-left: -1px;
                  font-size: 14px;
                  padding: 9px 18px;
                  color: #333;
                }

                &.active {
                  a {
                    background-color: #fff;
                    color: #e1251b;
                    border-color: #fff;
                    cursor: default;
                  }
                }

                &.prev {
                  a {
                    background-color: #fafafa;
                  }
                }

                &.disabled {
                  a {
                    color: #999;
                    cursor: default;
                  }
                }

                &.dotted {
                  span {
                    margin-left: -1px;
                    position: relative;
                    float: left;
                    line-height: 18px;
                    text-decoration: none;
                    background-color: #fff;
                    font-size: 14px;
                    border: 0;
                    padding: 9px 18px;
                    color: #333;
                  }
                }

                &.next {
                  a {
                    background-color: #fafafa;
                  }
                }
              }
            }

            div {
              color: #333;
              font-size: 14px;
              float: right;
              width: 241px;
            }
          }
        }
      }
    }
  }
</style>