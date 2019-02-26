//app.js
var Bmob = require('pages/bmob/Bmob-1.6.7.min.js');
App({
  onLaunch: function() {
    Bmob.initialize("3b600fb7071f5aca5396fe0bcff9123e", "96e33d8fa2466f6aacea1e326983afc5", "6f9656468eeb82120bf943bf5a4c6ecb");
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId   
        if (res.code) {
          console.log("获取用户登录成功" + res.code);
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxd5ba2bf6cfbd4921&secret=36d22018f94c1a452359c0d39b6c2644&js_code=' + res.code + '&grant_type=authorization_code',
            success: function(res) {
              wx.setStorage({
                key: 'openid',
                data: res.data.openid,
              })
              console.log(res.data.session_key);
            }
          })
        } else {
          console.log("获取用户登录失败" + res.errMsg);
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    nickName: null,
    avatarUrl: null,
  }
})