const token = require('../../utils/Token');
const pricloud=require('../../utils/PriCloud');
const alicloud = require('../../utils/AliCloud');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowPriConfirm: false,
    isShowAliConfirm: false,
  },
  /**
   * 注销用户
   */
  logout:function(){
    token.logout(function(){  //调用接口注销登录
      wx.showToast({
        title: '注销成功',
        icon:'success'
      });
      token.islogin=0;
      wx.switchTab({
        url: '../index/index',
      })      
    })
  },
  /**
   * 绑定私有云设备
   */
  bindPriCloud:function(){
    var that=this;
    token.isBindPriCloud(function (res) { //调用接口判断是否绑定私有云
      if (res.data.myclientid != "") {
        wx.showModal({
          title: '提示',
          content: '已经绑定，确认修改？',
          success(res) {
            if (res.confirm) {  //点击确定修改，则弹出绑定私有云信息框
              that.setData({
                isShowPriConfirm: true
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        that.setData({
          isShowPriConfirm: true
        })
      }
    })

  },
  /**
   * 绑定私有云设备
   */
  bindAliCloud: function () {
    var that=this;
    token.isBindAliCloud(function (res) {
      if (res.data.myprikey != "") {
        wx.showModal({
          title: '提示',
          content: '已经绑定，确认修改？',
          success(res) {
            if (res.confirm) {
              that.setData({
                isShowPriConfirm: true
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })       

      } else {
        that.setData({
          isShowAliConfirm: true
        })
      }
    })
  },
  /**
   * 取消关闭弹出框
   */
  cancel: function () {
    var that = this
    that.setData({
      isShowPriConfirm: false,
      isShowAliConfirm: false,
    })
  },
  /**
   * 绑定私有云设备弹出框确认按钮事件
   */
  PriConfirm: function (e) {
    var that = this; //调用连接云平台方法
    pricloud.ConnectPriCloud({
      clientId: e.detail.value.clientid,  
      username: e.detail.value.username,
      password: e.detail.value.password,
      upTopic: e.detail.value.uptopic},function(err,granted){
      if (!err) {
        wx.showToast({
          title: '设备绑定成功'
        })
        //调用接口储存填写的信息
        token.bindPriCloud({
          clientId: e.detail.value.clientid,
          username: e.detail.value.username, 
          password: e.detail.value.password, 
          upTopic: e.detail.value.uptopic
        },function(res){
          console.log(res);
        })
      } else {
        wx.showToast({
          title: '服务器连接失败',
          image: '../../images/toast.png',
        })
      }
    })
    that.setData({
      isShowPriConfirm: false,
      isShowAliConfirm: false,
    })
  }, 
  /**
   * 绑定阿里云设备弹出框确认按钮事件
   */
  AliConfirm: function (e) {
    var that = this;
    var prokey = e.detail.value.productkey;
    var dename = e.detail.value.devicename;
    var desecr = e.detail.value.devicesecret;
    var uptopi = e.detail.value.uptopic;
    alicloud.ConnectAliCloud({
      productKey: prokey,  //必须是socket合法列表中有才不会报错
      deviceName: dename,
      deviceSecret: desecr,
      upTopic: uptopi
    }, function () {
        wx.showToast({
          title: '设备绑定成功'
        });
      token.bindAliCloud({
        productKey: prokey,  //必须是socket合法列表中有才不会报错
        deviceName: dename,
        deviceSecret: desecr,
        upTopic: uptopi
      },function(res){
        console.log(res);
      });
      });
    that.setData({
      isShowPriConfirm: false,
      isShowAliConfirm: false,
    })
  }, 

})