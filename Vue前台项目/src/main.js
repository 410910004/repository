import Vue from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import * as API from '@/api/index';
//注册全局组件
import TypeNav from '@/components/TypeNav';
import Pagination from '@/components/Pagination';
//调用一次mock
import '@/Mock/mockServer';
//需要用到swiper时 或使用轮播图组件时
//导入css
import 'swiper/css/swiper.css';
// import Carousel from '@/components/Carousel'
import { Carousel,CarouselItem,Button,Form,FormItem,Input,MessageBox } from 'element-ui';
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.component(TypeNav.name,TypeNav);
Vue.component(Pagination.name,Pagination);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
  },
}).$mount('#app')
