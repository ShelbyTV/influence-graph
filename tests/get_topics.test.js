var get_topics = require('../lib/get_topics.js');
var redis_conf = require('../conf/db.js').redis;
var redis = require('redis').createClient(redis_conf.port, redis_conf.host);

/*
 * Get Topics functional test
 */

get_topics(redis, function(e, topics){
  console.log(topics);
  console.log(topics.length, 'topics');
});    
  
