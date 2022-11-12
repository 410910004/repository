<template>
  <div id="app">
    <Header/>
    <router-view></router-view>
    <Footer v-show="$route.meta.show"/>
  </div>
</template>

<script>
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  mounted(){
    //像仓库派发actions 获取列表数据
    this.$store.dispatch("categoryList");
    
  }
}
</script>

<style>
</style>
