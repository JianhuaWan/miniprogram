//index.js
//获取应用实例
import Toast from '../../vant/dist/toast/toast';
var Bmob = require('../../bmob/Bmob-1.6.7.min.js');
var QQMapWX = require('../../map/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp()
const query = Bmob.Query('tips');
var haslogin = false;
var tempmarks = [];
import Dialog from '../../vant/dist/dialog/dialog';

Page({
  data: {
    notice: '',
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wd: '22.532323',
    jd: '113.93664',
    markers: [
      //   {
      //   iconPath: '../../images/point.png',
      //   id: 0,
      //   latitude: 22.532323,
      //   longitude: 113.93664,
      //   width: 40,
      //   height: 40
      // }
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady() {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          wd: latitude,
          jd: longitude
        })
      }
    })
  },
  onLoad: function() {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'IBPBZ-VICCX-YJU4L-ZQ5ZO-6Z442-FIBBI'
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    query.find().then(res => {
      console.log(res);
      this.setData({
        notice: res[0].content
      })
    });
    if (this.data.hasUserInfo) {
      try {
        const openid = wx.getStorageSync('openid')
        if (openid) {
          // Do something with return value
          Bmob.User.users().then(res => {
            // 返回成功
            console.log("所有用户" + res.results[0].latitude);
            for (let i = 0; i < res.results.length; i++) {
              var temp = {
                iconPath: '../../images/point.png',
                id: i,
                latitude: res.results[i].latitude,
                longitude: res.results[i].longitude,
                width: 40,
                height: 40,
                name: res.results[i].username
              }
              tempmarks.push(temp);
            }
            //显示
            this.setData({
              markers: tempmarks,
            })
            for (let i = 0; i < res.results.length; i++) {
              if (res.results[i].openid == openid) {
                Bmob.User.login(this.data.userInfo.nickName, openid).then(res => {
                  console.log("bmob登录成功" + res.objectId)
                }).catch(err => {
                  console.log(err)
                });
                haslogin = true;
                return;
              } else {
                haslogin = false;
              }
            }
            console.log("666" + this.data.userInfo.nickName);
            if (!haslogin) {
              let params = {
                username: this.data.userInfo.nickName,
                password: openid,
                openid: openid,
                head: this.data.userInfo.avatarUrl,
                latitude: this.data.wd + '',
                longitude: this.data.jd + ''
              }
              Bmob.User.register(params).then(res => {
                console.log("bmob注册成功" + res)
                const query = Bmob.Query('coin');
                query.set("coins", "0")
                query.set("openid", openid)
                query.set("issign", "0")
                query.save().then(res => {
                  console.log("coin表注册成功" + res.objectId)
                  const query = Bmob.Query('_User');
                  const pointer = Bmob.Pointer('coin')
                  const poiID = pointer.set(res.objectId)
                  query.set('id', objectid) //需要修改的objectId
                  query.set('own', poiID)
                  query.save().then(res => {
                    console.log(res)
                  }).catch(err => {
                    console.log(err)
                  })
                }).catch(err => {
                  console.log(err)
                })
              }).catch(err => {
                console.log(err)
              });
            }
          }).catch(err => {
            console.log(err)
          });
        }
      } catch (e) {
        // Do something when catch error
        console.log(e)
      }
    }
  },
  onSearch: function(search) {
    var that = this;
    if (search.detail == '') {
      //搜索出所有用户的经纬度显示地图上
    } else {
      Toast("已为搜索" + search.detail + '相关');
      // 调用接口
      qqmapsdk.search({
        keyword: search.detail,
        success: function(res) {
          console.log(res);
          for (let i = 0; i < res.data.length; i++) {
            var temp = {
              iconPath: '../../images/point.png',
              id: i,
              latitude: res.data[i].location.lat,
              longitude: res.data[i].location.lng,
              width: 40,
              height: 40
            }
            tempmarks.push(temp);
          }
          that.setData({
            markers: tempmarks,
          })
        },
        fail: function(res) {
          console.log(res);
        },
        complete: function(res) {
          console.log(res);
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    try {
      const openid = wx.getStorageSync('openid')
      if (openid) {
        // Do something with return value
        Bmob.User.users().then(res => {
          // 返回成功
          for (let i = 0; i < res.results.length; i++) {
            var temp = {
              iconPath: '../../images/point.png',
              id: i,
              latitude: res.results[i].latitude,
              longitude: res.results[i].longitude,
              width: 40,
              height: 40,
              name: res.results[i].username
            }
            tempmarks.push(temp);
          }
          //显示
          this.setData({
            markers: tempmarks,
          })
          for (let i = 0; i < res.results.length; i++) {
            if (res.results[i].openid == openid) {
              Bmob.User.login(this.data.userInfo.nickName, openid).then(res => {
                console.log("bmob登录成功" + res)
              }).catch(err => {
                console.log(err)
              });
              haslogin = true;
              return;
            } else {
              haslogin = false;
            }
          }
          if (!haslogin) {
            let params = {
              username: this.data.userInfo.nickName,
              password: openid,
              openid: openid,
              head: this.data.userInfo.avatarUrl,
              latitude: this.data.wd + '',
              longitude: this.data.jd + ''
            }
            Bmob.User.register(params).then(res => {
              const objectid = res.objectId;
              console.log("bmob注册成功" + res)
              const query = Bmob.Query('coin');
              query.set("coins", "0")
              query.set("openid", openid)
              query.set("issign", "0")
              query.save().then(res => {
                console.log("coin表注册成功" + res.objectId)
                const query = Bmob.Query('_User');
                const pointer = Bmob.Pointer('coin')
                const poiID = pointer.set(res.objectId)
                query.set('id', objectid) //需要修改的objectId
                query.set('own', poiID)
                query.save().then(res => {
                  console.log(res)
                }).catch(err => {
                  console.log(err)
                })
              }).catch(err => {
                console.log(err)
              })
              Bmob.User.login(this.data.userInfo.nickName, openid).then(res => {
                console.log("bmob登录成功" + res)
              }).catch(e => {
                console.log(e)
              });
            }).catch(err => {
              console.log(err)
            });
          }
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  markertap(e) {
    // for(let i=0;i<markers.length;i++){
    //   if (e.markerId)
    // }
    console.log(this.data.markers[e.markerId].name),
      console.log(this.data.markers[e.markerId].latitude),
      console.log(this.data.markers[e.markerId].longitude)
    Dialog.confirm({
      title: '提醒',
      message: '是否打开' + this.data.markers[e.markerId].name + '的任务'
    }).then(() => {
      // on confirm
      wx.navigateTo({
        url: '/pages/main/workdetail/index', //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
      })
    }).catch(() => {
      // on cancel
    });
  },
})