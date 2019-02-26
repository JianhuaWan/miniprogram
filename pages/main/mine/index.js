//index.js
//获取应用实例
import Toast from '../../vant/dist/toast/toast';
var Bmob = require('../../bmob/Bmob-1.6.7.min.js');
const app = getApp()

Page({
  data: {
    avatarUrl: 'http://bmob-cdn-16902.b0.upaiyun.com/2019/02/15/3a01dc464048389580eafc64fed78269.png',
    nickName: '',
    bg_mine: 'http://bmob-cdn-16902.b0.upaiyun.com/2019/02/14/8558ff714001dceb80894c376b2f2a02.jpg',
    show: false,
    tempFilePaths: '',
    objectid: '',
    coins: '0',
    issign: false,
    coinobjectid: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    try {
      const openid = wx.getStorageSync('openid')
      if (openid) {
        //获取用户当前信息
        let current = Bmob.User.current()
        const querycoin = Bmob.Query('coin');
        querycoin.get(current.own.objectId).then(res => {
          this.setData({
            coinobjectid: res.objectId
          })
          var objectid = res.objectId;
          console.log(this.getNowFormatDate());
          console.log(res.updatedAt.substring(0, 10));
          if (this.getNowFormatDate() == res.updatedAt.substring(0, 10)) {
            if (res.issign == '0') {
              this.setData({
                issign: false
              })
            }else{
              this.setData({
                issign: true
              })
            }
          } else {
            const query = Bmob.Query('coin');
            query.get(objectid).then(res => {
              console.log(res)
              res.set('issign', '0')
              res.save()
            }).catch(err => {
              console.log(err)
            })
            this.setData({
              issign: false
            })
          }
          this.setData({
            coins: res.coins
          })
        }).catch(err => {
          console.log(err)
        })
        if (current.mine_bg === undefined) {
          this.setData({
            nickName: current.username,
            avatarUrl: current.head,
            objectid: current.objectId
          })
        } else {
          this.setData({
            nickName: current.username,
            avatarUrl: current.head,
            bg_mine: current.mine_bg,
            objectid: current.objectId
          })
        }
        console.log("444" + current.username)
        //查询当前是否有签到和当前w币的数量
        const query = Bmob.Query("coin");
        // 只返回select的字段值
        query.select("title");
        query.find().then(res => {
          // 返回成功
          console.log(res)
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  getmoney() {
    this.setData({
      show: true
    });
  },
  previewImage: function(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  changebg() {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        _this.setData({
          tempFilePaths: res.tempFilePaths,
          bg_mine: res.tempFilePaths[0]
        })
        var tempFilePaths = res.tempFilePaths
        var file;
        for (let item of tempFilePaths) {
          console.log('itemn', item)
          file = Bmob.File('abc.jpg', item);
        }
        file.save().then(res => {
          console.log(res.length);
          console.log(res[0].url);
          const query = Bmob.Query('_User');
          query.set('id', _this.data.objectid) //需要修改的objectId
          query.set('mine_bg', res[0].url)
          query.save().then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
        })

      }
    })
  },
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  sign() {
    //签到
    const query = Bmob.Query('coin');
    var overcoins = parseInt(this.data.coins) + 10
    this.setData({
      issign: true,
      coins: overcoins
    })
    query.get(this.data.coinobjectid).then(res => {
      console.log(res)
      res.set('issign', '1')
      res.set('coins', overcoins+'')
      res.save()
    }).catch(err => {
      console.log(err)
    })
  },
  signed() {
    Toast("今天已经签到过了!");
  }
})