import requests from "./requests";
import mockRequest from './mockRequest'

export const reqMockData =()=>{
    return mockRequest({url:'/banner',method:'GET'})
}

export const reqMockFloor =()=>{
    return mockRequest({url:'/floor',method:'Get'})
}

//获取商品类别
export const reqCategoryList = ()=>{
    return requests({url:'/product/getBaseCategoryList',method:'GET'})
}

//获取搜索商品信息
export const reqSearchList =(params)=>{
    return requests({url:'/list',method:'post',data:params})
}

//获取商品详情
export const reqSearchDetail = (skuId)=>{
    return requests({url:`/item/${skuId}`,method:'get'})
}

//添加到购物车
// /cart/addToCart/{ skuId }/{ skuNum }
export const reqAddShopCart = (skuId,skuNum)=>{
    return requests({url:`/cart/addToCart/${skuId}/${skuNum}`,method:'post'})
}

//获取购物车列表 /api/cart/cartList
export const reqGetShopList = ()=>{
    return requests({url:'/cart/cartList',method:'get'})
}

//删除购物车信息 /api/cart/deleteCart/{skuId}
export const reqDelShopList = (skuId)=>{
    return requests({url:`/cart/deleteCart/${skuId}`,method:'delete'});
}

//修改购物车选中状态 /api/cart/checkCart/{skuID}/{isChecked}
export const reqUpdateStatus=(skuId,isChecked)=>{
    return requests({url:`/cart/checkCart/${skuId}/${isChecked}`,method:'get'})
}
//获取验证码 /api/user/passport/sendCode/{phone}
export const reqGetCode=(phone)=>{
    return requests({url:`/user/passport/sendCode/${phone}`,method:'get'})
}
//注册用户 phone password code
export const reqRegister = (data)=>{
    return requests({url:'/user/passport/register',data,method:'post'})
}

//登录 
export const reqLogin=(data)=>{
    return requests({url:'/user/passport/login',data,method:'post'})
}

//携带token获取用户信息 /api/user/passport/auth/getUserInfo
export const reqUserInfo=()=>{
    return requests({url:'/user/passport/auth/getUserInfo',method:'get'});
}

//退出登录 /api/user/passport/logout
export const reqLogout=()=>{
    return requests({url:'/user/passport/logout',method:'get'});
}

//获取用户地址信息 /api/user/userAddress/auth/findUserAddressList
export const reqGetUserAddressInfo= ()=>{
    return requests({url:'/user/userAddress/auth/findUserAddressList',method:'get'});
}

//获取交易信息 /api/order/auth/trade
export const reqTrade= ()=>{
    return requests({url:'/order/auth/trade',method:'get'});
}

//提交订单 /api/order/auth/submitOrder?tradeNo={tradeNo}
export const reqSumbitTrade=(tradeNo,data)=>{
    return requests({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,data,method:'POST'})
}

//获取支付信息 /api/payment/weixin/createNative/{orderId}
export const reqPayInfo=(orderId)=>{
    return requests({url:`/payment/weixin/createNative/${orderId}`,method:'GET'})
}

//获取支付订单状态 /api/payment/weixin/queryPayStatus/{orderId}
export const reqPayStatus = (orderId)=>{
    return requests({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'GET'});
}

//获取我的订单列表 /api/order/auth/{page}/{limit}
export const reqOrdersList = (page,limit)=>{
    return requests({url:`/order/auth/${page}/${limit}`,method:'get'});
}