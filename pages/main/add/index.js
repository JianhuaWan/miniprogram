//index.js
//获取应用实例
import Toast from '../../vant/dist/toast/toast';
import Dialog from "../../vant/dist/dialog/dialog";
var Bmob = require('../../bmob/Bmob-1.6.7.min.js');
const app = getApp();
Page({
  data: {
    worktotal: '',
    workwait: '',
    workdoing: '',
    workdone: '',
    hasUserInfo: false,
    active: '0',
    money: 0,
    value: '',
    motto: 'Hello World',
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show: false,
    show2: false,
    thingstype: '',
    thingstype2: '',
    issubmit:false,
    actions: [{
        name: '跑腿服务'
      },
      {
        name: '陪聊天',
      },
      {
        name: '帮忙解决问题',
      },
      {
        name: '其他服务',
      },
    ],
    actions2: [{
        name: '男'
      },
      {
        name: '女',
      },
      {
        name: '不限',
      },
    ],
    steps: [{
        text: '步骤一',
        desc: '填写任务'
      },
      {
        text: '步骤二',
        desc: '等待领取'
      },
      {
        text: '步骤三',
        desc: '任务处理中'
      },
      {
        text: '步骤四',
        desc: '任务完成'
      }
    ]
  },

  showpop() {
    this.setData({
      show: true
    })
  },
  showpop2() {
    this.setData({
      show2: true
    })
  },

  onChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
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
    };
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onClose2() {
    this.setData({
      show2: false
    });
  },
  onSelect(event) {
    this.setData({
      thingstype: event.detail.name,
      show: false
    })

    console.log(event.detail.name);
  },
  onSelect2(event) {
    this.setData({
      thingstype2: event.detail.name,
      show2: false
    })

    console.log(event.detail.name);
  },
  onClickIcon() {
    Dialog.alert({
      title: '提醒',
      message: '预计w币为该任务完成后对方可以获取的数量,请合理填写!'
    }).then(() => {
      // on close
    });
  },
  submit() {
    //所有的都已经填写后开始提交
    if (this.data.thingstype != '' && this.data.thingstype2 != '' && this.data.money != 0) {
      Dialog.confirm({
        title: '提醒',
        message: '您将消费' + this.data.money + 'w币来发布该任务'
      }).then(() => {
        // on confirm
        this.setData({
          active:'1',
          issubmit:true
        })
      }).catch(() => {
        // on cancel
      });
    } else {
      Toast("请补全信息再提交!");
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  changemoney(event) {
    console.log(event.detail);
    this.setData({
      money: event.detail
    })
  }
})