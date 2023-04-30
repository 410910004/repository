<template>
  <div>
    <!--添加或修改-->
    <el-card>
      <el-input
        v-model="name"
        placeholder="请输入查询学生姓名"
        style="width: 400px;float: left;margin-bottom: 10px; margin-right: 10px"
        v-on:keyup.enter.native="inputList"
        clearable
      />
      <el-button type="primary" icon="el-icon-plus" @click="openRepair">添加</el-button>
      <div v-show="isShow">
        <el-table border :data="list" style="width: 100%;">
        <el-table-column type="index" prop="prop" label="序号" width="80px" align="center"></el-table-column>
        <el-table-column prop="sid" label="学生学号" width="width"></el-table-column>
        <el-table-column prop="sname" label="学生名称" width="width"></el-table-column>
        <el-table-column prop="description" label="学生保修信息" width="width"></el-table-column>
        <el-table-column prop="time" label="保修时间时间" width="width">
          <template slot-scope="{ row }">
              {{ setTime(row.time)  }}
          </template>
        </el-table-column>
          <el-table-column prop="prop" label="操作" width="300px">
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit"  @click="updateList(row)">修改</el-button>
              <el-popconfirm :title="`确定删除该条信息吗？`" @onConfirm="deleteRepair(row)">
                <el-button slot="reference" type="danger" icon="el-icon-delete">删除</el-button>
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
            <!--对话框-->
            <el-dialog title="添加保修信息" :visible.sync="dialogFormVisible">
              <!--
                表单验证
                  model: 表单验证的数据对象 依据那些数据进行验证
                  rules：验证规则
                  ref ： 表单每栏内容依据那些数据对象进行验证
                  prop:  表单验证的数据字段
              -->
              <el-form :model="repair" :rules="rules" ref="repair">
                <el-form-item label="学生学号" label-width="100px" prop="sid">
                  <el-input v-model="repair.sid" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="学生名称" label-width="100px" prop="sname">
                  <el-input v-model="repair.sname" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="保修信息" label-width="100px" prop="description">
                  <el-input type="textarea"  rows="4" v-model="repair.description" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="保修时间" label-width="100px" prop="time">
                  <template>
                    <div class="block">
                      <el-date-picker
                        v-model="repair.time"
                        type="datetime"
                        placeholder="选择日期时间">
                      </el-date-picker>
                    </div>
                  </template>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateOrAddRepair">确 定</el-button>
              </div>
            </el-dialog>
        </div>
    </el-card>
  </div>
</template>

<script>
export default {
    name:'Repair',
    data() {
      return {
        list:[],
        isShow:true, //是否展示表格
        pageSize:10,    //一页几条
        pageNum:1,     //默认当前页
        total: 2,
        //显示对话框
        dialogFormVisible: false,
        // 用来记录 修改的数据
        repair: {
          id:'',
          sid:'',
          sname:'',
          description:'',
          time:''
        },
        // 搜索框需要用到的参数
        name:'',
        //表单验证规则
        rules: {
          sid: [
            { required: true, message: "请输入学生学号", trigger: "blur" },
            { min:2, max: 9, message: "长度在9个字符", trigger: "change" },
          ],
          sname: [
            { required: true, message: "请输入学生名称", trigger: "blur" },
            { min: 2, max: 5, message: "长度在2到3个字符", trigger: "change" },
          ],
        },
      }
    },
    methods:{
    //获取数据
    pageList() {      //分页后返回的数据
      this.$axios.post("http://localhost:8083/repair/listPage").then(res=>{
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
      this.$axios.post("http://localhost:8083/repair/listPage",{
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
      this.$axios.post("http://localhost:8083/repair/listLike",{
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
    openRepair(){
      this.dialogFormVisible = true;
      //清空数据
      this.clearList();
    },
    clearList(){
      this.repair.id="",
      this.repair.sid="",
      this.repair.sname='',
      this.repair.description=''
      this.repair.time=''
    },
    updateList(row){
      this.dialogFormVisible = true;
      this.repair.id=row.id,
      this.repair.sid= row.sid,
      this.repair.sname= row.sname,
      this.repair.description=row.description
      this.repair.time=row.time
    },
    updateOrAddRepair(){
      if( this.repair.id == "" ){
        this.$axios.post("http://localhost:8083/repair/save",this.repair).then(res=>{
          const json = res.data;
            if (json.code==200){
              this.clearList();
              //刷新表格
              this.inputList();
            }else {}
          this.dialogFormVisible = false;
        });
      }else{
        this.$axios.post("http://localhost:8083/repair/mod",this.repair).then(res=>{
          const json = res.data;
            if (json.code==200){
              this.clearList();
              //刷新表格
              this.inputList();
            }else {}
            this.dialogFormVisible = false;
          });
      }
    },
    deleteRepair(row){
      this.$axios.get("http://localhost:8083/repair/del?id="+row.id).then(res=>{
        const json = res.data;
        console.log("json:");
        if (json.code==200){
          this.inputList();
        }else {
        //消息提示组件
          console.log("失败")
        }
      })
    },
    //去数据库时间的T符号
    setTime(time) {       
      if (time!=null){
        const timeArr= time.split("T");
        return timeArr[0]+" "+timeArr[1];
      }
      return '';
    },
  },
  beforeMount(){
    this.pageList();
  }
}
</script>