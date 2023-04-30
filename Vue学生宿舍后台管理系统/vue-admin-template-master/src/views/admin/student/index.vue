<template>
  <div>
    <!--添加或修改-->
      <el-card>
         <el-input
            v-model="name"
            placeholder="请输入查询学生姓名"
            style="width: 400px;float: left;margin-bottom: 10px; margin-right: 10px;"
            v-on:keyup.enter.native="inputList"
            v-show="isFlag"
            clearable
          />
      <div v-show="isShow">
        <el-button type="primary" icon="el-icon-plus"  @click="openStu">添加</el-button>

        <el-table border :data="attrList" style="width: 100%;">
        <el-table-column prop="id" label="id" width="80px" align="center"></el-table-column>
        <el-table-column prop="no" label="学生学号" width="width"></el-table-column>
        <el-table-column prop="name" label="学生名称" width="width"></el-table-column>
        <el-table-column prop="age" label="学生年龄" width="width"></el-table-column>
        <el-table-column prop="sex" label="学生性别" width="width"></el-table-column>
        <el-table-column prop="classname" label="学生班级" width="width"></el-table-column>
        <el-table-column prop="dormitory" label="学生宿舍号" width="width"></el-table-column>

          <el-table-column prop="prop" label="操作" width="300px">
            <template slot-scope="{row}">
  
              <el-button type="warning" icon="el-icon-edit"  @click="updateList(row)">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" v-on:click="del(row.id)">删除</el-button>
            
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShow">
        <!-- <el-form :model="attrInfo"> -->
        <el-form ref="addList"
            :model="addList"
          >
          <el-form-item label="学生学号">
            <el-input placeholder="请输入学号" v-model="addList.no"></el-input>
          </el-form-item>
          <el-form-item label="学生姓名">
            <el-input placeholder="请输入姓名" v-model="addList.name"></el-input>
          </el-form-item>
          <el-form-item label="学生性别">
            <el-input placeholder="请输入性别" v-model="addList.sex"></el-input>
          </el-form-item>
          <el-form-item label="学生年龄">
            <el-input placeholder="请输入年龄" v-model="addList.age"></el-input>
          </el-form-item>
          <el-form-item label="学生班级">
            <el-input placeholder="请输入班级" v-model="addList.classname"></el-input>
          </el-form-item>
          <el-form-item label="学生宿舍号">
            <el-input placeholder="请输入宿舍号" v-model="addList.dormitory"></el-input>
          </el-form-item>
        </el-form>
         
        <el-button type="primary" @click="addSave" :disabled="attrList.length<1">保存</el-button>
        <el-button @click="isshow">取消</el-button>
      </div>
      <!--  分页-->
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
    name:'Student',
    data() {
      return {
        name:'',
        isFlag:true,
        attrList:[],
        isShow:true, //是否展示表格
        pageSize:10,    //一页几条
        pageNum:1,     //默认当前页
        total:0,       //总记录数
        // 用来记录 修改的数据
        addList:{
          id:'',
          no:'',
          name:'',
          age:'',
          sex:'',
          classname:'',
          dormitory:'',
        },
      }
    },
    methods:{
      // 用来切换页面
      isshow(){
        this.isShow = true;
        this.isFlag = true;
      },
      // 打开学生添加页面
      openStu(){
        this.isShow = false;
        this.isFlag = false;
        this.clearList();
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
      pageList() {      //分页后返回的数据
        this.$axios.post("http://localhost:8083/student/listPage").then(res=>{
          const json = res.data;
          console.log("json:");
          console.log(json);
          if (json.code==200){
            this.attrList=json.data;
            this.total=json.total;
          }else {
            //消息提示组件
            ElMessage({
              showClose: true,
              message: 'Main的pageList错误',
              type: 'error',
            })
          }
        })
      },
      pageList() {      //分页后返回的数据
        this.$axios.post("http://localhost:8083/student/listPage",{
          pageSize:this.pageSize,
          pageNum:this.pageNum
        }).then(res=>{
          const json = res.data;
          console.log("json:");
          console.log(json);
          if (json.code==200){
            this.attrList=json.data;
            this.total=json.total;
          }else {
            console.log("失败")
          }
        })
      },
      inputList() {       //搜索框方法
        this.$axios.post("http://localhost:8083/student/listLike",{
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
            this.attrList=json.data;
            this.total=json.total;
            }else {
            //消息提示组件
                console.log("失败")
            }
        })
      },
      clearList(){
          this.addList.id='',
          this.addList.no='',
          this.addList.name='',
          this.addList.age='',
          this.addList.sex='',
          this.addList.dormitory=''

      },
      updateList(row){
        // console.log(row)
          this.isShow = false,
          this.isFlag=false,
          this.addList.id= row.id,
          this.addList.no=row.no,
          this.addList.name=row.name,
          this.addList.age=row.age,
          this.addList.sex=row.sex,
          this.addList.classname = row.classname,
          this.addList.dormitory=row.dormitory
      },
      addSave() {         //确认添加
        if( this.addList.id == "" ){
          this.$axios.post("http://localhost:8083/student/save",this.addList).then(res=>{
            const json = res.data;
            if (json.code==200){
              this.clearList();
              //刷新表格
              this.inputList();
            }else {
            }
            this.isShow = true;
            this.isFlag = true;  
          });
        }else{
          this.$axios.post("http://localhost:8083/student/mod",this.addList).then(res=>{
              const json = res.data;
              if (json.code==200){
                this.clearList();
                //刷新表格
                this.inputList();
              }else {}
              this.isShow = true;
              this.isFlag = true;
            });
        }
      },
      del(id) {
        this.$axios.get("http://localhost:8083/student/del?id="+id).then(res=> {
          const json = res.data;
          if (json.code == 200) {
            //刷新表格
            this.inputList();
          } else {}
        });
      },
    },
    beforeMount(){
      this.pageList();
    }
}
</script>