<template>
  <div>
    <el-input
        v-model="name"
        placeholder="请输入宿舍号"
        style="width: 400px;float: left;margin-bottom: 10px;margin-right: 10px;"
        v-on:keyup.enter.native="inputList"
        clearable
      />
    <!--
      prop:对应的是列的字段名；
      label：标签名对应的是列名；
      data:绑定数据
    -->
    <el-table border :data="list" style="width: 100%; margin-top: 20px">
      <el-table-column
        type="index"
        prop="prop"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column prop="dname" label="宿舍号" width="width"></el-table-column>
      <el-table-column prop="num" label="班级人数" width="width"></el-table-column>
    </el-table>
    <!--
      分页器
        total:总页数
        urrent-page:当前页
        @current-change="" 当前页发生变化时会触发
        layout :分页器的布局
    -->
    <el-pagination
      style="margin-top: 20px; textAlign: center"
      :total="total"
      :current-page="pageNum"
      :page-size="pageSize"
      :page-sizes="[5, 7, 10, 20]"
      @current-change="SizeChange"
      @size-change="CurrentChange"
      layout="total,sizes,prev,pager,next,jumper"
    ></el-pagination>

  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      pageSize:10,    //一页几条
      pageNum:1,     //默认当前页
      list: [],     //班级数据
      total: 2,     //条数
      name:''      //搜索框用的参数
    };
  },

  methods: {
    //获取班级数据
    pageList() {      //分页后返回的数据
      this.$axios.post("http://localhost:8083/dormitory/listPage").then(res=>{
        const json = res.data;
        console.log("json:");
        console.log(json);
        if (json.code==200){
          this.list=json.data;
          this.total=json.total;
        }else {
         console.log("数据返回错误");
        }
      })
    },
    pageList () {      //分页后返回的数据
      this.$axios.post("http://localhost:8083/dormitory/listPage",{
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
    CurrentChange(val) {  //第几页触发
      console.log("val:"+val)
      this.pageNum=val;
      //判断搜索框内容刷新表格
      this.pageList();
    },
    SizeChange(val) {    //多少条一页触发
      console.log("val:"+val)
      this.pageSize=val;
      //判断搜索框内容刷新表格
      this.pageList();
    },  
    inputList(){
      this.$axios.post("http://localhost:8083/dormitory/listLike",{
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
};
</script>

<style>
/**对话框中图片上传的样式 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>