import { reqSearchList } from "@/api"

//Search模块
const actions={
    async getSearchList({commit},params ={}){
       let result = await reqSearchList(params)
       //判断code是否为200 
       if(result.code == 200){
            commit('GETSEACHLIST',result.data)
       }
    }
}
const mutations={
    GETSEACHLIST(state,searchList){
        state.searchList = searchList
    }
}
const getters={
    getgoodsList(state){
        return state.searchList.goodsList||[]
    },
    getattrsList(state){
        return state.searchList.attrsList
    },
    gettrademarkList(state){
        return state.searchList.trademarkList
    }
}
const state={
    searchList:{}
}
export default {
    actions,
    mutations,
    getters,
    state
}