<template>
    <div>
      <!--添加或修改-->
        <el-card>
           <el-input
              v-model="name"
              placeholder="请输入查询学生姓名"
              style="width: 400px;float: left;margin-bottom: 10px;"
              v-on:keyup.enter.native="inputList"
              v-show="isFlag"
              clearable
            />
        <div v-show="isShow">
          <!-- <el-button type="primary" icon="el-icon-plus"  @click="addAttr">添加</el-button> -->
  
          <el-table border :data="attrList" style="width: 100%;">
          <el-table-column prop="id" label="id" width="80px" align="center"></el-table-column>
          <el-table-column prop="no" label="学生学号" width="width"></el-table-column>
          <el-table-column prop="name" label="学生名称" width="width"></el-table-column>
          <!-- <el-table-column prop="age" label="学生年龄" width="width"></el-table-column>
          <el-table-column prop="sex" label="学生性别" width="width"></el-table-column> -->
          <el-table-column prop="classname" label="学生班级" width="width"></el-table-column>
          <el-table-column prop="img" label="学生头像" width="width">
            <template slot-scope="{row}">
              <img :src=" getImageUrl(row.img)" style="width: 100%;height:100%;" alt="暂无图片">
            </template>
          </el-table-column>
          <el-table-column prop="start" label="评分统计" width="width">
            <template slot-scope="{row}">
            <span>{{avgStart(row.id)}}</span> 
            {{ getnumArr(row.id) }}
            </template>
          </el-table-column>
            <el-table-column prop="prop" label="操作" width="300px">
              <template slot-scope="{row}">
                <input class="file" name="file" type="file" id="imgFile"
                 accept="image/png,image/gif,image/jpeg"
                 v-on:change="imgChange"/>
                 <el-button type="primary" v-on:click="update(row.id)" size="mini">{{row.img===null?"设置图片":"修改图片"}}</el-button>
    
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateList(row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" v-on:click="del(row.id)">删除</el-button>
              
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
            <el-form-item label="学生班级">
              <el-input placeholder="请输入班级" v-model="addList.classname"></el-input>
            </el-form-item>
            <el-form-item label="学生评分">
              <el-input placeholder="请输入评分" v-model="addList.start"></el-input>
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
      name:'Statistics',
      data() {
        return {
          name:'',
          isFlag:true,
          param:new FormData(),     //创建图片表单对象
          attrList:[],//存储三级分类发送请求获取的数据
          //用来存储子组件传来的 三级分类的id 信息
          isShow:true, //是否展示表格
          pageSize:10,    //一页几条
          pageNum:1,     //默认当前页
          total:0,       //总记录数
          addList:{
            id:'',
            no:'',
            name:'',
            age:'',
            sex:'',
            classname:'',
            start:''
          },
          numArr:[],        //分数数组
        }
      },
      methods:{
        isshow(){
          this.isShow = true;
          this.isFlag = true;
        },
        inputList:function () {       //搜索框方法
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
        clearList:function(){
            this.addList.id='',
            this.addList.no='',
            this.addList.name='',
            this.addList.age='',
            this.addList.sex='',
            this.addList.classname=''
            this.numArr.start=''
        },
     

        updateList:function(row){
 
            this.isShow = false,
            this.isFlag = false,
            this.addList.id= row.id,
            this.addList.no=row.no,
            this.addList.name=row.name,
            this.addList.age=row.age,
            this.addList.sex=row.sex,
            this.addList.classname=row.classname,
            this.addList.start = this.numArr[row.id].name
        },
        addSave:function () {         //确认添加
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
                }else {

                }
                this.isShow = true;
                this.isFlag = true;
              });
          }
        },
        del:function (id) {
          this.$axios.get("http://localhost:8083/student/del?id="+id).then(res=> {
            const json = res.data;
            if (json.code == 200) {
              //刷新表格
              this.inputList();
            } else {

            }

          });
        },

        getImageUrl:function (name){    //把地址转换，不然无法显示图片
          if (name == null){
            return null;
          }
          return "http://localhost:8083/uploadFiles/"+name
        },
        pageList:function () {      //分页后返回的数据
              this.$axios.post("http://localhost:8083/student/listPage").then(res=>{
                const json = res.data;
                console.log("json:");
                console.log(json);
                if (json.code==200){
                  this.attrList=json.data;
                  this.total=json.total;
                }else {
                  
                }
              })
            },
           
         
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
        
        imgChange:function (e) {      //图片发生改变触发
          let file = e.target.files[0];
          this.param.append('file',file,file.name);//通过append向form对象添加数据
        },
        update:function (id) {        //上传图片
          let config = {            //添加请求头
            headers:{'Content-Type':'multipart/form-data'}
            
          };
          this.$axios.post("http://localhost:8083/student/setId?id="+id).then(res=>{
            const json = res.data;
            if (json.code==200){    
              //消息提示组件
              console.log("成功")
              this.$axios.post('http://localhost:8083/student/uploadPictures',this.param,config)   //上传图片
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
          avgStart:function (stuid) {      //统计数据
            let studentid=stuid;
            let flag = true;
            this.$axios.get("http://localhost:8083/sit/statisticalScore?stuid="+stuid).then(res=>{
                const json = res.data;
                if (json.code==200){
                    for (let i=0;i<this.numArr.length;i++){
                        if (this.numArr[i].id==studentid){
                            flag=false;
                            break;
                        }
                    }
                    if (flag){
                        this.numArr.push({id:studentid,name:json.data});
                    }
                }else {
                    for (let i=0;i<this.numArr.length;i++){
                        if (this.numArr[i].id==studentid){
                            flag=false;
                            break;
                        }
                    }
                    if (flag){
                        this.numArr.push({id:studentid,name:0});
                    }
                }
              })
            },
            getnumArr:function (id){
                for (let i=0;i<this.numArr.length;i++){
                    if (this.numArr[i].id==id){
                        return this.numArr[i].name;
                    }
                }
            },
        },
      beforeMount(){
        this.pageList();
      }
  }
  </script>