<template>
    <div>
      <el-input
        v-model="name"
        placeholder="请输入班级名称"
        style="width: 400px;float: left;margin-bottom: 10px;margin-right: 10px;"
        v-on:keyup.enter.native="inputList"
        clearable
      />
      <el-button type="primary" icon="el-icon-plus" @click="addTradeMark">
        添加
      </el-button>
  
      <!--
        prop:对应的是列的字段名；
        label：标签名对应的是列名；
        data:绑定数据
      -->
      <el-table border :data="list" style="width: 100%; margin-top: 20px">
        <el-table-column
          type="index"
          prop="prop"
          label="序号"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="tmName"
          label="班级名称"
          width="width"
        ></el-table-column>
        <el-table-column prop="num" label="人数" width="width"></el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              @click="updateTradeMark(row)"
              >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="delteTradeMark(row)"
              >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!--
        分页器
          total:总页数
          urrent-page:当前页
          @current-change="" 当前页发生变化时会触发
          layout :分页器的布局
      -->
      <el-pagination
        style="margin-top: 20px; textAlign: center"
        :total="total"
        :current-page="1"
        :page-size="limit"
        :page-sizes="[3, 5, 10]"
        @current-change="changePage"
        @size-change="changeSize"
        layout="total,sizes,prev,pager,next,jumper"
      ></el-pagination>
  
      <!--对话框-->
      <el-dialog title="添加班级" :visible.sync="dialogFormVisible">
        <!--
          表单验证
            model: 表单验证的数据对象 依据那些数据进行验证
            rules：验证规则
            ref ： 表单每栏内容依据那些数据对象进行验证
            prop:  表单验证的数据字段
        -->
        <el-form :model="trademark" :rules="rules" ref="trademark">
          <el-form-item label="班级名称" label-width="100px" prop="tmName">
            <el-input v-model="trademark.tmName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="人数" label-width="100px" prop="">
            <el-input v-model="trademark.num" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateOrAddTradeMark('trademark')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    name: "Class",
    data() {
      return {
        page: 1,
        limit: 3,
        list: [
          {tmName:'班级1',num:45},
          {tmName:'班级2',num:49}
        ],
        total: 2,
        //显示对话框
        dialogFormVisible: false,
        //添加班级所用到的参数
        trademark: {
          tmName: "", //班级名称
          num: "", //班级人数
        },
        //表单验证规则
        rules: {
          tmName: [
            { required: true, message: "请输入班级名称", trigger: "blur" },
            { min: 2, max: 5, message: "长度在2到5个字符", trigger: "change" },
          ],
          num: [{ required: true, message: "请输入班级人数", }],
        },
      };
    },
    mounted() {
      //网页加载挂载获取数据
      this.getTradeMark();
    },
    methods: {
      //获取品牌列表
      // async getTradeMark() {
      //   let { page, limit } = this;
      //   let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      //   if (result.code == 200) {
      //     this.list = result.data.records;
      //     this.total = result.data.total;
      //   }
      // },
      //点击分页器的页码触发事件
      changePage(pager) {
        //pager可以实现点击那个页面显示那个页码
        //重新修改页码
        this.page = pager;
        //发送请求
        this.getTradeMark();
      },
      //修改每页展示几条数据
      changeSize(limit) {
        this.limit = limit;
        //发送请求
        this.getTradeMark();
      },
      //添加品牌
      addTradeMark() {
        this.dialogFormVisible = true;
        //清空数据
        this.trademark.tmName = "";
        this.trademark.logoUrl = "";
      },
      //修改品牌
      updateTradeMark(row) {
        this.dialogFormVisible = true;
        //将已有的信息展示出来
        this.trademark = { ...row }; //浅拷贝
      },
      //删除品牌
      async delteTradeMark(row) {
        let id = row.id; //获取删除品牌的id
        //派发数据
        let result = await this.$API.trademark.reqDeleteTradeMark(id);
        if (result.code == 200) {
          this.$message("品牌删除成功");
          //删除成功后重新加载数据
          this.getTradeMark();
        } else {
          this.$message("删除失败");
        }
      },
      //上传图片用到的方法
      handleAvatarSuccess(res, file) {
        //将上传图片的数据接收
        this.trademark.logoUrl = res.data;
        console.log(res, file);
      },
      //图片上传前用到的方法
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;
  
        if (!isJPG) {
          this.$message.error("上传头像图片只能是 JPG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isJPG && isLt2M;
      },
      //修改或修改商品品牌
      updateOrAddTradeMark(formName) {
        //先查验证各个表单是否符合要求
        this.$refs[formName].validate(async (valid) => {
          if (valid) {//验证通过时
            this.dialogFormVisible = false; //关闭对话框
            //发请求返回的时一个promise对象 则需要 await 与 async 
            let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.trademark);
            if (result.code == 200) {
              //携带了ID参数的指向修改品牌数据
              this.$message(this.trademark.id ? "品牌修改成功" : "品牌添加成功");
              //重新加载数据
              this.getTradeMark();
            } else {
              this.$message(this.trademark.id ? "品牌修改失败" : "品牌添加失败");
            }
          } else {//验证未通过
            this.$message("表单信息失败");
            return false;
          }
        });
      },
    },
  };
  </script>
  
  <style>
  /**对话框中图片上传的样式 */
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  </style>