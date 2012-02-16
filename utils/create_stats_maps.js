var redis_conf = require('../conf/db.js').redis;
var maps = require('../lib/maps.js');
var get_topics = require('../lib/get_topics.js');
var redis = require('redis').createClient(redis_conf.port, redis_conf.host);

get_topics(redis, function(e, topics){
  console.log(topics);
  maps.create_stats_map(redis, topics);
});
