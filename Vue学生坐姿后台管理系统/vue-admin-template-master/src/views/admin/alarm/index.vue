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
        <el-button type="primary" icon="el-icon-plus" @click="openAlarm">添加信息</el-button>
        <el-table style="width: 100%" border :data="list">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column prop="no" label="学生学号"></el-table-column>
          <el-table-column prop="name" label="学生名称"></el-table-column>
          <el-table-column prop="imgUrl" label="图片信息" width="width">
            <template slot-scope="{row}">
              <img :src=" getImageUrl(row.img)" style="width: 100%;height:100%;" alt="暂无图片">
            </template>
          </el-table-column>
          <el-table-column prop="msg" label="报警信息描述"></el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row }">
              <input class="file" name="file" type="file" id="imgFile"
                 accept="image/png,image/gif,image/jpeg"
                 v-on:change="imgChange"/>
                 <el-button type="primary" v-on:click="update(row.id)" size="mini" >{{row.img===null?"设置图片":"修改图片"}}</el-button>
              <el-button type="warning" size="mini"  @click="updateAlarms(row)">修改</el-button>
              <el-popconfirm :title="`确定删除该消息吗？`" @onConfirm="deleteAlarm(row)">
                <el-button slot="reference" type="danger" size="mini" >删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px; textalign: center"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @current-change="CurrentChange"
          @size-change="SizeChange"
          :page-sizes="[3, 5, 10]"
          layout="total,sizes,prev,pager,next,jumper"
        ></el-pagination>
      </div>
      <el-dialog title="添加报警信息" :visible.sync="dialogFormVisible">
        <!--
        表单验证
          model: 表单验证的数据对象 依据那些数据进行验证
          rules：验证规则
          ref ： 表单每栏内容依据那些数据对象进行验证
          prop:  表单验证的数据字段
      -->
        <el-form label-width="80px" :model="alarm" ref="alarm">
          <el-form-item label="学号"  prop="no">
            <el-input placeholder="学生学号" v-model="alarm.no"></el-input>
          </el-form-item>
          <el-form-item label="学生名称" prop="name">
            <!--通过双向绑定获取spu名称 点击的是修改将服务器数据传给spuinfo赋值 点击的是添加则不发请求-->
            <el-input placeholder="学生名称" v-model="alarm.name"></el-input>
          </el-form-item>
          <el-form-item label="信息描述"  prop="msg">
            <el-input
              type="textarea"
              placeholder="报警信息描述"
              rows="4"
              v-model="alarm.msg"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="saveAlarm">保存</el-button>
            <el-button @click="dialogFormVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Alarm",
  data() {
    return {
      //显示对话框
      dialogFormVisible: false,
      pageNum: 1,
      pageSize:10,
      param:new FormData(),     //创建图片表单对象
      total: 0, //总数据
      list: [],
      alarm:{
        id:'',
        no:'',
        name:'',
        msg:'',
      },
      name:''
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
      pageList(){
        this.$axios.post("http://localhost:8083/alarm/listPage").then(res=>{
          const json = res.data;
          if(json.code == 200){
            this.list = json.data;
            this.total=json.total;
          }else {}
        })
      },
      pageList:function () {      //分页后返回的数据
        this.$axios.post("http://localhost:8083/alarm/listPage",{
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
      clearList(){
        this.alarm.id = '',
        this.alarm.no ='',
        this.alarm.name = '',
        this.alarm.sex = '',
        this.alarm.msg = ''
      },
      updateAlarms(row){
        this.dialogFormVisible = true;
        this.alarm.id = row.id,
        this.alarm.no = row.no,
        this.alarm.name = row.name,
        this.alarm.sex = row.sex,
        this.alarm.msg = row.msg
      },
      openAlarm(){
        this.dialogFormVisible=true;
        this.clearList();
      },
      getImageUrl(name){
        if (name == null){
            return null;
          }
        return "http://localhost:8083/uploadFiles/"+name
      },
      imgChange:function (e) {      //图片发生改变触发
        let file = e.target.files[0];
        this.param.append('file',file,file.name);//通过append向form对象添加数据
      },
      update:function (id) {        //上传图片
        let config = {            //添加请求头
          headers:{'Content-Type':'multipart/form-data'}
        }
        this.$axios.post("http://localhost:8083/alarm/setId?id="+id).then(res=>{
            const json = res.data;
            if (json.code==200){    
              //消息提示组件
              console.log("成功")
              this.$axios.post('http://localhost:8083/alarm/uploadPictures',this.param,config)   //上传图片
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
      saveAlarm(){
        if( this.alarm.id == "" ){
            this.$axios.post("http://localhost:8083/alarm/save",this.alarm).then(res=>{
              const json = res.data;
              if (json.code==200){
                this.clearList();
                this.dialogFormVisible=false;
                //刷新表格
                this.pageList();
              }else {
              }

            });
          }else{
            this.$axios.post("http://localhost:8083/alarm/mod",this.alarm).then(res=>{
                const json = res.data;
                if (json.code==200){
                  this.clearList();
                  this.dialogFormVisible=false;
                  //刷新表格
                  this.pageList();
                }else {
}        
              });
          }
      },
      deleteAlarm(row){
        this.$axios.get("http://localhost:8083/alarm/del?id="+row.id).then(res=>{
          const json = res.data;
            if (json.code == 200) {
              //刷新表格
              this.pageList();
            } else {}
        })
      },
      inputList:function () {       //搜索框方法
          this.$axios.post("http://localhost:8083/alarm/listLike",{
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
</style>