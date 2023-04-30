<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategory="getCategory" :show='isShow'/>
    </el-card>
    <!--添加或修改-->
    <el-card>
      <div v-show="isShow">
        <el-button type="primary" icon="el-icon-plus"  @click="addAttr">添加</el-button>

        <el-table border :data="attrList" style="width: 100%;">
        <el-table-column type="index" prop="prop" label="序号" width="80px" align="center"></el-table-column>
        <el-table-column prop="num" label="学生学号" width="width"></el-table-column>
        <el-table-column prop="name" label="学生名称" width="width"></el-table-column>
        <el-table-column prop="info" label="学生考勤信息" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="300px">
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit"  @click="updateAttr(row)">修改</el-button>
              <el-popconfirm :title="`确定删除该条信息吗？`" @onConfirm="deleteAttr(row)">
                <el-button slot="reference" type="danger" icon="el-icon-delete">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShow">
        <el-form  :model="attrInfo">
          <el-form-item label="学生学号">
            <el-input placeholder="请输入学号" v-model="attrList.num"></el-input>
          </el-form-item>
          <el-form-item label="学生姓名">
            <el-input placeholder="请输入姓名" v-model="attrList.name"></el-input>
          </el-form-item>
          <el-form-item label="学生考勤信息">
            <el-input placeholder="请输入考勤信息" v-model="attrList.info"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrList.length<1">保存</el-button>
        <el-button @click="isShow=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep  from 'lodash/cloneDeep';
export default {
    name:'Attr',
    data() {
      return {
        attrList:[
          {id:'001',name:'张三',num:'212211111',info:'全勤'},
          {id:'002',name:'李四',num:'212211112',info:'全勤'},
          {id:'003',name:'王五',num:'212211113',info:'全勤'},
          {id:'004',name:'马六',num:'212211114',info:'全勤'},
          {id:'005',name:'张小小',num:'212211115',info:'缺勤1次'},
          {id:'006',name:'陈小明',num:'212211116',info:'缺勤3次'},
        ],//存储三级分类发送请求获取的数据
        //用来存储子组件传来的 三级分类的id 信息
        isShow:true, //是否展示表格
      }
    },
    methods:{
      //对分类进行处理和获取
      getCategory({id,level}){
        //将三级分类 区分 重新选取数据时将 三级分类置空
        if(level == 1){
          this.category1id = id;

          this.category2id ='';
          this.category3id='';

        }else if(level == 2){
          this.category2id = id;
          this.category3id ='';

        }else{
          this.category3id = id;
          //收集三级分类后发送请求获取数据
          this.getCategoryList();
        }
      },
      //获取属性
      async getCategoryList(){
        let result = await this.$API.attr.reqgetAttrInfoList(this.category1id,this.category2id,this.category3id);
        if(result.code == 200){
          console.log(result);
          this.attrList = result.data;
        }
      },
      //添加属性
      addAttr(){
        //将表格隐藏
        this.isShow=false;
        //清空属性
        this.attrInfo ={
          "attrName": "",
          "attrValueList": [ 
              //默认设置为空 只有在添加的时候才赋值
          ],
          //categoryId 指的是三级分类的id
          "categoryId": this.category3id,//这里可以获取三级分类的id   
          "categoryLevel": 3,  
        }
      },
      //添加属性值
      addAttrValue(){
          this.attrInfo.attrValueList.push(
            {
              "attrId":this.attrInfo.id,
              "valueName":'',
              //为每个属性添加一个标记 用来切换span与input  
              flag:true 
              //在data里面设置flag会导致所有input与span的切换 不会独立分开
            }
        )
      },
      //修改属性
      updateAttr(row){
        //index 指的是点击的某条属性数据
        this.isShow = false;//将表格隐藏
        //row 指的是点击的数据 并将其赋值给attrInfo
        this.attrInfo =cloneDeep(row); //因为row结构复杂无法使用浅拷贝 所有使用loadash 里面的cloneDeep
        //遍历数组将所有元素添加一个flag属性 值为false
        this.attrInfo.attrValueList.forEach(item=>{
          this.$set(item,'flag',false);
        })
      },
      //编辑
      toEdit(row,index){
        row.flag = true;
        //使用$next
        this.$nextTick(()=>{
          this.$refs[index].focus();
        })
      },
      //删除属性值
      deleteAttrValue(index){
        this.attrInfo.attrValueList.splice(index);
      },
      //保存修改的属性
      async addOrUpdateAttr(){
        //1. 接口不允许传入属性值为空的属性 
        //2. 属性中不存在flag 需要删除
        this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
          //过滤属性值不为空的
          if(item.valueName !=''){
            delete item.flag;
            return true;
          }
        })
        //发送保存请求
        try {
          let result = await this.$API.attr.reqSaveAttrInfo(this.attrInfo);
          console.log(result);
          if(result.code == 200){
            this.$message('保存成功');
          }
        } catch (error) {
          this.$message('保存失败');
        }
      },
      //删除属性
      async deleteAttr(row){
        let result = await this.$API.attr.reqDeleteAttr(row.id);
        if(result.code == 200){
          this.$message('删除成功');
          this.getCategoryList();
        }
      }
    }
}
</script>