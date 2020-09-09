// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carList: [],
    number: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 1.从本地缓存中获取购物车数组
    const getCarLists = wx.getStorageSync('carKey') || [];
    // 2.将购物车数组内容绑定给自定义数组 动态渲染
    this.setData({
      carList: getCarLists
    })
    // 3.调用计算商品总价的函数
    this.changeAmount();
  },

  /*
  计算商品总价
  */
  changeAmount() {
    // 从本地缓存中取出数据
    const carts = wx.getStorageSync("carKey") || [];
    console.log("carts>>>>>>", carts);
    // 遍历计算总价
    let amount = carts.reduce((sum, item) => {
      return sum + item.price * item.number;
    }, 0);
    // 将数据存储到本地 
    wx.setStorage({
      data: amount,
      key: 'amount',
    });
    let amounts = wx.getStorageSync('amount');
    this.setData({
      amounts: amounts * 100
    })
  },

  /*
  添加商品数量
  */
  addQuantity(e) {
    const id = e.currentTarget.dataset.id;
    this.onchangeNumber(id, '+');
  },

  /*
  减少商品数量
  */
  minusQuantity(e) {
    const id = e.currentTarget.dataset.id;
    this.onchangeNumber(id, '-');
  },
  /*
  改变商品数量
  */
  onchangeNumber(_id, opt) {
    const id = _id;
    // 将存入购物车数组数据的自定义数组 展开赋值
    const carLists = [...this.data.carList];
    // 遍历整个购物车数组的数据
    const carItem = carLists.find(item => item.id === id);
    console.log("caritem>>>", carItem);
    //判断 opt形参的key值是否与调用函数时传入的实参key值相同
    if (opt === '+') {
      carItem.number++;
    } else {
      if (carItem.number-- == 0) {
        carItem.number = 0;
      }
    }
    this.setData({
      carList: carLists
    });
    // 写入数据缓存
    wx.setStorage({
      key: 'carKey',
      data: carLists,
    })
    // 调用更改商品价格的函数
    this.changeAmount();
  }
})