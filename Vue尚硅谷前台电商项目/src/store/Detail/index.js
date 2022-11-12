import { reqSearchDetail, reqAddShopCart } from '@/api';
import {getUUid} from '@/utils';
const actions = {
    //获取商品详情
    async getDetail({ commit }, skuId) {
        let result = await reqSearchDetail(skuId);
        if (result.code == 200) {
            commit('GETDETAIL', result.data)
        }
    },
    //添加到购物车
    async addShopCart({ commit }, { skuId, skuNum }) {
        let result = await reqAddShopCart(skuId,skuNum);
        commit
        if (result.code == 200) {
            return 'ok'
        } else {
            return new Promise(new Error('failer'));
        }
    },

}
const mutations = {
    GETDETAIL(state, goodsList) {
        state.goodsList = goodsList
    }
}
const state = {
    goodsList: {},
    //获取用户token
    getUUid:getUUid()
}
const getters = {
    categoryView(state) {
        return state.goodsList.categoryView || {}
    },
    skuInfo(state) {
        return state.goodsList.skuInfo || {}
    },
    spuSaleAttrList(state) {
        return state.goodsList.spuSaleAttrList || []
    }
}

export default {
    actions,
    mutations,
    state,
    getters
}