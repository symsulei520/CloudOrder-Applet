 // 封装获取网络接口数据
 const baseURL = 'http://192.168.0.102:8088';
 // 2.callback是形参，作为接受外部调用接口时传入的参数（外部传入参数是一个函数）的'容器'
 const wxRequest = (pageNo, callback, errCallback) => {
   // 调用发起网络请求的API
   wx.request({
     url: `${baseURL}/api/shop/list?pageNo=${pageNo}`,
     header: {
       'content-type': 'application/json'
     },
     success(res) {
       // 3.调用外部传入的参数，函数回调，将此处参数返回外部
       callback(res.data);
     },
     fail(err) {
       wx.showToast({
         title: '请求出错' + JSON.stringify(err),
       })
       // 调用请求错误的回调函数
       errCallback();
     }
   })
 }

 // 封装获取商品详情的接口
 const wxFindRequest = (id, callback) => {
   wx.request({
     url: `${baseURL}/api/shop/find?id=${id}`,
     success(res) {
       callback(res.data);
     },fail(err){
       console.log("商品详情调用失败",err);
     }
   })
 }

 // 封装获取商品banner轮播的接口
 const wxMerchantsRequest = (callback) => {
   wx.request({
     url: `${baseURL}/api/shop/banner`,
     success(res) {
       callback(res.data);
     }
   })
 }

 // 封装调用 商品列表的云函数
 const wxCloundProductList = (callback) => {
   // 调用云函数
   wx.cloud.callFunction({
     name: 'foodlist',
     success(res) {
       callback(res)
     },
     fail(err) {}
   })
 }

// 封装调用  商品详情的云函数
const wxCloundFindProduct = (id,callback) =>{
  // 调用云函数
  wx.cloud.callFunction({
    name: 'findproduct',
    data: {
      id: id
    },
    success(res){
      callback(res)
      console.log("商品详情调用成功",res);
    },fail(err){
      console.log("商品详情调用失败",err);
    }
  })
} 

 // 封装调用 商品banner轮播的云函数
 const wxCloundBanner = (callback) => {
   // 调用云函数
   wx.cloud.callFunction({
     name: 'banner',
     success(res) {
       callback(res)
       console.log(res, "云函数");
     },
     fail(err) {
       console.log("云函数失败的回调", err);
     }
   })
 }

 // 封装调用 商品推荐的云函数
 const wxCloundProductDeteil = (callback) => {
   // 调用云函数
   wx.cloud.callFunction({
     name: 'recommend',
     success(res) {
       callback(res)
     },
     fail(err) {
       console.log("云函数失败的回调", err);
     }
   })
 }

 // 封装调用 商品分类的云函数
 const wxCloundProductCategory = (callback) => {
   wx.cloud.callFunction({
     name: 'category',
     success(res) {
       callback(res)
       console.log("商品分类》》》》》",res);
     }
   })
 }

 // 封装调用 商品分类查询的云函数
const wxCloundQueryProduct = (id,callback) => {
  wx.cloud.callFunction({
    name: 'queryproduct',
    data:{
      id: id
    },
    success(res){
      callback(res)
      console.log("商品查询》》》",res);
    }
  })
}

 // 向外暴露封装的接口函数
 module.exports = {
   wxRequest,
   wxFindRequest,
   wxMerchantsRequest,
   wxCloundProductList,
   wxCloundBanner,
   wxCloundProductDeteil,
   wxCloundProductCategory,
   wxCloundQueryProduct,
   wxCloundFindProduct
 }