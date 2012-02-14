var db_conf = require('../conf/db.js');
var mongoat = require('mongoat')(db_conf.db_name, db_conf.host, db_conf.port);
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
  
