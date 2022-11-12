//交易
import { reqGetUserAddressInfo,reqTrade,reqSumbitTrade, reqPayInfo } from "@/api"

const actions={
    //获取用户地址信息
    async getUserAddressInfo({commit}){
       let result = await reqGetUserAddressInfo();
       if(result.code ==200){
            commit('GETUSERADDRESSINFO',result.data);
       }
    },
    //获取交易信息
    async getTrades({commit}){
       let result = await reqTrade();
       if(result.code == 200){
        commit('GETTRADES',result.data)
       }
    },
    //提交订单
    async sumbitTrade({commit},{tradeNo,data}){
        let result = await reqSumbitTrade(tradeNo,data)
        console.log(result)
        if(result.code == 200){
            commit('SUMBITTRADE',result.data)
            return 'OK'
        }else{
            return  Promise.reject(new Error('failer'));
        }
    },
    //获取支付信息
    async getPayInfos({commit},orderId){
      let result = await reqPayInfo(orderId);
      console.log(result);
      if(result.code == 200){
        commit('GETPAYINFOS',result.data)
        return 'OK'
      }else{
        return Promise.reject(new Error('failer'));
      }
    },
  
}
const mutations={
    GETUSERADDRESSINFO(state,address){
        state.address=address
    },
    GETTRADES(state,trade){
        state.trade =trade;
    },
    SUMBITTRADE(state,tradeNo){
        state.tradeNo=tradeNo;
    },
    GETPAYINFOS(state,payInfo){
        state.payInfo = payInfo;
    }
}
const state ={
    address:[],
    trade:{},
    tradeNo:'',
    payInfo:{}
}
export default {
    actions,
    mutations,
    state
}