import mqtt from "mqtt.js"
var client=null;
module.exports = {
  host:'wxs://www.hehong.xyz/mqtt',
    //client: null,
    //记录重连的次数
  reconnectCounts: 0,
  options: {
    protocolVersion: 4, //MQTT连接协议版本
    clientId: '',
    clean: true,
    password: '',
    username: '',
    reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
    connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
    resubscribe: true, //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
    reconnect: true,
  },
  /**
   * 连接私有云设备
   */
  ConnectPriCloud: function (options,callback) {
    var that = this;
    that.options.clientId=options.clientid,
    that.options.username = options.username,
    that.options.password = options.password,
    //开始连接
    client = mqtt.connect(that.host, that.options);
    client.on("connect", function (connack) {
      client.subscribe(options.uptopic, function (err, granted) {
        callback(err,granted);
      })

    });
  },
  /**
   * 获取控制设备数据
   */
  getData:function(desTopic,desDevice,which,callback){
    client.publish(desTopic, '{"src":"wx","des":"' + desDevice + '","msg":{"type":"ask","which":"' + which +'","content":"?"}}');
    client.on("message",function(topic,payload){
      callback(topic,payload)
    })
  },
  /**
   * 询问设备是否在线
   */
  askDevice: function (desTopic,which, callback) {
    client.publish(desTopic, '{"src":"wx","des":"'+which+'","msg":{"type":"ask","which":"'+which+'","content":"?"}}');
    client.on('message', function (topic, payload){
      callback(topic, payload)
    })
  }, 
  //开关量控制
  openOrClose: function (desTopic,desDevice,which,action){
    client.publish(desTopic, '{"src":"wx","des":"' + desDevice + '","msg":{"type":"ctrl","which":"' + which + '","content":"' + action+'"}}');
  }

}