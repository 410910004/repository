import axios from 'axios'
import nprogress from 'nprogress';
import "nprogress/nprogress.css";
import store from '@/store';//引入仓库

const requests = axios.create({
    baseURL:'/api',
    timeout:3000

});

//请求拦截器
requests.interceptors.request.use((config)=>{
    nprogress.start();
    if(store.state.detail.getUUid){
        config.headers.userTempId = store.state.detail.getUUid;
    }
    if(store.state.login.token){
        config.headers.token = store.state.login.token;
    }
    return config;
})

//响应拦截器
requests.interceptors.response.use((res)=>{
    nprogress.done()
    return res.data;
},(err)=>{
    return new Promise(new err('failer'))
})

export default requests;