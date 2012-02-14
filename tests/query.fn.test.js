var db_conf = require('../conf/db.js');
var mongoat = require('mongoat')(db_conf.db_name, db_conf.host, db_conf.port);
var query = require('../lib/query.js');
var redis_conf = require('../conf/db.js').redis;
var redis = require('redis').createClient(redis_conf.port, redis_conf.host);

/*
 * Query functional test
 */

var topics = ['developers', 'las vegas'];

query(redis, topics, function(e, result){
  if (Object.keys(result).length === topics.length){
    console.log('PASS');
  }
}); 
