//app.js
App({
  onLaunch: function () {
    const that = this;
    // 1.调用设置API（wx.getSetting()）,获取用户的当前设置
    wx.getSetting({
      // 2.接口调用成功的回调函数
      success(res) {
        // 3.判断用户授权结果(authSetting是成功的回调函数的参数)是否为真
        // scope.userInfo 表示用户信息的授权，对应接口 wx.getUserInfo
        if (res.authSetting['scope.userInfo']) {
          // 4.已经授权，可以直接调用获取用户信息的接口（wx.getUserInfo)获取头像昵称
          wx.getUserInfo({ // 异步操作
            // 5.接口调用成功的回调函数
            success(res) {
              console.log("res.userInfo", res.userInfo);
              // 6.将接口调用成功后获取到的 用户信息对象 数据赋值给
              // that.globalData.userInfo 是app.js文件里的全局变量
              that.globalData.userInfo = res.userInfo;
              // 9.判断app实例的回调函数存在，去调用回调函数，并将用户信息对象作为参数传出
              if (that.callBackGetUserInfo) {
                that.callBackGetUserInfo(res.userInfo)
              }
            }
          })
        }
      }
    })

    // 云开发 环境配置
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud-qcgop',
        traceUser: true,
      })
    }
    this.globalData = {}
  },
  globalData: {
    userInfo: null
  },

})