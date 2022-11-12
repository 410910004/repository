<template>
  <div class="pagination">
    <button :disabled="pageNo == 1" @click="searchPag(pageNo - 1)">上一页</button>
    <button v-if="startAndEnd.start > 1" @click="searchPag(1)" :class="{ active: pageNo == 1 }">1</button>
    <button v-if="startAndEnd.start > 2">···</button>

    <button v-for="(page, index) in startAndEnd.end" :key="index" v-show="page >= startAndEnd.start"
       @click="searchPag(page)" :class="{ active: pageNo == page }">{{ page }}</button>

    <button v-if="startAndEnd.end < totalPage - 1">···</button>
    <button v-if="startAndEnd.end < totalPage" @click="searchPag(totalPage)"
      :class="{ active: pageNo == totalPage }">{{ totalPage }}</button>
    <button :disabled="startAndEnd.end == totalPage" @click="searchPag(pageNo + 1)">下一页</button>

    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>
</template>
  
<script>
export default {
  /*
      pageNo当前第几页
      pageSize 每一页显示的商品数量
      continue 连续页数
      total 总页数 
    */
  name: "Pagination",
  props: ["pageNo", "pageSize", "total", "continue"],
  computed: {
    totalPage() {
      //计算总页数
      return Math.ceil(this.total / this.pageSize);
    },
    //开始页 结束页
    startAndEnd() {
      let start = 0,end = 0;
      if (this.totalPage < this.continue) {
        //如果连续页数比总页数小
        start = 1;
        end = this.totalPage;
      } else {
        //正常情况
        start = this.pageNo - parseInt(this.continue / 2);
        end = this.pageNo + parseInt(this.continue / 2);
        if (start < 1) {
          //开始页小于0
          start = 1;
          end = this.continue;
        }
        if (end > this.totalPage) {
          //结束页大于总页数
          end = this.totalPage;
          //当前页为31  27 28 29 30 31 则start页为 27  拿总页数减 31 -5 + 1
          start = this.totalPage - this.continue + 1;
        }
      }
      return { start, end };
    },
  },
  methods: {
    //搜索页码
    searchPag(index) {
      this.$bus.$emit("searchPage", index);
    },
  },
};
</script>
  
<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
  .active {
    background-color: skyblue;
  }
}
</style>