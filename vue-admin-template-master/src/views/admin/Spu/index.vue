<template>
  <div>
    <el-card>
      <div>
        <el-input
          v-model="name"
          placeholder="请输入查询学生姓名"
          style="width: 400px;float: left;margin-bottom: 10px;"
          v-on:keyup.enter.native="inputList"
          clearable
        />
        <el-table style="width: 100%" border :data="list">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column prop="name" label="学生名称"></el-table-column>
          <el-table-column prop="num" label="学生学号"></el-table-column>
          <el-table-column prop="imgUrl" label="图片信息" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="description" label="报警信息描述">
            <template slot-scope="{row}">
              <span>{{ row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button type="success" icon="el-icon-plus" size="mini" title="添加报警信息"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" title="修改报警信息" @click="updateSpu(row)"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini" title="报警信息详情"></el-button>
              <el-popconfirm :title="`确定删除该消息吗？`" @onConfirm="deleteAttr(row)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除报警信息"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px; textalign: center"
          :total="total"
          :current-page="page"
          :page-size="limit"
          @current-change="changePage"
          @size-change="changeSize"
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
        <el-form label-width="80px" :model="addArr" ref="addArr">
          <el-form-item label="学生名称" prop="name">
            <!--通过双向绑定获取spu名称 点击的是修改将服务器数据传给spuinfo赋值 点击的是添加则不发请求-->
            <el-input placeholder="学生名称" v-model="addArr.name"></el-input>
          </el-form-item>
          <el-form-item label="学号"  prop="num">
            <el-input placeholder="学生学号" v-model="addArr.num"></el-input>
          </el-form-item>
          <el-form-item label="信息描述"  prop="description">
            <el-input
              type="textarea"
              placeholder="报警信息描述"
              rows="4"
              v-model="addArr.description"
            ></el-input>
          </el-form-item>
          <el-form-item label="报警图片" prop="imgUrl">
            <!--
                action ：上传路径
                list-type:样式风格
                file-list：上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
                需要有两个属性name、url.
                on-success:图片上传成功时候执行的回调
            -->
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleAvatarSuccess"
              >
              <img
                v-if="addArr.imgUrl"
                :src="addArr.imgUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveAttrInfo">保存</el-button>
            <el-button @click="dialogFormVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>
<!--
  因为SpuForm是spu的子组件当父组件挂载的时候会挂载子组件 从而不能在子组件的mounted中发送请求获取数据
  可以使用在子组件上使用ref 获取子组件的实例对象 从而点击修改的时候调用子组件的方法发送请求获取数据
-->
<script>
export default {
  name: "Spu",
  data() {
    return {
      //显示对话框
      dialogFormVisible: false,
      page: 1,
      limit: 3,
      records: [], //记录数组
      total: 0, //总数据
      list: [
        {
          id: "001",
          name: "张三",
          num: "212211111",
          description: "全勤",
          imgUrl: "",
        },
        {
          id: "002",
          name: "李四",
          num: "212211112",
          description: "全勤",
          imgUrl: "",
        },
      ],
      addArr:{
        name:'',
        num:'',
        description:'',
        imgUrl:'',
      },
      list:[
          {id:'001',name:'李峰',num:'212206632',imgUrl:'http://localhost:8083/uploadFiles/image/5.jpg',description:"该学生视线长时间远离"},
          {id:'002',name:'张涛',num:'212206647',imgUrl:'http://localhost:8083/uploadFiles/image/8.png',description:"该学生坐姿不端正"},
        ]
    };
  },
  methods: {
    changePage(pager) {
      //pager可以实现点击那个页面显示那个页码
      //重新修改页码
      this.page = pager;
    },
    //修改每页展示几条数据
    changeSize(limit) {
      this.limit = limit;
    },
    //添加Spu
    addSpu() {
      this.dialogFormVisible = true;
      this.addArr={};

    },
    //保存
    saveAttrInfo(){
      this.list.push(this.addArr);
      this.dialogFormVisible = false;
    },
    //上传图片用到的方法
    handleAvatarSuccess(res, file) {
      //将上传图片的数据接收
      this.addArr.imgUrl = file.url;
      console.log(res, file);
    },
    //修改Spu
    // updateSpu(row) {},
    //删除属性
    // async deleteAttr(row) {}
  },
};
</script>

<style>
</style>