<template>
  <div>
    <el-card style="margin:20px 0px">
      <!--全局组件-->
      <CategorySelect @getCategory="getCategory" :show='scenen!=1'/>
    </el-card>
    <el-card>
      <div v-show="scenen == 0">
        <el-button type="primary" icon="el-icon-plus" @click="addSpu">添加报警信息</el-button>
        <el-table style="width:100%" border :data="list">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="name"  label="学生名称"></el-table-column>
          <el-table-column prop="num"  label="学生学号"></el-table-column>
          <el-table-column prop="imgUrl" label="图片信息" width="width">
            <template>
              <img :src="list.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="description"  label="报警信息描述"></el-table-column>
          <el-table-column prop="prop"  label="操作">
            <template slot-scope="{row,$index}">
                <el-button type="success" icon="el-icon-plus" size="mini" title="添加报警信息" @click="scenen = 1"></el-button>
                <el-button type="warning" icon="el-icon-edit" size="mini" title="修改报警信息" @click="updateSpu(row)"></el-button>
                <el-button type="info" icon="el-icon-info" size="mini" title="报警信息详情"></el-button>
                <el-popconfirm :title="`确定删除该消息吗？`" @onConfirm="deleteAttr(row)">
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除报警信息"></el-button>
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
      <SpuForm v-show="scenen == 1" @swagScenen='swagScenen' ref="spu"/>
      <SkuForm v-show="scenen == 2"/>
    </el-card>
  </div>
</template>
<!--
  因为SpuForm是spu的子组件当父组件挂载的时候会挂载子组件 从而不能在子组件的mounted中发送请求获取数据
  可以使用在子组件上使用ref 获取子组件的实例对象 从而点击修改的时候调用子组件的方法发送请求获取数据
-->
<script>
import SpuForm from '../Spu/SpuForm';
import SkuForm from '../Spu/SkuForm';
export default {
    name:'Spu',
    components:{
      SkuForm,
      SpuForm
    },
    data() {
      return {
        category3id:'',
        page:1,
        limit:3,
        records:[],//记录数组
        total:0,//总数据
        scenen:0, //根据该值来切换页面，
        list:[
          {id:'001',name:'张三',num:'212211111',description:'全勤'},
          {id:'002',name:'李四',num:'212211112',description:'全勤'},
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
      getCategory({id,level}){
        //一级分类id
        if(level == 1){
          this.category1id = id;
          //让二三级分类置空
          this.category2id = '';
          this.category3id = '';
        }else if(level == 2){
          this.category2id = id;
          this.category3id = '';
        }else{
          this.category3id = id;
          this.getSpuList();
        }
      },
      async getSpuList(){
        const {page,limit,category3id} =this;//解构
        let result = await this.$API.spu.reqGetSpuList(page,limit,category3id);
        console.log(result)
        if(result.code == 200){
          this.total= result.data.total;
          this.records = result.data.records;
        }
      },
      //添加Spu
      addSpu(){
        this.scenen=1;
        //通知子组件发送请求
        this.$refs.spu.getAttrInfos(this.category3id);
      },
      //修改Spu
      updateSpu(row){
        // console.log(row);
        this.scenen = 1;
        //ref 引用在子组件上则指向的是子组件的实例对象 如果引用在dom 元素上 则指向dom元素
        this.$refs.spu.initSpuInfo(row);
      },
      //切换spu
      swagScenen({scenen,flag}){ //这边是解构解析 需要参数一致用的是scenen
        console.log(scenen,flag);
        this.scenen = scenen;
        //判断是否为修改 是则停留在该页码 否则回到第一页
        if(flag == '修改'){
          this.getSpuList();
        }else{//添加
          this.getSpuList();
        }
      },
      //删除属性
      async deleteAttr(row){
        let result = await this.$API.spu.reqDeleteAttr(row.id);
        if(result.code == 200){
          this.$message('删除成功');
          if(this.records.length<1){
            this.getSpuList(this.page-1);
          }else{
            this.getSpuList(this.page);
          }
        }else{
          this.$message('删除失败');
        }
      }
  }
}
</script>

<style>

</style>