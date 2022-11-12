<template>
  <div class="spec-preview">
    <img :src="imgObj.imgUrl" />
    <!--鼠标事件-->
    <div class="event" @mousemove="hander($event)"></div>
    <!--左侧大图片-->
    <div class="big" >
      <img :src="imgObj.imgUrl" ref="bigImg"/>
    </div>
    <!--绿色蒙版-->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
  export default {
    name: "Zoom",
    props:['skuImageList'],
    data() {
      return {
        bigIndex:0//图片下标
      }
    },
    computed:{
      imgObj(){
        return this.skuImageList[this.bigIndex] ||{}
      }
    },
    mounted(){
      this.$bus.$on('getIndex',(index)=>{
        //将传来的下标赋值给图片下标
        this.bigIndex=index;
      })
    },
    methods:{
      hander($event){
        let mask = this.$refs.mask;//获取蒙版
        //获取蒙蔽随鼠标移动所得到的左边与上边的偏移值
        let left = $event.offsetX - mask.offsetWidth/2;
        let top = $event.offsetY - mask.offsetHeight/2;
        //对偏移值进行约束
        if(left <= 0) left = 0;
        if(left >= mask.offsetWidth) left = mask.offsetWidth;
        if(top<=0) top = 0;
        if(top >= mask.offsetHeight) top = mask.offsetHeight;
        //将偏移值赋值给蒙蔽
        mask.style.left = left + 'px';
        mask.style.top = top+'px';

        //获取大图片
        let bigImg = this.$refs.bigImg;
        bigImg.style.left = -2 * left +'px';
        bigImg.style.top = -2 * top +'px';
      } 
    }
  }
</script>

<style lang="less">
  .spec-preview {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;

    img {
      width: 100%;
      height: 100%;
    }

    .event {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 998;
    }

    .mask {
      width: 50%;
      height: 50%;
      background-color: rgba(0, 255, 0, 0.3);
      position: absolute;
      left: 0;
      top: 0;
      display: none;
    }

    .big {
      width: 100%;
      height: 100%;
      position: absolute;
      top: -1px;
      left: 100%;
      border: 1px solid #aaa;
      overflow: hidden;
      z-index: 998;
      display: none;
      background: white;

      img {
        width: 200%;
        max-width: 200%;
        height: 200%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    .event:hover~.mask,
    .event:hover~.big {
      display: block;
    }
  }
</style>