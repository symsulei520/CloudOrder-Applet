//index.js
//获取应用实例
const app = getApp()
// 引入外部封装的接口
const shopApi = require('../utils/shopApi.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentNo: 1, // 定义初始化页号
    totalNum: 0, // 定义初始化总页数
    // 视图组件的初始值
    swiper: {
      background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
      indicatorDots: true,
      vertical: false,
      autoplay: true,
      interval: 2000,
      duration: 500
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const that = this;

    // 调用封装的云函数 banner 轮播图
    shopApi.wxCloundBanner((res) => {
      const MerchantsList = res.result.data;
      that.setData({
        MerchantsList: MerchantsList
      })
    })

    // // 调用云函数 foodlist 商品列表
    // shopApi.wxCloundProductList((res) => {
    //   // 从接口返回的参数中获取商品列表
    //   const list = res.result.data;
    //   that.setData({
    //     reQuestList: list
    //   })
    // })

    // 调用云函数 recommend 商品推荐列表
    shopApi.wxCloundProductDeteil((res) => {
      // 从接口返回的参数中获取商品推荐列表
      console.log("res.result.data", res);
      that.setData({
        productDeteil: res.result.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // // 调用显示导航加载进度 API
    // wx.showNavigationBarLoading();
    // const that = this;
    // // 初始化页号
    // that.data.currentNo = 1;
    // // 调用封装的接口
    // shopApi.wxRequest(that.data.currentNo, data => {
    //   // 设置定时器，让上拉刷新的效果更可视化
    //   setTimeout(() => {
    //     // 将接口中的数组取出 并赋值
    //     const list = data.resultInfo.list;
    //     // 将接口中的总页数取出 赋值给自定义的totalNum总页数
    //     that.data.totalNum = data.resultInfo.totalNum;
    //     that.setData({
    //       reQuestList: list
    //     });
    //     // 调用隐藏导航加载进度 API
    //     wx.hideNavigationBarLoading();
    //     // 调用停止刷新 API
    //     wx.stopPullDownRefresh();
    //   }, 2000)
    // })

    // 调用显示导航加载进度 API
    wx.showNavigationBarLoading(
      wx.showLoading({
        title: '加载中',
      })
    );

    setTimeout(() => {
      wx.hideLoading();
      // 调用隐藏导航加载进度 API
      wx.hideNavigationBarLoading()
      //     // 调用停止刷新 API
      wx.stopPullDownRefresh()
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // const that = this;
    // // 1.判断下拉增加后的页号是否大于等于总页数
    // if (++this.data.currentNo <= that.data.totalNum) {
    //   // 调用 显示loading提示框 API
    //   wx.showLoading({
    //     title: '加载中',
    //   })
    //   // 2.调用用户数据请求接口，将当页页号和data箭头函数作为参数传入接口
    //   shopApi.wxRequest(that.data.currentNo, data => {
    //     // 3.获取当页未显示的数据数组
    //     const newList = data.resultInfo.list;
    //     console.log("newList>>>", newList);
    //     // 4.使用展开运算符 将当页未显示的数据数组内容添加到当页显示的数据数组之后，合并为新的数组
    //     const list = [...that.data.reQuestList, ...newList];
    //     that.setData({
    //       reQuestList: list
    //     });
    //     // 调用 隐藏loading提示框 API
    //     wx.hideLoading();
    //   })
    // }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onJumpDetails(e) {
    console.log("e>>>", e);
    // 获取事件触发时传入的参数值
    const id = e.currentTarget.dataset.id
    console.log("123id >>", id);
    // 调用路由跳转的API
    wx.navigateTo({
      // 将id作为参数传入路由跳转后的页面
      url: '../sp/spDetails?id=' + id,
    })
  }
})