<template>
  <div class="swiper-container" id="mySwiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="carouse in list" :key="carouse.id">
        <img :src="carouse.imgUrl" />
      </div>
    </div>

    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
// import Swiper from 'swiper'

export default {
  name: "Carousel",
  props: ["list"],
  watch: {
    list: {
      //this.$nextTick()使用
      immediate:true,
      handler() {
        this.$nextTick(() => {
          new Swiper(this.$refs.cur, {
            loop:true,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            // 如果需要滚动条
            // scrollbar: {
            //   el: ".swiper-scrollbar",
            // },
          });
        });
      },
    },
  },
};
</script>

<style>
</style>