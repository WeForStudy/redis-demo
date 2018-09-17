const redislib = require('./lib/redis');

redislib.throw({
  type: 'male',
}, res => {
  console.log(res);
})
redislib.pick({
  type: 'male',
}, res => {
  console.log('at callback:', res);
});