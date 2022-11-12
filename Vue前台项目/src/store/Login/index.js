//登录模块
import { reqLogin,reqUserInfo,reqLogout } from "@/api";

const state={
  token:localStorage.getItem('token'),
  userInfo:{}
}

const actions={
    //登录
    async Login({commit},user){
      let result = await reqLogin(user);
      console.log(result)
      if(result.code == 200){
        commit('LOGIN',result.data.token);
        localStorage.setItem('token',result.data.token);
        return 'OK'
      }else{
        return new Promise(new Error('failer'));
      }
    },
    //携带token获取用户信息
    async getUserInfo({commit}){  
      let result = await reqUserInfo();
      console.log(result);
      if(result.code == 200){
         commit('GETUSERINFO',result.data);
         return 'OK';
      }else{
        return Promise.reject(new Error('failer'));
      }
    },
    //退出登录
    async Logout({commit}){
      let result =  await reqLogout();
      if(result.code == 200){
        commit('LOGOUT');
        return 'OK'
      }else{
        return Promise.reject(new Error('failer'));
      }
    }
}
const mutations={
  LOGIN(state,token){
    state.token = token;
  },
  GETUSERINFO(state,userInfo){
    state.userInfo = userInfo;
  },
  LOGOUT(state){
    state.token='';
    state.userInfo={};
    localStorage.removeItem('token')
  }
}

const getters={
  userName(state){
    return state.userInfo.loginName;
  }
}

export default {
    actions,
    mutations,
    state,
    getters
}