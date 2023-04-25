<template>
  <div>
     <el-card>
        <el-form label-width="80px" > 
          <el-form-item label="学生名称">
            <!--通过双向绑定获取spu名称 点击的是修改将服务器数据传给spuinfo赋值 点击的是添加则不发请求-->
            <el-input placeholder="学生名称" v-model="name"></el-input>
          </el-form-item>
          <el-form-item label="学号">
            <el-input placeholder="学生学号" v-model="num"></el-input>
          </el-form-item>
          <el-form-item label="信息描述">
            <el-input type="textarea" placeholder="报警信息描述" rows="4" v-model="description"></el-input>
          </el-form-item>
          <el-form-item label="报警图片">
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
                :on-success="handlerSuccess" 
                >
              <i class="el-icon-plus"></i>
            </el-upload>
                <!--对话框-->
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
          </el-form-item>
          <el-form-item >
                <el-button type="primary" @click="saveAttrInfo">保存</el-button>
                <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
     </el-card>
  </div>
</template>
<!--
  获取数据后需要考虑两种情况 
  1.修改
  2.添加
  可以在一开始时设置空对象 当点击的是添加的时候那么他是一个空对象
  点击的是修改的时候发送的请求数据赋值给了该对象 从而可以在表单上展示数据
-->
<script>
export default {
  name:'SpuEdit',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      name:'',
      num:'',
      description:'',
      imgUrl:'',
      spuImageList:[]//收集图片
    }
  },
  props:['list'],
  methods: {
    //图片上传之前
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    },
    //图片上传成功执行的回调 将新数组保存下来
    handlerSuccess(res, file){
      //response 上传成功后返回的信息
      //收集上传成功后的数组提交服务器
      this.imgUrl = file.url;
      console.log(res, file);

    },
    //上传图片用到的方法
    // handleAvatarSuccess(res, file) {
    //   //将上传图片的数据接收
    //   this.logoUrl = res.data;
    //   console.log(res,file);
    // },
    //保存属性
    saveAttrInfo(){
      const arr = {name:this.name,num:this.num,imgUrl:this.imgUrl,description:this.description};
      this.list.push(arr);
      console.log(this.list);
      this.$emit('swagScenen',0);
    },
    //取消
    cancel(){
      this.$emit('swagScenen',0);
    }
  },

}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>