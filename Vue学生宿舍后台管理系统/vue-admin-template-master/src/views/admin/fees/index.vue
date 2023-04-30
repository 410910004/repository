<template>
  <div>
    <el-card>
      <div>
        <el-input
          v-model="name"
          placeholder="请输入查询学生姓名"
          style="width: 400px;float: left;margin-bottom: 10px; margin-right: 10px;"
          v-on:keyup.enter.native="inputList"
          clearable
        />
        <el-button type="primary" icon="el-icon-plus" @click="openPay">添加</el-button>
        <el-table style="width: 100%" border :data="list">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="sid" label="学生学号"></el-table-column>
          <el-table-column prop="sname" label="学生名称"></el-table-column>
          <el-table-column prop="dormitory" label="宿舍号"></el-table-column>
          <el-table-column prop="num" label="宿舍人数"></el-table-column>
          <el-table-column prop="starttime" label="开始时间"  width="220px">
            <template slot-scope="{ row }">
                {{ setTime(row.starttime) }}
            </template>
          </el-table-column>
          <el-table-column prop="endtime" label="缴纳时间"  width="220px">
            <template slot-scope="{ row }">
                {{ setTime(row.endtime) }}
            </template>
          </el-table-column>
          <el-table-column prop="fees" label="缴纳费用"></el-table-column>
        
          <el-table-column prop="prop" label="操作"  width="220px">
            <template slot-scope="{ row }">
              <el-button type="warning"  icon="el-icon-edit"  @click="updateList(row)">修改</el-button>
              <el-popconfirm :title="`确定删除该消息吗？`" @onConfirm="deleteRepair(row)">
                <el-button slot="reference" type="danger" icon="el-icon-delete">删除</el-button>
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
      <el-dialog title="添加缴纳信息" :visible.sync="dialogFormVisible">
        <!--
        表单验证
          model: 表单验证的数据对象 依据那些数据进行验证
          rules：验证规则
          ref ： 表单每栏内容依据那些数据对象进行验证
          prop:  表单验证的数据字段
      -->
       <!--通过双向绑定获取spu名称 点击的是修改将服务器数据传给spuinfo赋值 点击的是添加则不发请求-->
        <el-form label-width="80px" :model="pay" :rules="rules" ref="pay">
          <el-form-item label="学生学号" prop="sid">
            <el-input placeholder="学生学号" v-model="pay.sid"></el-input>
          </el-form-item>
          <el-form-item label="学生名称" prop="sname">
            <el-input placeholder="学生名称" v-model="pay.sname"></el-input>
          </el-form-item>
          <el-form-item label="宿舍号"  prop="dormitory">
            <el-input placeholder="宿舍号" v-model="pay.dormitory"></el-input>
          </el-form-item>
          <el-form-item label="宿舍人数"  prop="num">
            <el-input placeholder="宿舍人数" v-model="pay.num"></el-input>
          </el-form-item>
          <el-form-item label="开始时间"  prop="startTime">
            <template>
              <div class="block">
                <el-date-picker
                  v-model="pay.starttime"
                  type="datetime"
                  placeholder="选择开始时间">
                </el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="缴纳时间"  prop="endTime">
            <template>
              <div class="block">
                <el-date-picker
                  v-model="pay.endtime"
                  type="datetime"
                  placeholder="选择缴纳时间">
                </el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="缴纳费用"  prop="fees">
            <el-input placeholder="缴纳费用" v-model="pay.fees"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateOrAddRepair">保存</el-button>
            <el-button @click="dialogFormVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default({
  name: "Fees",
  data() {
    return {
      isShow:true, //是否展示表格
      pageSize:10,    //一页几条
      pageNum:1,     //默认当前页
      total: 2,
      list:[],
      //切换对话框
      dialogFormVisible: false,
      // 用来记录 修改的数据
      pay: {
          id:'',
          sid:'',
          sname:'',
          dormitory:'',
          num:'',
          starttime:'',
          endtime:'',
          fees:''
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
    };
  },
  methods: {
    pageList() {//分页后返回的数据
      this.$axios.post("http://localhost:8083/payment/listPage").then(res=>{
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
      this.$axios.post("http://localhost:8083/payment/listPage",{
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
      this.$axios.post("http://localhost:8083/payment/listLike",{
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
    openPay(){
      this.dialogFormVisible = true;
      //清空数据
      this.clearList();
    },
    clearList(){
      this.pay.id="",
      this.pay.sid="",
      this.pay.sname='',
      this.pay.dormitory=''
      this.pay.num ='',
      this.pay.starttime = ''
      this.pay.endtime='',
      this.pay.fees = ''
    },
    updateList(row){
      this.dialogFormVisible = true;
      this.pay.id=row.id,
      this.pay.sid= row.sid,
      this.pay.sname= row.sname,
      this.pay.dormitory=row.dormitory,
      this.pay.starttime = row.starttime,
      this.pay.endtime = row.endtime,
      this.pay.fees=row.fees
    },
    updateOrAddRepair(){
      if( this.pay.id == "" ){
        this.$axios.post("http://localhost:8083/payment/save",this.pay).then(res=>{
          const json = res.data;
            if (json.code==200){
              this.clearList();
              //刷新表格
              this.inputList();
            }else {}
          this.dialogFormVisible = false;
        });
      }else{
        this.$axios.post("http://localhost:8083/payment/mod",this.pay).then(res=>{
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
      this.$axios.get("http://localhost:8083/payment/del?id="+row.id).then(res=>{
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
    //去数据库时间的T符号 在页面会有时间中间有 T 符号
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
})
</script>

<style>
</style>