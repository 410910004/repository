//商品属性模块
import request from '@/utils/request';
//获取一级分类  /admin/product/getCategory1 get
export const reqgetCategory1 =()=>{
    return request({url:'/admin/product/getCategory1',method:'get'})
}
//获取二级分类  /admin/product/getCategory2/{category1Id}
export const reqgetCategory2 =(category1Id)=>{
    return request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})
}
//获取三级分类  /admin/product/getCategory3/{category2Id}
export const reqgetCategory3 = (category2Id)=>{
    return request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})
}

//获取属性列表 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqgetAttrInfoList =(category1Id,category2Id,category3Id)=>{
    return request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
}

//添加属性值 /admin/product/saveAttrInfo post
/**
 * "attrName": "string", 属性名
    "attrValueList": [ 
        {
            "attrId": 0, 属性值的id
            "valueName": "string" 属性名
        }
    ],
    "categoryId": 0,  3 三级分类的id
    "categoryLevel": 0, 3 三级分类的级别
    }
 */
export const reqSaveAttrInfo =(data)=>{
    return request({url:'/admin/product/saveAttrInfo',data,method:'post'})
}

//删除属性值 /admin/product/deleteAttr/{attrId} delete
export const reqDeleteAttr =(attrId)=>{
    return request({url:`/admin/product/deleteAttr/${attrId}`,method:'delete'})
}