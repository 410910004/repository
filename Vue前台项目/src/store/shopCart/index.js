import { reqGetShopList,reqDelShopList,reqUpdateStatus } from "@/api"
const actions = {
    async getShopList({ commit }) {
        let result = await reqGetShopList();
        if (result.code == 200) {
            commit("GETSHOPCART", result.data);
        }
    },
    //删除购物车
    async reqDelShop({ commit }, skuId) {
        let result = await reqDelShopList(skuId);
        commit;
        if (result.code == 200) {
            return 'ok';
        } else {
            return new Promise(new Error('failer'));
        }
    },
    //修改购物车状态
    async reqUpdateShopStatus({commit},{skuId,isChecked}){
         let result =  await reqUpdateStatus(skuId,isChecked);
        commit;
        if (result.code == 200) {
            return 'ok';
        } else {
            return new Promise(new Error('failer'));
        }
    }
}
const mutations = {
    GETSHOPCART(state, cartList) {
        state.cartList = cartList;
    }
}
const state = { cartList: [] }
const getters = {
    cartList(state) {
        return state.cartList[0] || {};
    }
}

export default {
    actions,
    mutations,
    state,
    getters
}