<template>
  <div class="dashboard-container">
    <div class="dashboard-text">坐姿后台管理系统 欢迎您！</div>
    <h1>{{ user.identity }}:{{ user.adname }}</h1>
    <!-- <h1>教师:刘老师</h1> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      user:JSON.parse(window.sessionStorage.getItem("admin")),    //用户session数据
    }
  },

  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
