var get_topic_stats = require('../lib/get_topic_stats.js');
var redis_conf = require('../conf/db.js').redis;
var redis = require('redis').createClient(redis_conf.port, redis_conf.host);

var topic = 'developers';
get_topic_stats(redis, topic, function(e, stats){
  console.log(stats);
});
