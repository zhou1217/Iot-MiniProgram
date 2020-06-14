module.exports={
  baseUrl :'https://www.hehong.xyz/index.php/api/',
  token:'',
  islogin:0,
  priDeviceNum:0,
  aliDeviceNum:0,
  /**
   * 获取token并存入缓存
   */
  getToken:function(e) {
    var that=this;
    wx.login({
      success(res) {
        //console.log(res.code);
        wx.request({
          url: that.baseUrl + 'gettoken',
          data: {
            code: res.code
          },
          method: 'POST',
          success: function (res) {
            //wx.removeStorageSync('token');
            wx.setStorageSync('token',res.data);
            //console.log('token:'+res.data);
          },
        })
      }
    })
  },

  /*
  使用获取到的令牌获取数据库中是否注销
  */
  isLogOut:function(callback) {
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl + 'islogout',{
      token: that.token
    }, callback);
  },
  /**
   * 检测本设备是否绑定了私有云端设备
   */
  isBindPriCloud: function(callback) {
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl + 'isbindpricloud',{
      token: that.token
    }, callback)
  },
  /**
   * 检测本设备是否绑定了阿里云端设备
   */
  isBindAliCloud: function (callback) {
    var that = this;
    that.verifyToken();
    that.myRequest(that.baseUrl + 'isbindalicloud',{
      token: that.token
    }, callback)
  },
  /**
   * 绑定私有云端设备
   * 
   */
  bindPriCloud: function(paras,callback) {
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl + 'bindpricloud', {
      token: that.token,
      clientid: paras.clientId,
      username: paras.username,
      password: paras.password,
      uptopic: paras.upTopic
    }, function(res){
      callback(res);
    })
  },
  /**
   * 绑定阿里云设备
   */
  bindAliCloud:function(paras,callback) {
    var that = this;
    that.verifyToken();
    that.myRequest(that.baseUrl + 'bindalicloud',{
      token: that.token,
      productkey: paras.productKey,
      devicename: paras.deviceName,
      devicesecret: paras.deviceSecret,
      uptopic: paras.upTopic
    }, function (res) {
      callback(res);
    })
  },

  /**
   * 添加私有云设备
   */
  addPrivateDevices:function(paras,callback) {
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl + 'addpridevice',{
      token:that.token,
      clientid: paras.clientid,
      username: paras.username,
      password: paras.password,
      uptopic: paras.uptopic,
      downtopic: paras.downtopic      
    }, function (res) {
      callback(res)
    })
  },
  /**
   * 添加阿里云设备
   */
  addAliyunDevices:function(paras,callback) {
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl + 'addalidevice', {
      token: that.token,
      productkey: paras.productkey,
      devicename: paras.devicename,
      devicesecret: paras.devicesecret,
      uptopic: paras.uptopic,
      downtopic: paras.downtopic
    }, callback)
  },
  /**
   * 登录将已注销字段改成未注销，设置头像和昵称
   */
  login:function(callback) {
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl + 'login',{
      token : that.token
    }, callback);
  },
  /**
   * 注销将登录字段改为已注销
   */
  logout:function(callback){
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl + 'logout',{
      token: that.token 
    },callback);
  },
  /**
   * 获取总设备数
   */
  getDeviceNum:function(callback){
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl + 'getpridevices', { token: that.token }, function(res){
      that.priDeviceNum = res.data.length;
    })
    that.myRequest(that.baseUrl + 'getAlidevices', { token: that.token }, function(res){
      that.aliDeviceNum=res.data.length;
      callback();
    })

  },

  /**
   * 封装请求接口
   */
  myRequest:function(myUrl,paras, callback) {
    wx.request({
      url: myUrl,
      data: paras,
      method: 'POST',
      header:{
        'content-type': 'application/json'
      },
      success: function (res) {
        callback(res)
      }
    })
  },
  /**
   * 验证token是否有效
   */
  verifyToken:function(){
    var that=this;
    if(that.token==''){
      that.token = wx.getStorageSync('token');
    }
    
    that.myRequest(that.baseUrl+'verifytoken',{
    token:that.token},function(res){
      if ((res.data == 1)){
        console.log(res)
      }else{
        //console.log(res);
        that.getToken();
        that.token = '';
        that.verifyToken();
      }
    })
  },
  /**
   * 获取私有云设备
   */
  getPriDevices:function(callback){
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl +'getpridevices',{token:that.token},callback)
  },
  /**
   * 获取阿里云设备
   */
  getAliDevices: function (callback) {
    var that = this;
    that.verifyToken();
    that.myRequest(that.baseUrl + 'getAlidevices', { token: that.token }, callback)
  },
  /**
   * 删除私有云设备
   */
  deletePriDevice:function(clientId,callback){
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl+'deletepridevice',{
    token:that.token,
    clientid:clientId
    },callback)
  },
  /**
   * 删除阿里云设备
   */
  deleteAliDevice:function(deviceName,callback){
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl+'deletealidevice',{
      token:that.token,
      devicename:deviceName
    },callback)
  },
  /**
   * 添加操作
   */
  addAction:function(mydid,mydtype,mytype,mywhich,myalias,callback){
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl +'adddeviceaction',{
      token:that.token,
      deviceid:mydid,
      devicetype:mydtype,
      type:mytype,
      which:mywhich,
      alias:myalias
    },callback);
  },
  /**
   * 获取操作
   */
  getActions: function (mydevicetype, mydeviceid,callback){
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl+'getdeviceaction',{
      token:that.token,
      dtype: mydevicetype,      
      did:mydeviceid,
    },callback);
  },
  /**
   * 获取绑定的私有云设备
   */
  getBindPriDevice:function(callback){
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl+'getbindpridevice',{
      token:that.token
    },callback);
  },
  /**
   * 获取绑定的阿里云设备
   */
  getBindAliDevice:function(callback){
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl+'getbindalidevice',{
      token:that.token
    },callback)
  },
  /**
   * 获取控制设备的下行主题
   */
  getPriDownTopic:function(mydeviceid,callback){
    var that=this;
    that.verifyToken();
    that.myRequest(that.baseUrl +'getdowntopic',{
      token:that.token,
      deviceid:mydeviceid
    },callback)
  }
  
}
