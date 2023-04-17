//商品spu 模块
import request from "@/utils/request";
//获取spu列表
///admin/product/{page}/{limit} page limit category3id  category3id为一个params参数
export const reqGetSpuList=(page,limit,category3Id)=>{
    return request({url:`admin/product/${page}/${limit}`,params:{category3Id},method:'get'})
}


//获取spu基本信息 admin/product/getSpuById/{spuId}  get
export const reqGetSpuInfo=(spuId)=>{
    return request({url:`admin/product/getSpuById/${spuId}`,method:'get'})
}
//获取品牌  admin/product/baseTrademark/getTrademarkList get
export const reqGetSpuTradeMark = ()=>{
    return request({url:'admin/product/baseTrademark/getTrademarkList',method:'get'})
}
//获取图片列表 admin/product/spuImageList/{spuId} get
export const reqGetSpuImageList=(spuId)=>{
    return request({url:`admin/product/spuImageList/${spuId}`,method:'get'})
}
//获取基本属性 admin/product/baseSaleAttrList
export const reqGetBaseInfo=()=>{
    return request({url:'admin/product/baseSaleAttrList',method:'get'})
}

//添加或修改spu /admin/product/saveSpuInfo post  /admin/product/updateSpuInfo post
export const reqAddOrUpdate = (spuInfo)=>{
    if(spuInfo.id){//携带了id表示修改
        return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
    }else{
        return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
    }
}

//删除spu 属性 /admin/product/deleteSpu/{spuId}
export const reqDeleteAttr = (spuId)=>{
    return request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})
}
