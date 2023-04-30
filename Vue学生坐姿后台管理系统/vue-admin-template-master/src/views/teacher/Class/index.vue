<template>
    <div>
      <el-input
        v-model="name"
        placeholder="请输入班级名称"
        style="width: 400px;float: left;margin-bottom: 10px;margin-right: 10px;"
        v-on:keyup.enter.native="inputList"
        clearable
      />
      <el-button type="primary" icon="el-icon-plus" @click="openClass">添加</el-button>
  
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
        <el-table-column
          prop="classname"
          label="班级名称"
          width="width"
        ></el-table-column>
        <el-table-column prop="num" label="人数" width="width"></el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updateClass(row)"
              >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteClass(row)"
              >删除</el-button>
          </template>
        </el-table-column>
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
        :page-sizes="[3, 5, 10]"
        @current-change="CurrentChange"
        @size-change="SizeChange"
        layout="total,sizes,prev,pager,next,jumper"
      ></el-pagination>
  
      <!--对话框-->
      <el-dialog title="添加班级" :visible.sync="dialogFormVisible">
        <!--
          表单验证
            model: 表单验证的数据对象 依据那些数据进行验证
            rules：验证规则
            ref ： 表单每栏内容依据那些数据对象进行验证
            prop:  表单验证的数据字段
        -->
        <el-form :model="classList" :rules="rules" ref="classList">
          <el-form-item label="班级名称" label-width="100px" prop="className">
            <el-input v-model="classList.classname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="人数" label-width="100px" prop="num">
            <el-input v-model="classList.num" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateOrAddClass">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    name: "Class",
    data() {
      return {
        pageNum: 1,
        pageSize: 3,
        list: [],
        total: 2,
        //显示对话框
        dialogFormVisible: false,
        //添加班级所用到的参数
        classList: {
          id:'',
          classname: "", //班级名称
          num: "", //班级人数
        },
        name:'',
        //表单验证规则
        rules: {
          tmName: [
            { required: true, message: "请输入班级名称", trigger: "blur" },
            { min: 2, max: 5, message: "长度在2到5个字符", trigger: "change" },
          ],
          num: [{ required: true, message: "请输入班级人数", }],
        },
      };
    },
 
    methods: {
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
      pageList:function () {      //分页后返回的数据
        this.$axios.post("http://localhost:8083/class/listPage").then(res=>{
          const json = res.data;
          console.log("json:");
          console.log(json);
          if (json.code==200){
            this.list=json.data;
            this.total=json.total;
          }else {}
        })
      },
      pageList:function () {      //分页后返回的数据
        this.$axios.post("http://localhost:8083/class/listPage",{
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
        this.$axios.post("http://localhost:8083/class/listLike",{
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
      clearClassList(){
        this.classList.id='',
        this.classList.classname='',
        this.classList.num=''
      },
      openClass(){
        this.dialogFormVisible = true
        this.clearClassList();
      },
      updateClass(row){
        this.dialogFormVisible = true
        this.classList.id = row.id;
        this.classList.classname = row.classname;
        this.classList.num = row.num
      },
      deleteClass(row){
        this.$axios.get("http://localhost:8083/class/del?id="+row.id).then(res=>{
          const json = res.data;
          if(json.code == 200){
            this.list = json.data;
            this.pageList();//获取数据后刷新页面
          }
        })
      },
      updateOrAddClass(){
        if( this.classList.id == "" ){
            this.$axios.post("http://localhost:8083/class/save",this.classList).then(res=>{
              const json = res.data;
              if (json.code==200){
                this.dialogFormVisible = false
                this.clearClassList();
                //刷新表格
                this.pageList();
              }else {}
            });
          }else{
            this.$axios.post("http://localhost:8083/class/mod",this.classList).then(res=>{
                const json = res.data;
                if (json.code==200){
                  this.dialogFormVisible = false
                  this.clearClassList();
                  //刷新表格
                  this.pageList();
                }else {}
              });
          }
      }
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