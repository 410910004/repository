<template>
  <div>
    <TypeNav/>
    <ListContainer/>
    <Recommend/>
    <Rank/>
    <Like/>
    <Floor v-for="floor in bannerList" :key="floor.id" :floors = "floor"/>
    <Brand/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import ListContainer from '@/pages/Home/ListContainer'
  import Recommend from '@/pages/Home/Recommend'
  import Rank from '@/pages/Home/Rank'
  import Like from '@/pages/Home/Like'
  import Floor from '@/pages/Home/Floor'
  import Brand from '@/pages/Home/Brand'
  
  export default {
    name: "Home",
    components:{
      ListContainer,
      Recommend,
      Rank,
      Like,
      Floor,
      Brand
    },
    mounted(){
      this.$store.dispatch('getFloors');
    },
    computed:{
      ...mapState({
        bannerList:(state)=> state.home.floorList
      }),
      
    }
  };
</script>

<style>
</style> 