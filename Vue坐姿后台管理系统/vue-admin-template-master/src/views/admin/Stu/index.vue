<template>
  <div>
    <el-card>
      <div>
        <el-input
              v-model="name"
              placeholder="请输入查询学生姓名"
              style="width: 400px;float: left;margin-bottom: 10px;"
              v-on:keyup.enter.native="inputList"
              clearable
            />
        <!-- <el-button type="primary" icon="el-icon-plus" @click="addSpu">添加学情信息</el-button> -->
        <el-table style="width:100%" border :data="list">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="name"  label="学生名称" width="80"></el-table-column>
          <el-table-column prop="num"  label="学生学号" width="100"></el-table-column>
          <el-table-column prop="imgUrl" label="图片信息" width="120" >
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="match"  label="匹配度" >
            <template slot-scope="{row}">
              <el-rate
                disabled
                :texts="['比较差', '差', '一般', '还行', '很棒' ]"
                v-model=" row.match "
                show-text>
              </el-rate>
            </template>
          </el-table-column>
          <el-table-column prop="focus"  label="专注度" >
            <template slot-scope="{row}">
              <el-rate
                disabled
                :texts="['比较差', '差', '一般', '还行', '很棒' ]"
                v-model=" row.focus "
                show-text>
              </el-rate>
            </template>
          </el-table-column>
          <el-table-column prop="enthusiastic"  label="热情度" >
            <template slot-scope="{row}">
              <el-rate
                disabled
                :texts="['比较差', '差', '一般', '还行', '很棒' ]"
                v-model=" row.enthusiastic "
                show-text>
              </el-rate>
            </template>
          </el-table-column>
          <el-table-column prop="prop"  label="操作">
            <template slot-scope="{row}">
                <el-button type="success" icon="el-icon-plus" size="mini" title="添加学情信息"></el-button>
                <el-button type="warning" icon="el-icon-edit" size="mini" title="修改学情信息"></el-button>
                <el-button type="info" icon="el-icon-info" size="mini" title="学情信息详情"></el-button>
                <el-popconfirm :title="`确定删除该消息吗？`">
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除学情信息"></el-button>
                </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px; textAlign: center"
          :total="total"
          :current-page="page"
          :page-size="limit"
          @current-change="changePage"
          @size-change="changeSize"
          :page-sizes="[3, 5, 10]"
          layout="total,sizes,prev,pager,next,jumper"
        ></el-pagination>
      </div>
      <!--ref引用在了子组件上指向的是子组件的实例对象-->
      <!-- <SpuForm v-show="scenen == 1" @swagScenen='swagScenen' ref="spu"/>
      <SkuForm v-show="scenen == 2"/> -->
    </el-card>
  </div>
</template>
<!--
  因为SpuForm是spu的子组件当父组件挂载的时候会挂载子组件 从而不能在子组件的mounted中发送请求获取数据
  可以使用在子组件上使用ref 获取子组件的实例对象 从而点击修改的时候调用子组件的方法发送请求获取数据
-->
<script>
// import SpuForm from '../Stu/SpuForm';
// import SkuForm from '../Stu/SkuForm';
export default {
    name:'Spu',
    // components:{
    //   SkuForm,
    //   SpuForm
    // },
    data() {
      return {
        page:2,
        limit:3,
        total:1,//总数据
        list:[
          {id:'001',name:'李峰',num:'212206632',imgUrl:'http://localhost:8083/uploadFiles/image/5.jpg',match:3,focus:3,enthusiastic:4},
          {id:'002',name:'张涛',num:'212206647',imgUrl:'http://localhost:8083/uploadFiles/image/8.png',match:2,focus:3,enthusiastic:3},
        ]
      }
    },
   
    methods:{
      changePage(pager) {
        //pager可以实现点击那个页面显示那个页码
        //重新修改页码
        this.page = pager;
        //发送请求
        this.getSpuList();
      },
      //修改每页展示几条数据
      changeSize(limit) {
        this.limit = limit;
        //发送请求
        this.getSpuList();
      },
      
  }
}
</script>

<style>

</style>