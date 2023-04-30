<template>
  <div>
    <!--添加或修改-->
    <el-card>
      <el-input
        v-model="name"
        placeholder="请输入查询学生姓名"
        style="width: 400px;float: left;margin-bottom: 10px;margin-right: 10px;"
        @keyup.enter.native="inputList"
   
      />
      <el-button type="primary" icon="el-icon-plus"  @click="openAttend">添加</el-button>
      <div v-show="isShow">
        <el-table border :data="aList" style="width: 100%;">
        <el-table-column type="index" prop="prop" label="序号" width="80px" align="center"></el-table-column>
        <el-table-column prop="no" label="学生学号" width="width"></el-table-column>
        <el-table-column prop="name" label="学生名称" width="width"></el-table-column>
        <el-table-column prop="sex" label="学生性别" width="width"></el-table-column>
        <el-table-column prop="msg" label="学生考勤信息" width="width"></el-table-column>
        <el-table-column prop="time" label="签到时间" width="width">
          <template slot-scope="{row}">
              {{ setTime(row.time) }}
          </template>
        </el-table-column>
          <el-table-column prop="prop" label="操作" width="300px">
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttend(row)">修改</el-button>
              <el-popconfirm :title="`确定删除该条信息吗？`" @onConfirm="deleteAttend(row)">
                <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
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
          <!--对话框-->
        <el-dialog title="添加教师" :visible.sync="dialogFormVisible">
          <!--
            表单验证
              model: 表单验证的数据对象 依据那些数据进行验证
              rules：验证规则
              ref ： 表单每栏内容依据那些数据对象进行验证
              prop:  表单验证的数据字段
          -->
          <el-form :model="attendList" ref="attendList">
            <el-form-item label="学生学号" label-width="100px" prop="no">
              <el-input v-model="attendList.no" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="学生姓名" label-width="100px" prop="name">
              <el-input v-model="attendList.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="学生性别" label-width="100px" prop="sex">
              <el-input v-model="attendList.sex" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="考勤情况" label-width="100px" prop="msg">
              <el-input v-model="attendList.msg" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="考勤时间" label-width="100px" prop="time">
              <template>
                <div class="block">
                  <el-date-picker
                    v-model="attendList.time"
                    type="datetime"
                    placeholder="签到时间">
                  </el-date-picker>
                </div>
              </template>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateOrAddAttend">确 定</el-button>
          </div>
        </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
    name:'Attendance',
    data() {
      return {
        aList:[],//存储发送请求获取的数据  
        isShow:true, //是否展示表格
        total:'1',
        pageSize:10,    //一页几条
        pageNum:1,     //默认当前页
        name:'',
        dialogFormVisible:false,
        attendList:{
          id:'',
          no:'',
          name:'',
          sex:'',
          msg:'',
          time:''
        }
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
      pageList(){
        this.$axios.post("http://localhost:8083/attendance/listPage").then(res=>{
          const json = res.data;
          if(json.code == 200){
            this.aList = json.data;
            this.total=json.total;
          }else {}
        })
      },
      pageList:function () {      //分页后返回的数据
        this.$axios.post("http://localhost:8083/attendance/listPage",{
          pageSize:this.pageSize,
          pageNum:this.pageNum
        }).then(res=>{
          const json = res.data;
          console.log("json:");
          console.log(json);
          if (json.code==200){
            this.aList=json.data;
            this.total=json.total;
          }else {
            console.log("失败")
          }
        })
      },
      inputList:function () {       //搜索框方法
        this.$axios.post("http://localhost:8083/attendance/listLike",{
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
            this.aList=json.data;
            this.total=json.total;
            }else {
            //消息提示组件
                console.log("失败")
            }
        })
      },
      setTime:function (time) {       //去数据库时间的T符号
        if (time!=null){
          const timeArr= time.split("T");
          return timeArr[0]+" "+timeArr[1];
        }
        return '';
      },
      clearAttendList(){
        this.attendList.no = "",
        this.attendList.name="",
        this.attendList.sex='',
        this.attendList.msg='',
        this.attendList.time=''
      },
      openAttend(){
        this.dialogFormVisible=true;
        this.clearAttendList();
      },
      updateAttend(row){
        this.dialogFormVisible = true;
        this.attendList.id = row.id;
        this.attendList.no = row.no;
        this.attendList.name = row.name;
        this.attendList.sex = row.sex;
        this.attendList.msg = row.msg;
        this.attendList.time = row.time
      },
      deleteAttend(row){
        this.$axios.get("http://localhost:8083/attendance/del?id="+row.id).then(res=>{
          const json = res.data;
          if(json.code == 200){
              this.aList = json.data;
              this.pageList();
          }else{}
        })
      },
      updateOrAddAttend(){
        if( this.attendList.id == "" ){
            this.$axios.post("http://localhost:8083/attendance/save",this.attendList).then(res=>{
              const json = res.data;
              if (json.code==200){
                this.dialogFormVisible = false
                this.clearAttendList();
                //刷新表格
                this.pageList();
              }else {}
            });
          }else{
            this.$axios.post("http://localhost:8083/attendance/mod",this.attendList).then(res=>{
                const json = res.data;
                if (json.code==200){
                  this.dialogFormVisible = false
                  this.clearAttendList();
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
}
</script>