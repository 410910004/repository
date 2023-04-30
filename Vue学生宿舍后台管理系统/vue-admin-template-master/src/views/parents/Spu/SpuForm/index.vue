<template>
  <div>
     <el-card>
        <el-form label-width="80px" :model="spuInfo"> 
          <el-form-item label="学生名称">
            <!--通过双向绑定获取spu名称 点击的是修改将服务器数据传给spuinfo赋值 点击的是添加则不发请求-->
            <el-input placeholder="学生名称" v-model="spuInfo.spuName"></el-input>
          </el-form-item>
          <el-form-item label="班级">
            <el-select placeholder="请选择班级" v-model="spuInfo.tmId">
                <el-option :label="tm.tmName" :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="信息描述">
            <el-input type="textarea" placeholder="报警信息描述" rows="4" v-model="spuInfo.description"></el-input>
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
                action="/dev-api/admin/product/fileUpload" 
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handlerSuccess"
                :file-list="spuImageList"
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
      spuInfo:{
        //三级分类的id
        category3Id: 0,
        //spu的名称
        spuName: "",
        //品牌id
        tmId: '',
        //描述
        description: "",
        //图片列表
        spuImageList:[
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0
          // }
        ],
        //属性列表
        spuSaleAttrList: [
          // {
          //   //属性id
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   //属性名称
          //   saleAttrName: "",
          //   spuId: 0,
          //   //属性值列表
          //   spuSaleAttrValueList:[
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "bulr",
          //       spuId: 0
          //     }
          //   ]
          // }
        ]
      },//存储spu信息
      baseInfoList:[],//存储基本信息
      spuImageList:[],//存储图片列表
      tradeMarkList:[],//存储品牌信息
      attrIdAndName:''//用来存储选择的属性的id值与名称
    }
  },
  methods: {
    //图片删除
    handleRemove(file, fileList) {
      //file：是删除的图片
      //fileList：图片数组
      //删除图片后需要将图片数组收集起来提交给服务器
      this.spuImageList = fileList;
      console.log(this.spuImageList)
    },
    //图片上传之前
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    },
    //图片上传成功执行的回调 将新数组保存下来
    handlerSuccess(response, file, fileList){
      //response 上传成功后返回的信息
      //收集上传成功后的数组提交服务器
      this.spuImageList = fileList;
    },
    //初始化spu的基本信息
    // async initSpuInfo(row){
    //   //销售属性
    //   let baseInforesult = await this.$API.spu.reqGetBaseInfo();
    //   if(baseInforesult.code == 200){
    //     this.baseInfoList = baseInforesult.data;
    //   }
    //   //图片列表
    //   let SpuImageresult = await this.$API.spu.reqGetSpuImageList(row.id);
    //   if(SpuImageresult.code ==200){
    //     //file-list需要两个属性 在赋值前给属性
    //     //定义一个数组 遍历给属性 最后赋值给spuImageList
    //     let spuImageArr = SpuImageresult.data;
    //     spuImageArr.forEach(item => {
    //         item.name = item.imgName;
    //         item.url = item.imgUrl;
    //     });
    //       this.spuImageList = spuImageArr; 
    //   }
    //   //品牌信息
    //   let tradeMarkres = await this.$API.spu.reqGetSpuTradeMark();
    //   if(tradeMarkres.code == 200){
    //     this.tradeMarkList = tradeMarkres.data;
    //   }
    //   //spu信息
    //   let spuInfores = await this.$API.spu.reqGetSpuInfo(row.id);
    //   if(spuInfores.code == 200){
    //     this.spuInfo = spuInfores.data;
    //   }
    // },
    //添加属性
    addAttr(){
      //解构解析
      const [baseSaleAttrId,saleAttrName] = this.attrIdAndName.split(':');
      //baseSaleAttrId：销售属性的id
      //saleAttrName：销售属性的名称
      //spuSaleAttrValueList:存储销售属性值的数组 一开始定义为空数组
      let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]};
      this.spuInfo.spuSaleAttrList.push(newSaleAttr);
    },
    //添加属性值
    showInput(row){
      //为每条属性添加inputVisible属性 赋值为true
      this.$set(row,'inputVisible',true);
      this.$set(row,'inputValue','');
    },
    //属性值的文本框失去焦点后执行的回调函数
    handleInputConfirm(row){
      const {baseSaleAttrId,inputValue} = row;
      //属性值不能为空
      if(inputValue.trim() == ''){
        return this.$message('属性值不能为空');
      }
      //属性值不能重复 （去重）
      //属性里的属性值与文本框的值进行比较 相同返回false 不同true
      let result = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName !=inputValue);
      if(result){ 
        let newArrs = {baseSaleAttrId,saleAttrValueName:inputValue};
        row.spuSaleAttrValueList.push(newArrs);
        row.inputVisible = false;
      }else{
        this.$message('属性值已存在');
      }
    },
    //保存属性
    async saveAttrInfo(){
      //将图片数据添加到this 下的spuImageList后 再将数据赋值给spuInfo
      this.spuInfo.spuImageList = this.spuImageList.map(item=>{
        return{
          imageName: item.name,
          imageUrl:(item.response&&item.response.data)||item.url
        }

      })
      let result = await this.$API.spu.reqAddOrUpdate(this.spuInfo);
      if(result.code == 200){
        this.$message('保存成功');
        Object.assign(this._data,this.$options.data());
        //这边是解构解析 需要参数一致用的是scenen
        this.$emit('swagScenen',{scenen:0,flag:this.spuInfo.id?'修改':'添加'});
      }
      //提交的数据中图片需要有 imageName 与imageUrl 的属性
      //发送请求后 跳转页面 重新发送请求获取数据
    },
    //添加页面时父组件调用的回调函数 传入父组件的三级分类 获取品牌信息与销售属性
    async getAttrInfos(category3Id){
      this.spuInfo.category3Id = category3Id;
      //获取品牌
      let result = await this.$API.spu.reqGetSpuTradeMark();
      if(result.code == 200){
        this.tradeMarkList = result.data;
      }
      //获取销售属性
      let spuSaleAttrRes = await this.$API.spu.reqGetBaseInfo();
      if(spuSaleAttrRes.code == 200){
        this.baseInfoList = spuSaleAttrRes.data;
      }
    },
    //取消
    cancel(){
      //这边是解构解析 需要参数一致用的是scenen
      this.$emit('swagScenen',{scenen:0,flag:''})
      //将页面的数据清空 将this.$options.data()这个空数据 赋值给 this._data
      Object.assign(this._data,this.$options.data());
    }
  },
  computed:{
    unSelectSaleAttr(){
      //过滤里面every 判断两个数组的值是否相等 相等返回true 则表示该值要 留下 false就表示不要就会过滤掉
      let result = this.baseInfoList.filter(item=>{
        return this.spuInfo.spuSaleAttrList.every(item1=>{
          return item.name!= item1.saleAttrName;
        })
      })
      return result;
    }
  }
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