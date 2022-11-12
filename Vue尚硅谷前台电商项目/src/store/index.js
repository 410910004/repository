import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import home from '@/store/Home';
import search from '@/store/Search';
import detail from '@/store/Detail';
import shopCart from './shopCart';
import register from './Register';
import login from  './Login';
import trade from './trade';
export default new Vuex.Store({
    modules:{
        home,
        search,
        detail,
        shopCart,
        register,
        login,
        trade
    }
})
