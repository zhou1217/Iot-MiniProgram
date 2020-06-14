import iot from 'alibabacloud-iot-device-sdk.min.js';
var device=null;
var desTopic=null;
module.exports={
  device:null,
  options:{
    productKey: '*******',  //必须是socket合法列表中有才不会报错
    deviceName: '*******',
    deviceSecret: '**********************',
    // 支付宝小程序和微信小程序额外需要配置协议参数
    "protocol": 'alis://',
    "protocol": 'wxs://',   
  },
  /**
   * 连接阿里云设备
   */
  ConnectAliCloud:function(options,callback){
    var that=this;
    that.options.productKey=options.productkey;
    that.options.deviceName=options.devicename;
    that.options.deviceSecret=options.devicesecret;
    device=iot.device(that.options);
    device.on("connect", () => {callback()})
    device.subscribe(options.uptopic);
    desTopic = '/' + options.productkey + '/' + options.devicename +'/user/download';
  },
  /**
   * 获取控制设备数据
   */
  getData:function(desDevice,which,callback){
    var that=this;
    device.publish(desTopic, '{"src":"wx","des":"' + desDevice + '","msg":{"type":"ask","which":"' + which + '","content":"?"}}');
    device.on("message",(topic,payload)=>{
      callback(topic,payload)
    })
  },
  /**
   * 询问控制设备是否在线
   */
  askDevice:function(desDevice,which,callback){
    device.publish(desTopic, '{"src":"wx","des":"' + desDevice + '","msg":{"type":"ask","which":"' + which + '","content":"?"}}');   
    device.on('message',(topic,payload)=>{
      callback(topic, payload)
    })
  },
  /**
   * 开关量控制
   */
  openOrClose: function (desTopic, desDevice, which, action) {
    device.publish(desTopic, '{"src":"wx","des":"' + desDevice + '","msg":{"type":"ctrl","which":"' + which + '","content":"' + action + '"}}');
  }
}