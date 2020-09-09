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
    categoryId: 3, // 定义初始化商品分类列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const that = this;
    this.isShow = false;
    //调用云函数 category 商品分类
    shopApi.wxCloundProductCategory((res1) => {
      const categorys = res1.result.data;
      console.log("categorys>>>>>>>>>>", categorys);
      that.setData({
        categorys
      })

      // 调用云函数 商品分类查询 queryProduct
      shopApi.wxCloundQueryProduct(that.data.categoryId, res => {
        const reQuestList = res.result.data;
        that.setData({
          curNav: that.data.categoryId,
          reQuestList: reQuestList
        })
      })
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {
  //   // 调用显示导航加载进度 API
  //   wx.showNavigationBarLoading();
  //   const that = this;
  //   // 初始化页号
  //   that.data.currentNo = 1;
  //   // 调用封装的接口
  //   shopApi.wxRequest(that.data.currentNo, data => {
  //     // 设置定时器，让上拉刷新的效果更可视化
  //     setTimeout(() => {
  //       // 将接口中的数组取出 并赋值
  //       const list = data.resultInfo.list;
  //       // 将接口中的总页数取出 赋值给自定义的totalNum总页数
  //       that.data.totalNum = data.resultInfo.totalNum;
  //       that.setData({
  //         reQuestList: list
  //       });
  //       // 调用隐藏导航加载进度 API
  //       wx.hideNavigationBarLoading();
  //       // 调用停止刷新 API
  //       wx.stopPullDownRefresh();
  //     }, 2000)
  //   })
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   const that = this;
  //   // 1.判断下拉增加后的页号是否大于等于总页数
  //   if (++this.data.currentNo <= that.data.totalNum) {
  //     // 调用 显示loading提示框 API
  //     wx.showLoading({
  //       title: '加载中',
  //     })
  //     // 2.调用用户数据请求接口，将当页页号和data箭头函数作为参数传入接口
  //     shopApi.wxRequest(that.data.currentNo, data => {
  //       // 3.获取当页未显示的数据数组
  //       const newList = data.resultInfo.list;
  //       console.log("newList>>>", newList);
  //       // 4.使用展开运算符 将当页未显示的数据数组内容添加到当页显示的数据数组之后，合并为新的数组
  //       const list = [...that.data.reQuestList, ...newList];
  //       that.setData({
  //         reQuestList: list
  //       });
  //       // 调用 隐藏loading提示框 API
  //       wx.hideLoading();
  //     })
  //   }
  // },
  
  /*
   点击商品分类
  */
  onJumpTwoMenu(e) {
    wx.showLoading({
      title: '加载中',
    })
    // 获取事件触发时传入的参数值
    const id = e.currentTarget.dataset.id
    console.log("id>>>>>", id);
    // 调用云函数 商品分类查询 queryProduct
    shopApi.wxCloundQueryProduct(id, res => {
      const reQuestList = res.result.data;
      this.setData({
        curNav: id,
        reQuestList: reQuestList,
      })
      wx.hideLoading();
    })
  },


  /* 
  点击跳转到商品详情页
  */
  onJumpDetails(e) {
    console.log("e>>>", e);
    // 获取事件触发时传入的参数值
    const id = e.currentTarget.dataset.id
    console.log("123id >>", id);
    wx.navigateTo({
      // 将id作为参数传入路由跳转后的页面
      url: '../sp/spDetails?id=' + id,
    })
  },
})