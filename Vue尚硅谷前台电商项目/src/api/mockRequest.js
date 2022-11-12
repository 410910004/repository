import axios from 'axios'
import nprogress from 'nprogress';
import "nprogress/nprogress.css"

const MockRequests = axios.create({
    baseURL:'/Mock',
    timeout:5000

});

//请求拦截器
MockRequests.interceptors.request.use((config)=>{
    nprogress.start()
    return config;
})

//响应拦截器
MockRequests.interceptors.response.use((res)=>{
    nprogress.done()
    return res.data;
},(Error)=>{
    return Promise.reject(new Error('failer'))
})

export default MockRequests;