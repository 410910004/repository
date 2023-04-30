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
      total: 2,   //条数
      name:'',     //搜索参数
    }
  },
  methods:{
    //获取班级数据
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