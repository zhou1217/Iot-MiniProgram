const app = getApp();
const token = require('../../utils/Token');
Page({
  data: {
    isShowPriConfirm: false,
    isShowAliConfirm: false,

    nums:0,
    num:0,
    radio:0,
    child: [],
    devicenums:0,
    devicenum:0,
    devices:[]
  },
  /**
   * 根据radio显示出不同的页面
   */
  radioChange: function (e) {
    var that=this;
    that.setData({
      nums: 0,
      num: 0,
      radio: 0,
      child: [],
      devicenums: 0,
      devicenum: 0,
      devices: []      
    })
    if (token.islogin == 1) {   //在登录的情况下获取用户的设备
      if (e.detail.value == "private") {  //切换显示私有云设备和阿里云设备
        that.setData({
          radio: 0
        });
        token.getPriDevices(function (res) { //调用接口获取数据库储存的设备
          //根据获取的设备计算出设备数，在页面中加载出来
          that.setData({  
            nums: parseInt(res.data.length / 3), 
            num: res.data.length % 3,
            child: res.data
          })
        });      

      } else {
        that.setData({
          radio: 1
        });
        token.getAliDevices(function (res) {
          console.log(res);
          that.setData({
            devicenums: parseInt(res.data.length / 3),
            devicenum: res.data.length % 3,
            devices: res.data
          })
        });       
      }
    }

  },
  onLoad:function(){
    
  },
  /**
   * 添加私有云设备
   */

  addPriDevice:function(){
    var that=this;
    if(token.islogin==1){  //判断是否已经登录
      token.isBindPriCloud(function (res) { //是否绑定了云设备
        if (res.data.myclientid != "") {
          that.setData({
            isShowPriConfirm: true
          })
        } else {
          wx.showToast({
            title: '请先绑定私有云设备',
            image:'../../images/toast.png'
          })

        }
      })
    }else{
      wx.showToast({
        title: '请先登录',
        image: '../../images/toast.png'
      })
    }

  },
  /**
   * 添加阿里云设备
   */
  addAliDevice: function () {
    var that = this;
    if(token.islogin==1){
      token.isBindAliCloud(function (res) {
        if (res.data.myprikey != "") {
          that.setData({
            isShowAliConfirm: true
          })
        } else {
          wx.showToast({
            title: '请先绑定阿里云设备',
            image: '../../images/toast.png'
          })
        }
      })
    }else{
      wx.showToast({
        title: '请先登录',
        image: '../../images/toast.png'
      })      
    }


  },
  /**
   * 弹出框取消按钮事件，关闭弹出框
   */
  cancel: function () {
    var that = this
    that.setData({
      isShowAliConfirm: false,
      isShowPriConfirm: false,
    })
  },
  /**
   * 添加私有云设备弹出框，确认按钮事件
   */
  PriConfirm: function (e) {
    var that = this;
    token.addPrivateDevices(e.detail.value,function(res){  //调用接口添加设备
      console.log(res);
    })
    that.setData({
      isShowPriConfirm: false,
      isShowAliConfirm: false,
    })
  }, 
  /**
   * 添加阿里云设备弹出框，确认按钮事件
   */
  AliConfirm: function (e) {
    var that = this;
    token.addAliyunDevices(e.detail.value, function (res) {  //调用接口添加设备
      console.log(res);
    }) 
    that.setData({
      isShowPriConfirm: false,
      isShowAliConfirm: false,
    })
  }, 
  /**
   * 设备按钮长按事件，长按删除
   */
  prilongtap:function(e){
    wx.showModal({
      title: '提示',
      content: '确认要删除' + e.currentTarget.id+'?',
      success(res) {
        if (res.confirm) {
          token.deletePriDevice(e.currentTarget.id, function (res) {
            wx.showToast({
              title: '成功删除' + e.currentTarget.id,
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  /**
   * 设备按钮长按事件，长按删除
   */
  alilongtap: function (e) {
    wx.showModal({
      title: '提示',
      content: '确认要删除'+e.currentTarget.id+'?',
      success(res){
        if(res.confirm){
          token.deleteAliDevice(e.currentTarget.id, function (res) {
            wx.showToast({
              title: '成功删除' +e.currentTarget.id,
            })
          })
        }else if(res.cancel){
          console.log('用户点击取消')
        }

      }
    })
  },
  /**
   * 点击设备进入设备操作页面
   */
  goToDevice:function(e){
    var that=this;
    console.log(e);
    wx.navigateTo({
      url: '../device/device',
      success:function(res){
        res.eventChannel.emit('getId', { id: e.currentTarget.id, radioitem: that.data.radio}) //向device页面传递点击的设备名和设备类别
      }
    })
  }

})
