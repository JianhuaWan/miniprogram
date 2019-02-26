// pages/login/index.js
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isempty: false,
    phone: "",
    pwd: "",
    actionSheetHidden: "true",
    menu: '测试环境',
    actionSheetItems: [{
        bindtap: 'Menu1',
        txt: '测试环境'
      },
      {
        bindtap: 'Menu2',
        txt: 'UAT环境'
      },
      {
        bindtap: 'Menu3',
        txt: 'BIZ环境'
      },
      {
        bindtap: 'Menu4',
        txt: '迁移环境'
      }
    ],
  },
  actionSheetbindchange: function() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetTap: function() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
    })
  },
  bindMenu1: function() {
    this.setData({
      menu: "测试环境",
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu2: function() {
    this.setData({
      menu: "UAT环境",
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu3: function() {
    this.setData({
      menu: "BIZ环境",
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu4: function() {
    this.setData({
      menu: "迁移环境",
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      navH: App.globalData.navHeight
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // console.log(this.phone, this.pwd)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log(this.phone, this.pwd)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  validatephone: function(event) {
    console.log("phone", this.data.phone)
    this.data.phone = event.detail.value;
    if (this.data.pwd != "" && this.data.phone != "") {
      this.setData({ 
        isempty: true
      })
    } else {
      this.setData({
        isempty: false
      })
    }
  },
  validatepwd: function(event) {
    console.log("pwd", this.data.pwd)
    this.data.pwd = event.detail.value;
    if (this.data.pwd != "" && this.data.phone != "") {
      this.setData({
        isempty: true
      })
    } else {
      this.setData({
        isempty: false
      })
    }
  },
  gotomain:function(){
    wx.redirectTo({
      url: '/pages/main/home/index',
    })
  }
})