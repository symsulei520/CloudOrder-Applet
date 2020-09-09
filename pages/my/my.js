// pages/my/my.js
// 获取app应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 此处wx.canIUse()的参数以${component}.${attribute}.${option} 方式来调用
    // ${component} 代表组件名字；${attribute} 代表组件属性；${option} 代表组件属性的值
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 7.判断获取用户信息的接口执行成功，app.globalData.userInfo有值
    if (app.globalData.userInfo) {
      this.setData({
        // 将值赋给自定义userInfo进行页面渲染
        userInfo: app.globalData.userInfo
      })
    } else {
      // 8.获取用户信息的接口执行失败时,app.globalData.userInfo无值
      // 给app 小程序实例定义一个名为callBackGetUserInfo的回调函数()
      app.callBackGetUserInfo = res => {
        console.log("res>>>>>>>>",res);
        // 回调成功时 获取app.js文件中传出用户信息，并赋值给app.globalData.userInfo
        app.globalData.userInfo = res.userInfo;
        this.setData({
          userInfo: res.userInfo
        })
      }
    }
  },

  /**
   * 获取用户信息, 第一次授权的时候直接通过事件对象e.detail.userInfo获取用户信息
   */
  bindGetUserInfo(e) {
    // app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo
    })
  }
})