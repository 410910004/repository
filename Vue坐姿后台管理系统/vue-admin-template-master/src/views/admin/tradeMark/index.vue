<template>
  <div>
    <el-input
        v-model="name"
        placeholder="请输入教师名称"
        style="width: 400px;float: left;margin-bottom: 10px;margin-right: 10px;"
        v-on:keyup.enter.native="inputList"
        clearable
      />
    <el-button type="primary" icon="el-icon-plus" @click="addClass">
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
        label="教师名称"
        width="width"
      ></el-table-column>
      <el-table-column prop="className" label="班级" width="width"></el-table-column>
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
  name: "TradeMark",
  data() {
    return {
      page: 1,
      limit: 3,
      list: [
        {tmName:'张老师',className:"班级1"},
        {tmName:'刘老师',className:"班级2"}
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

  methods: {
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
      
    },
 
    //修改或修改商品品牌
    updateOrAddTradeMark(formName) {
    
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