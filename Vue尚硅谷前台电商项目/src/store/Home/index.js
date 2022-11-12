//Home模块
import { reqCategoryList,reqMockData, reqMockFloor } from "@/api"
const actions={
    //获取商品类别
    async categoryList({commit}){
        let result = await reqCategoryList()
        if(result.code == 200){
            commit('CATEGORYLIST',result.data)
        }
    },
    //获取轮播图数据
    async getMockData({commit}){
        let result = await reqMockData()
        if(result.code == 200){
            commit('GETMOCKDATA',result.data)
        }
    },
    //获取楼层轮播图
    async getFloors({commit}){
       let result = await reqMockFloor()
       if(result.code == 200){
            commit('GETFLOOR',result.data)
       }
    }
}
const mutations={
    CATEGORYLIST(state,categoryList){
        state.categoryList = categoryList
    },
    GETMOCKDATA(state,MockList){
        state.MockList=MockList
    },
    GETFLOOR(state,floorList){
        state.floorList=floorList
    }
}
const getters={}
const state={
    categoryList:[],//商品列表
    MockList:[],//轮播图列表
    floorList:[]
}
export default {
    actions,
    mutations,
    getters,
    state
}