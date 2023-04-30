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
        total: 2,    //条数
        list:[],  //记录数据
        name:'',  //搜索参数
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
})
</script>

<style>
</style>