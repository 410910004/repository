//配置路由
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from    '@/pages/Home';
import Login from '@/pages/Login';
import Search from '@/pages/Search';
import Register from '@/pages/Register';
import Detail from '@/pages/Detail';
import AddCartShopSuccess  from '@/pages/AddCartSuccess';
import ShopCart from '@/pages/ShopCart';
import Trade from '@/pages/Trade';
import store from '@/store';
import Pay from '@/pages/Pay';
import paySuccessful from '@/pages/PaySuccess';
import center from '@/pages/Center'
import myOrder from '@/pages/Center/myOrder';
import teamOrder from '@/pages/Center/teamOrder';
Vue.use(VueRouter)

//重写push与replace方法
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

VueRouter.prototype.push = function(location,resolve,reject){
    if(resolve && reject){
         originPush.call(this,location,resolve,reject)
    }else{
         originPush.call(this,location,()=>{},()=>{})
    }
}

VueRouter.prototype.replace = function(location,resolve,reject){
    if(resolve && reject){
        originReplace.call(this,location,resolve,reject)
    }else{
        originReplace.call(this,location,()=>{},()=>{})
    }
}

let router =  new VueRouter({
    routes: [
        {
            path:'/home',
            component:Home,
            meta:{show:true}
        },
        {
            path:'/login',
            component:Login,
            meta:{show:false}
        },
        {
            path:'/search/:keyword?',
            component:Search,
            meta:{show:true},
            name:'search',
        },
        {
            path:'/register',
            component:Register,
            meta:{show:false}
        },
        {
            path:'/detail/:skuId',
            component:Detail,
            meta:{show:true}
        },
        {
            path:'/addCartSuccess',
            name:'addCartSuccess',
            component:AddCartShopSuccess,
            meta:{show:true}
        },
        {
            path:'/shopCart',
            name:'ShopCart',
            component:ShopCart,
            meta:{show:true}
        },
        {
            path:'/trade',
            name:'Trade',
            component:Trade,
            meta:{show:true},
            beforeEnter:(to, from, next)=>{
                console.log(to)
                if(from.path=='/shopCart'){
                    next();
                }else{
                    next(false);
                }
            }
        },
        {
            path:'/pay/:tradeNo',
            name:'Pay',
            component:Pay,
            meta:{show:true},
            beforeEnter: (to, from, next) => {
                console.log(to)
                if(from.path=='/trade'){
                    next();
                }else{
                    next(false);
                }
            }
        },
        {
            path:'/paySuccessful',
            name:'paySuccessful',
            component:paySuccessful,
            meta:{show:true}
        },
        {
            path:'/center',
            name:'center',
            component:center,
            meta:{show:true},
            //二级路由中的路由要么写全，要么不写
            children:[
                {
                    path:'myOrder',
                    component:myOrder,
                },
                {
                    path:'teamOrder',
                    component:teamOrder,
                },
                {
                    path:'/center',
                    redirect:'/center/myOrder'
                }
            ]
        },
        //重定向
        {
            path:'*',
            redirect:'home'
        },
    ],
    //滚动行为 跳转页面将滚动条置顶
    scrollBehavior () {
        // return 期望滚动到哪个的位置
        return{y:0}
    },
   
  
});
//全局守卫
router.beforeEach(async(to,from,next)=>{
    //从仓库获取token
    let token = store.state.login.token;
    //判断是否有token 有表示登陆过
    if(token){
        //有token的情况下无法访问到login
        if(to.path=='/login' ||to.path=='/register'){
            next('/home');
        }else{
            //从仓库获取用户数据里的用户名
            let name = store.state.login.userInfo.name;
            //再有token的情况下判断是否有用户名
            if(name){
                //有用户名的情况下放行
                next();
            }else{
                //没有用户名的情况下派发获取
                try {
                    //没有用户名的情况重新派发获取数据
                    await  store.dispatch('getUserInfo');
                    //放行
                    next();
                } catch (error) {
                    //如果token失效了 那么清空token 用户数据 相当于退出登录 派发退出登录
                    store.dispatch('Logout');
                    next('/login');
                }
            }
        }
    }else{
        //后续进行优化 未登录不能去 支付相关页面 交易页面 个人中心
        let path = to.path;
        if(path.indexOf('/trade') !=-1 || path.indexOf('/pay') !=-1 || path.indexOf('/center') !=-1){
            next('/login?redirect='+path);
        }else{
            next();
        }
        next();
    }
})
export default router;