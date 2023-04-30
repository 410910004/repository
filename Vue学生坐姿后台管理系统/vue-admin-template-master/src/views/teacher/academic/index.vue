<template>
  <div>
    <el-card>
      <div>
        <el-input
              v-model="name"
              placeholder="请输入查询学生姓名"
              style="width: 400px;float: left;margin-bottom: 10px;margin-right: 10px;"
              v-on:keyup.enter.native="inputList"
              clearable
            />
        <!-- <el-button type="primary" icon="el-icon-plus" @click="addSpu">添加学情信息</el-button> -->
        <el-table style="width:100%" border :data="list">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="no"  label="学生学号" width="100"></el-table-column>
          <el-table-column prop="name"  label="学生名称" width="80"></el-table-column>     
          <el-table-column prop="img" label="图片信息" width="120">
            <template slot-scope="{row}">
              <img :src="getImageUrl(row.img)" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="matchs"  label="匹配度" >
            <template slot-scope="{row}">
              <el-rate
                disabled
                :texts="['比较差', '差', '一般', '还行', '很棒' ]"
                v-model=" row.matchs "
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
                <input class="file" name="file" type="file" id="imgFile"
                  accept="image/png,image/gif,image/jpeg"
                  v-on:change="imgChange"/>
                  <el-button type="primary" v-on:click="update(row.id)"  size="mini">{{row.img===null?"设置图片":"修改图片"}}</el-button>
                <el-button type="warning" icon="el-icon-edit" size="mini" title="修改学情信息"></el-button>
              
                <el-popconfirm :title="`确定删除该消息吗？`">
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除学情信息"></el-button>
                </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
              @size-change="SizeChange"
              @current-change="CurrentChange"
              :current-page="pageNum"
              :page-sizes="[5, 7, 10, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              style="margin-left: 30%">
          </el-pagination>
      </div>
    
    </el-card>
  </div>
</template>

<script>

export default {
    name:'Academic',

    data() {
      return {
        total:1,//总数据
        pageSize:10,    //一页几条
        pageNum:1,     //默认当前页
        list:[], //数据
        name:'',
        param:new FormData(),     //创建图片表单对象
      }
    },
   
    methods:{
      CurrentChange:function (val) {  //第几页触发
        console.log("val:"+val)
        this.pageNum=val;
        //判断搜索框内容刷新表格
        this.pageList();
      },
      SizeChange:function (val) {    //多少条一页触发
        console.log("val:"+val)
        this.pageSize=val;
        //判断搜索框内容刷新表格
        this.pageList();
      },
      imgChange:function (e) {      //图片发生改变触发
        let file = e.target.files[0];
        this.param.append('file',file,file.name);//通过append向form对象添加数据
      },
      getImageUrl:function (name){    //把地址转换，不然无法显示图片
        if (name == null){
          return null;
        }
        return "http://localhost:8083/uploadFiles/"+name
      },
      update:function (id) {        //上传图片
        let config = {            //添加请求头
          headers:{'Content-Type':'multipart/form-data'} 
        };
        this.$axios.post("http://localhost:8083/academic/setId?id="+id).then(res=>{
          const json = res.data;
          if (json.code==200){    
            //消息提示组件
            console.log("成功")
            this.$axios.post('http://localhost:8083/academic/uploadPictures',this.param,config)   //上传图片
                .then(res=>{
                  const json = res.data;
                  if (json.code==200){              
                    console.log("成功")              
                    this.param=new FormData();
                    //刷新表格
                    this.pageList();         
                  }else {
                  console.log("失败")
                }
              })
            }
        })
      },
      pageList(){
        this.$axios.post("http://localhost:8083/academic/listPage").then(res=>{
          const json = res.data;
          if(json.code == 200){
            this.list = json.data;
            this.total=json.total;
          }else {}
        })
      },
      pageList:function () {      //分页后返回的数据
        this.$axios.post("http://localhost:8083/academic/listPage",{
          pageSize:this.pageSize,
          pageNum:this.pageNum
        }).then(res=>{
          const json = res.data;
          console.log("json:");
          console.log(json);
          if (json.code==200){
            this.list=json.data;
            this.total=json.total;
          }else {
            console.log("失败")
          }
        })
      },
      inputList:function () {       //搜索框方法
        this.$axios.post("http://localhost:8083/academic/listLike",{
            pageSize:this.pageSize,
            pageNum:this.pageNum,
            param: {
              name:this.name,
            }
        }).then(res=>{
            const json = res.data;
            console.log("json:");
            console.log(json);
            if (json.code==200){
            this.list=json.data;
            this.total=json.total;
            }else {
            //消息提示组件
                console.log("失败")
            }
        })
      },

  },
  beforeMount(){
    this.pageList();
  }
}
</script>

<style>

</style>