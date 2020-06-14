// pages/my/my.js
const baseUrl = 'https://www.domain.com/*****.php/api/'
const token=require('../../utils/Token');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin: false,
    LoginOrReg:'AutoLogin',
    nickname:'',
    avatarUrl:'',
    canIUse: wx.canIUse('view.open-type.getUserInfo'),
    DeviceNum:0,
    LiveNum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    token.getToken();  //先获取令牌
    token.isLogOut(function (res) { //根据令牌获取数据中登录登录状态
      //console.log(res);
      var isLogout = res.data;
      if (isLogout==1) { //如果是已注销状态，则需要用户点击登录才能登录
        //console.log(res.data);
        that.setData({
          LoginOrReg: 'AutoLogin',
          hasLogin: false
        })
      } 
      if (isLogout == 0) { //如果是未注销状态则会自动登录
        that.AutoLogin();
      }
    });

  },
  /**
   * 自动登录
   */
  AutoLogin:function () {
    var that=this;
    var userinfo=null;
    var nickname='';
    var avatarUrl='';
    token.login(function (){ //调用接口登录
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) { //获取用户授权
            wx.getUserInfo({  //获取用户信息
              success: function (res) {
                userinfo = res.userInfo;
                nickname = userinfo.nickName;
                avatarUrl = userinfo.avatarUrl;
                that.setData({
                  nickname: nickname,
                  avatarUrl: avatarUrl,
                  hasLogin: true,
                  LoginOrReg: 'userinfo'
                });
                token.islogin=1;    //改变本地登录态
                token.getDeviceNum(function(){ //获取设备数
                  that.setData({
                    DeviceNum: token.aliDeviceNum + token.priDeviceNum
                  })
                });      

                wx.showToast({
                  title: '登录成功',
                  icon: 'success'
                })

              }

            })
          }
        }
      })
    })
  },
  /**
   * 跳转至用户信息页面
   */
  userinfo:function(){
    wx.redirectTo({
      url: '../userinfo/userinfo',
    })
  }

})
