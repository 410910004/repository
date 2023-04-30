<template>
    <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="班级">
            <el-input
                v-model="name"
                placeholder="请输入查询信息"
                style="width: 400px;float: left;"
                v-on:keyup.enter.native="inputList"
                clearable
            />
        </el-form-item>
    </el-form>

</template>

<script>
/**
 *  1.在重新选取三级分类时需要将三级分类置空
 *  2.通过自定义事件 将子组件的数据传给父组件进行处理
 *  3.需要将子组件的三级分类传给父组件并标记 是几级分类
 *  4.在父组件中需要注意重新选取三级分类时需要将三级分类置空
 */
export default {
    name:'CategorySelect',
    data() {
        return {
           
        }
    },
    mounted(){
        // this.getCategory();
    },
    methods:{
      
    }
}
</script>