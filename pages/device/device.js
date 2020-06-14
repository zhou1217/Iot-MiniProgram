const token = require('../../utils/Token');
const pricloud = require('../../utils/PriCloud');
const alicloud = require('../../utils/AliCloud');
var switchs=[];
var datas=[];
var desTopic;
var newData=[];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceID:'',
    radioItem:0,
    isShowConfirm:false,
    index:0, 
    array:['switch','data'],
    switch:[],
    switchsNum:0,
    data:[],
    datasNum:0,
    disable:true,
    haveData:true,
    mydata:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var i = 0;
    var j = 0;
    var k = 0;
    var m=0;
    var n=0;
    let ritem = 0;
    let deid = '';
    switchs = [];
    datas = [];
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('getId', function (data) { //获取上个页面传递过来的设备ID以及设备类别
      that.setData({
        deviceID: data.id,
        radioItem: data.radioitem
      })
      ritem = that.data.radioItem;
      deid = that.data.deviceID;
      wx.setNavigationBarTitle({ //设置导航栏标题为设备名
        title: deid
      })
      token.getActions(ritem, deid, function (res) { //获取操作
        for (i = 0; i < res.data.length; i++) {  //将获取到的操作分类
          if (res.data[i].dtype == 'switch') {
            switchs[j] = res.data[i]
            j++
          }
          if (res.data[i].dtype == 'data') {
            datas[k] = res.data[i]
            k++          
          }
        }
        that.setData({
          switchsNum: switchs.length,
          datasNum: datas.length,
          switch: switchs,
          data: datas
        })
      })
      if (ritem==0){  //如果点击的是私有云设备
        token.getBindPriDevice(function (res) {  //获取绑定的私有云设备信息
          pricloud.ConnectPriCloud(res.data, function (err, granted) {  //连接绑定的私有云设备
            if (!err) {
              wx.showToast({
                title: '连接成功',
              })
              token.getPriDownTopic(that.data.deviceID,function(res){           //获取控制设备的下行Topic
                desTopic=res.data;
                pricloud.askDevice(desTopic, that.data.deviceID, function (topic, payload) {         //询问控制设备是否在线        
                  var pay = payload.toString();
                  if (pay.charAt(0) == '{') {
                    var msg = JSON.parse(payload);
                    if (msg.msg.content == "ok") {
                      that.setData({
                        disable: false
                      })
                      pricloud.getData(desTopic, that.data.deviceID, 'data', function (topic, payload){ //获取控制设备数据
                        var pay = payload.toString();
                        if (pay.charAt(0) == '{') {
                          var msg = JSON.parse(payload);
                          if (that.data.data != null) {
                            for(m=0;m<that.data.data.length;m++){         //将从控制设备采集的数据显示到页面上                  
                              if (that.data.data[m].which == msg.msg.which){
                                that.data.data[m].did = msg.msg.content
                              }
                            }
                            that.setData({
                              mydata: that.data.data
                            })
                          }
                        }                        
                      })
                    }
                  }
                })    
              })
        
            }
            else {
              wx.showToast({
                title: '请确认绑定设备信息',
                image: '../../images/toast.png'
              })
            }
          })
        })
      }
      if(ritem==1){  //如果点击的是阿里云设备
        token.getBindAliDevice(function (res) {
          alicloud.ConnectAliCloud(res.data, function () {
            wx.showToast({
              title: '连接成功',
            })
            alicloud.askDevice(that.data.deviceID,that.data.deviceID,function(topic,payload){
              var pay = payload.toString();
              if (pay.charAt(0) == '{') {
                var msg = JSON.parse(payload);
                if (msg.msg.content == "ok") {
                  that.setData({
                    disable:false
                  })
                  alicloud.getData(that.data.deviceID,'data', function (topic, payload) {
                    var pay = payload.toString();
                    if (pay.charAt(0) == '{') {
                      var msg = JSON.parse(payload);
                      if (that.data.data != null) {
                        for (n = 0; n < that.data.data.length; n++) {
                          if (that.data.data[n].which == msg.msg.which) {
                            that.data.data[n].did = msg.msg.content
                          }
                        }
                        that.setData({
                          mydata: that.data.data
                        })
                      }
                    }
                  })  
                }
              }
            })
          })
        })  
     
      }
    })
  },
  /**
   * 弹出添加操作的输入框
   */
  addAction:function(){
    var that=this
    this.setData({
      isShowConfirm:true
    })
  },
  /**
   * 输入框确认按钮事件
   */
  Confirm:function(e){
    var that=this;
    var FormValue=e.detail.value;
    token.addAction(that.data.deviceID, that.data.radioItem, that.data.array[FormValue.type], FormValue.which, FormValue.alias, function(res){ //调用接口添加操作
      console.log(res.data);
    })
    that.setData({
      isShowConfirm:false
    })
  },

  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value
    })
    
  },
  /**
   * 取消事件
   */
  cancel: function () {
    var that = this
    that.setData({
      isShowConfirm: false,
    })
  },
  /**
   * switch改变
   */
  switchChange:function(e){
    var that=this
    if(e.detail.value==true){
      if (that.data.radioItem==0){ //私有云设备
        pricloud.openOrClose(desTopic, that.data.deviceID, e.currentTarget.id, 'on')  //发送开启消息
      }
      if(that.data.radioItem==1){  //阿里云设备
        alicloud.openOrClose(desTopic, that.data.deviceID, e.currentTarget.id, 'on')
      }
    }
    if (e.detail.value == false){
      if(that.data.radioItem==0){
        pricloud.openOrClose(desTopic, that.data.deviceID, e.currentTarget.id, 'off')  //发送关闭消息
      }
      if(that.data.radioItem==1){
        alicloud.openOrClose(desTopic, that.data.deviceID, e.currentTarget.id, 'off')
      }
    }  
  }
})