var klout_conf = require('../conf/klout.js');
var redis_conf = require('../conf/db.js').redis;
var get_all_users = require('../lib/get_all_users.js');
var klout = require('klout-api-node')(klout_conf.api_key);
var redis = require('redis').createClient(redis_conf.port, redis_conf.host);
var twitter = require('../lib/twitter.js');

var user_chunk_size = 1000;
get_all_users(function(e, users){
  var twitter_users = twitter.get_twitter_users(users);
     
});
