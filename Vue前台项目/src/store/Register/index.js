import { reqGetCode,reqRegister} from "@/api"
//注册模块
const state={
    code:""
}
const actions={
    //获取验证码
    async getCode({commit},phone){
      let result = await reqGetCode(phone);
      console.log(result)
      if(result.code == 200){
        commit('GETCODE',result.data);
      }
    },
    //用户注册
    async userRegister({commit},user){
       console.log(user)
       let result = await reqRegister(user);
       commit;
       console.log(result);
       if(result.code == 200){
        return 'OK'
       }else{
        return Promise.reject('failer');
       }
    }
}
const mutations={
    GETCODE(state,code){
        state.code = code;
    }
}

export default{
    actions,
    mutations,
    state
}