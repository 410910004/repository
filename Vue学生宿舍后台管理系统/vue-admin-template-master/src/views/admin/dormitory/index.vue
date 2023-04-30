<template>
  <div>
    <el-input
        v-model="name"
        placeholder="请输入宿舍号"
        style="width: 400px;float: left;margin-bottom: 10px;margin-right: 10px;"
        v-on:keyup.enter.native="inputList"
        clearable
      />
    <el-button type="primary" icon="el-icon-plus" @click="openDormitory">
      添加
    </el-button>

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
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            @click="updateList(row)"
            >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
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
      :page-sizes="[5, 7, 10, 20]"
      @current-change="SizeChange"
      @size-change="CurrentChange"
      layout="total,sizes,prev,pager,next,jumper"
    ></el-pagination>

    <!--对话框-->
    <el-dialog title="添加宿舍信息" :visible.sync="dialogFormVisible">
      <!--
        表单验证
          model: 表单验证的数据对象 依据那些数据进行验证
          rules：验证规则
          ref ： 表单每栏内容依据那些数据对象进行验证
          prop:  表单验证的数据字段
      -->
      <el-form :model="dormitory" :rules="rules" ref="dormitory">
        <el-form-item label="宿舍号" label-width="100px" prop="dname">
          <el-input v-model="dormitory.dname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="人数" label-width="100px" prop="">
          <el-input v-model="dormitory.num" autocomplete="off"></el-input>
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
  name: "dormitory",
  data() {
    return {
      pageSize:10,    //一页几条
      pageNum:1,     //默认当前页
      list: [],//班级数据
      total: 2,
      //显示对话框
      dialogFormVisible: false,
      // 用来记录 修改的数据
      dormitory: {
        id:0,
        dname: "", //班级名称
        num: "", //班级人数
      },
      // 搜索框用的参数
      name:'',
      //表单验证规则
      rules: {
        dName: [
          { required: true, message: "请输入班级名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在2到5个字符", trigger: "change" },
        ],
        num: [{ required: true, message: "请输入班级人数", }],
      },
    };
  },

  methods: {
    //获取宿舍数据
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
    //获取宿舍数据(带参数)
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
    // 改变当前页时触发
    CurrentChange(val) {  //第几页触发
      console.log("val:"+val)
      this.pageNum=val;
      //判断搜索框内容刷新表格
      this.pageList();
    },
    // 改变一页多少条数据时触发
    SizeChange(val) {    //多少条一页触发
      console.log("val:"+val)
      this.pageSize=val;
      //判断搜索框内容刷新表格
      this.pageList();
    },  
    // 搜索框搜索功能
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
    //打开对话框
    openDormitory(){
      this.dialogFormVisible = true;
      //清空数据
      this.clearList();
    },
     //清空数据
    clearList(){
      this.dormitory.id=0,
      this.dormitory.dname='',
      this.dormitory.num=''
    },
    // 点击修改数据时获取原数据
    updateList(row){
      this.dialogFormVisible = true;
      this.dormitory.id= row.id,
      this.dormitory.dname= row.dname,
      this.dormitory.num=row.num
    },
    // 修改或增加数据
    updateOrAddClass(){
      if( this.dormitory.id == 0 ){
          this.$axios.post("http://localhost:8083/dormitory/save",this.dormitory).then(res=>{
            const json = res.data;
            if (json.code==200){
              this.clearList();
              //刷新表格
              this.inputList();
            }else {
            }
            this.dialogFormVisible = false;
          });
        }else{
          this.$axios.post("http://localhost:8083/dormitory/mod",this.dormitory).then(res=>{
              const json = res.data;
              if (json.code==200){
                this.clearList();
                //刷新表格
                this.inputList();
              }else {

              }
              this.dialogFormVisible = false;
            });
        }
    },
    // 删除数据
    deleteClass(row){
      console.log(row);
      this.$axios.get("http://localhost:8083/dormitory/del?id="+row.id).then(res=>{
        const json = res.data;
        console.log("json:");

        if (json.code==200){
         
          this.inputList();
        }else {
        //消息提示组件
            console.log("失败")
        }
      })
    }
  },
  // 页面加载前获取数据  beforeMount 在页面加载前使用 在这里调用pageList()方法 获取数据
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