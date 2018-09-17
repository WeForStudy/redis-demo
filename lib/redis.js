const redis = require('redis');

const client = redis.createClient(6379, '127.0.0.1', {});
client.on('error', (err) => {
  console.log(err);
})
client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});    
   
exports.throw = (bottle, callback) => {
  bottle.time = bottle.time || Date.now();
  const bottleId = Math.random().toString(16);
  const type = {
    male: 0,
    female: 1
  };
  console.log('at redis.js:', bottle);
  /*client.SELECT选择数据库编号*/
    client.SELECT(type[bottle.type], function (event) {
      console.log(event);
      /*client.HMSET 保存哈希键值*/
        client.HMSET(bottleId, bottle, function (err, result) {
          if (err) {
            return callback({
              code: 0,
              msg: "过会儿再来试试吧！"
            });
          }
          console.log('at redis.js:', result);
          callback({
            code: 1,
            msg: result
          });
          /*设置过期时间为1天*/
          client.EXPIRE(bottleId, 86400);
        });
    });
}
exports.pick = function (info, callback) {
  const type = {
    all: Math.round(Math.random()),
    male: 0,
    female: 1
  };
  console.log('info is:', info);
  info.type = info.type || 'all';
  client.SELECT(type[info.type], function () {
    /*随机返回当前数据库的一个键*/
    client.RANDOMKEY(function (err, bottleId) {
      if (!bottleId) {
        return callback({
          code: 0,
          msg: "大海空空如也..."
        });
      }
      /*根据key返回哈希对象*/
      client.HGETALL(bottleId, function (err, bottle) {
        if (err) {
          return callback({
            code: 0,
            msg: "漂流瓶破损了..."
          });
        }
        callback({
          code: 1,
          msg: bottle
        });
        /*根据key删除键值*/
        client.DEL(bottleId);
      });
    });
  });
}