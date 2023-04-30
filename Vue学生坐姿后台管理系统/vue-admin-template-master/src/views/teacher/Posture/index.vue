<template>
  <div>
    <el-card>
      <div>
        <el-input
              v-model="name"
              placeholder="请输入查询姓名"
              style="width: 400px;float: left;margin-bottom: 10px;"
              v-on:keyup.enter.native="inputList"
              clearable
            />
        <el-table style="width: 100%" border :data="list">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="stuid" label="学生姓名" width="150">
            <template slot-scope="{row}">
              <span>{{ getUserName(row.stuid) }}</span>
              {{ selectUserName(row.stuid) }}
            </template>
          </el-table-column>
          <el-table-column prop="isfocus" label="学生专注情况"  width="150"></el-table-column>
          <el-table-column prop="img" label="坐姿图片"  width="150">
            <template slot-scope="{row}">
              <img :src="getImageUrl(row.img)" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="updatetime" label="坐姿收集时间" width="180">
            <template slot-scope="{row}">
              {{ setTime(row.updatetime) }}
            </template>
            
          </el-table-column>
          <el-table-column prop="start" label="坐姿评分" width="width"></el-table-column>

          <el-table-column prop="prop" label="操作" width="300px">
              <template slot-scope="{row}">
                <input class="file" name="file" type="file" id="imgFile"
                 accept="image/png,image/gif,image/jpeg"
                 v-on:change="imgChange"/>
                 <el-button type="primary" v-on:click="update(row.id)" size="mini" >{{row.img===null?"设置图片":"修改图片"}}</el-button>
    
                <!-- <el-button type="warning" icon="el-icon-edit">修改</el-button> -->
                <el-button type="danger" icon="el-icon-delete" size="mini" v-on:click="del(row.id)">删除</el-button>
              
              </template>
            </el-table-column>
           
          </el-table>

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
            style="margin-left: 30%"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>
  <!--
    因为SpuForm是spu的子组件当父组件挂载的时候会挂载子组件 从而不能在子组件的mounted中发送请求获取数据
    可以使用在子组件上使用ref 获取子组件的实例对象 从而点击修改的时候调用子组件的方法发送请求获取数据
  -->
  <script>
export default {
  name: "Posture",
  data() {
    return {
      name:'',
      pageSize: 10,
      param:new FormData(),     //创建图片表单对象
      pageNum: 1,
      limit: 3,
      total: 0, //总数据
      list: [],
      userName:[],      //用户名称
    };
  },
  methods: {
    inputList:function () {       //搜索框方法
          this.$axios.post("http://localhost:8083/sit/listLike",{
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
    getUserName:function(id){         //通过用户id查找用户名字
          if (id===undefined) return;
          let userid=id;
          let flag = true;
          this.$axios.get("http://localhost:8083/student/getName?id="+id).then(res=>{
            const json = res.data;
            if (json.code==200){
              for (let i=0;i<this.userName.length;i++){
                if (this.userName[i].id==userid){
                  flag=false;
                  break;
                }
              }
              if (flag){
                this.userName.push({id:userid,name:json.data});
              }
            }else {
       
            }
          })
        },
        selectUserName:function (id){
          for (let i=0;i<this.userName.length;i++){
            if (this.userName[i].id==id){
              return this.userName[i].name;
            }
          }
        },
    del:function (id) {
      this.$axios.get("http://localhost:8083/sit/del?id="+id).then(res=> {
        const json = res.data;
        if (json.code == 200) {
          //刷新表格
          this.pageList();
        } else {}
      });
    },
    update:function (id) {        //上传图片
      let config = {            //添加请求头
        headers:{'Content-Type':'multipart/form-data'}  
        };
        this.$axios.post("http://localhost:8083/sit/setId?id="+id).then(res=>{
          const json = res.data;
          if (json.code==200){    
            //消息提示组件
            console.log("成功")
            this.$axios.post('http://localhost:8083/sit/uploadPictures',this.param,config)   //上传图片
              .then(res=>{
                const json = res.data;
                if (json.code==200){
                  console.log("成功")
                  // this.courseTable=json.data;
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
    imgChange:function (e) {      //图片发生改变触发
      let file = e.target.files[0];
      this.param.append('file',file,file.name);//通过append向form对象添加数据
    },
    getImageUrl:function (name){    //把地址转换，不然无法显示图片
      if (name == null){
        return null;
      }
      return "http://localhost:8083/uploadFiles/"+name
    },
    setTime:function (time) {       //去数据库时间的T符号
      if (time!=null){
        const timeArr= time.split("T");
        return timeArr[0]+" "+timeArr[1];
      }
      return '';
    },
    CurrentChange: function (val) {
      //第几页触发
      console.log("val:" + val);
      this.pageNum = val;
      //判断搜索框内容刷新表格
      this.pageList();
    },
    SizeChange: function (val) {
      //多少条一页触发
      console.log("val:" + val);
      this.pageSize = val;
      //判断搜索框内容刷新表格
      this.pageList();
    },
    pageList() {
      this.$axios
        .post("http://localhost:8083/sit/listPage", {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        })
        .then((res) => {
          const json = res.data;
          console.log("json:");
          console.log(json);
          if (json.code == 200) {
            this.list = json.data;
            this.total = json.total;
          } else {
            console.log("失败");
          }
        });
    },
    //删除属性
    async deleteAttr(row) {
      let result = await this.$API.spu.reqDeleteAttr(row.id);
      if (result.code == 200) {
        this.$message("删除成功");
        if (this.records.length < 1) {
          this.getSpuList(this.page - 1);
        } else {
          this.getSpuList(this.page);
        }
      } else {
        this.$message("删除失败");
      }
    },
  },
  beforeMount() {
    this.pageList();
  },
}
</script>
  
  <style>
</style>