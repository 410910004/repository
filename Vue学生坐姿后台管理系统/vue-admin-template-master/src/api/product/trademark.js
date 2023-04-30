//引入request
import request from '@/utils/request';

//获取商品品牌模块
export const reqTradeMarkList = (page,limit)=>{
    return request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})
}

//添加商品品牌  两个参数 无需带ID logoUrl tmName
//修改更新商品品牌 三个参数 需要携带id 图片 品牌名称 /admin/product/baseTrademark/update
export const reqAddOrUpdateTradeMark = (data)=>{
    if(data.id){
        //修改品牌信息
        return request({url:'/admin/product/baseTrademark/update',data,method:'put'})
    }else{
        //添加品牌
        return request({url:'/admin/product/baseTrademark/save',data,method:'post'})
    }
}
//删除品牌 /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark =(id)=>{
    return request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})
}
