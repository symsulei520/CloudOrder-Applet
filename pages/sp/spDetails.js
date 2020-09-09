// pages/sp/spDetails.js
// 引入外部封装的接口、
const ShopApi = require('../utils/shopApi.js');
// 获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: [], // 菜品对象
    comment: [{
      shopId: 1,
      time: '2020-7-28',
      user: 'amin',
      header: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=995179262,1078570128&fm=26&gp=0.jpg',
      content: '这家店不错',
      shopPic: []
    }],
    shopPics: [],
    inputStr: '' // 接受输入框内容的自定义变量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    // options这个参数是一个json对象，它接收的是路由跳转时url路径后携带的参数
    const id = parseInt(options.id);
    // 调用商品查找接口，将赋值给常量后的id作为参数传入接口
    ShopApi.wxCloundFindProduct(id, res1 => {
      let product = res1.result.data[0];
      that.setData({
        product
      })
      // 获取评论内容
      const db = wx.cloud.database();
      db.collection('comments').where({
        shopId: parseInt(options.id)
      }).get({
        success(res) {
          console.log(res);
          that.setData({
            comment: res.data
          })
        },
        fail(err) {
          console.log("err>>",err);
        }
      })
    })
  },

  /* 
  点击加入购物车
  */
  onCartHander() {
    // 获取本地缓存的购物车json数组内容 并定义一个常量接收，第一次为空
    const carLists = wx.getStorageSync('carKey') || [];
    // 遍历已经添加到购物车数组中的数据 并通过变量接收
    let product = carLists.find((item) => {
      // 判断购物车中数组项的id是否等于要添加的商品id
      return item.id == this.data.product.id
    })
    console.log("this.data.list.id", product);

    // 判断购物车数组中无内容
    if (!product) {
      // 判断成立，构造新的商品项
      let newCarLists = {
        id: this.data.product.id,
        shop: this.data.product.shop,
        picture: this.data.product.picture,
        product: this.data.product.product,
        price: this.data.product.price,
        putway: this.data.product.putway,
        detail: this.data.product.detail,
        number: 1
      }
      // 添加新的商品到购物车数组carLists
      carLists.push(newCarLists);
      console.log("new push>>>");
    } else {
      // 购物车数组中的数组项number的数量++
      product.number++
      console.log("number++>>>");
    }
    // 将添加了商品的购物车数组再重新存储到本地
    wx.setStorageSync('carKey', carLists);
    console.log("oldcar>>>>>>", carLists);
    wx.showToast({
      title: '加入购物车成功',
    })
    wx.hideLoading();
  },

  /*
  头像上传
  */
  onUploadFileHandler() {
    const that = this;
    // 1.调用图片上传API
    wx.chooseImage({
      success(res) {
        // 上传中的提示信息
        wx.showLoading({
          title: '上传中...'
        })
        // 将成功的数据取出并赋值
        const tempFilePaths = res.tempFilePaths;
        // 调用云开发 获取文件上传链接 的API接口
        wx.cloud.uploadFile({
          cloudPath: 'foodapp/' + Date.now() + '.png', //上传至云端的路径
          filePath: tempFilePaths[0], //要上传文件资源的本地路径 (小程序临时文件路径)
          success(res) {
            // 上传成功 关闭提示
            wx.hideLoading();
            // 返回文件 ID
            console.log(res.fileID);
            // es6展开数组 copy一份本地商家图片数组，再将文件上传链接上传成功获取到文件ID 添加到数组里
            const shopPics = [...that.data.shopPics, res.fileID];
            console.log(">>>>111", shopPics);
            // 渲染本地数组
            that.setData({
              shopPics
            })
          },
          fail(err) {
            console.log(err);
          }
        })
      }
    })
  },

  /* 
  提交评论之前 监听输入框的内容
  */
  onInputHandler(e) {
    // 将输入框的值取出赋值给自定义变量
    this.data.inputStr = e.detail.value
  },
  /* 
  提交评论
  */
  onCommentHandler() {
    console.log("12345");
    // 将存储头像图片的本地数组 展开赋值（es6新语法展开数组是copy一份数组）
    const shopPic = [...this.data.shopPics]
    console.log("shopPic", shopPic);
    // 将存有输入框的内容的自定义变量赋值(评论的内容)
    const content = this.data.inputStr;
    // 获取当前时间
    const time = new Date().toLocaleDateString();

    // 调用全局用户信息对象 获取买家自己的数据
    const userInfo = app.globalData.userInfo;

    // 首先判断买家是否登录  
    if (!userInfo) {
      wx.showToast({
        title: '请先登录再提交评论',
      })
      return;
    }

    // 构造新评论数组
    const newComment = {
      time,
      user: userInfo.nickName,
      header: userInfo.avatarUrl,
      content,
      shopPic,
      shopId: this.data.product.id
    }
    // 将评论数据添加到云数据库
    const db = wx.cloud.database();
    db.collection('comments').add({
      data: newComment,
      success: function (res) {
        console.log('comments', res)
      }
    })
    // 刷新显示最新评论
    const comment = [...this.data.comment,newComment];
    this.setData({
      comment,
      shopPics:[],
      inputStr: ''
    })
  }
})