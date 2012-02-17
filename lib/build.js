var klout_conf = require('../conf/klout.js');
var redis_conf = require('../conf/db.js').redis;
var graph_keys = require('./graph_keys.js');
var twitter = require('./twitter.js');
var get_all_users = require('./get_all_users.js');
var maps = require('./maps.js');
var klout = require('klout-api-node')(klout_conf.key);
klout.log_status = true;
var redis = require('redis').createClient(redis_conf.port, redis_conf.host);

/*
 * Build : build the influence graph
 */

var create_graph = function(topics, users, twitter_user_map, redis){
  maps.create_topics_map(redis, topics); //, function(){
    maps.create_influencers_map(redis, twitter_user_map, users, function(){
      console.log('influencer map created');
      /*redis.smembers(graph_keys.get_all_topics_key(), function(e, topics){
        maps.create_stats_map(redis, topics);
      });*/
    });
  //});
};

module.exports = function(db_client, num_users, do_query, cb){
  redis.flushall(function(){
    // this query needs to use users.count + limit & skip
    get_all_users(db_client, do_query, function(e, users){
      if (num_users!=='all'){
        users = users.slice(0, num_users);
      }
      var twitter_users = twitter.get_twitter_users(users);
      var twitter_user_map = twitter.get_twitter_user_map(users);
      var _twitter_users = twitter_users.slice(0, twitter_users.length);
      klout.topics({users:twitter_users}, function(e, topics){
        klout.users({users:_twitter_users}, function(e, users){
          create_graph(topics, users, twitter_user_map, redis, function(){
            return cb(null, true);    
          });
        });
      });
    });
  });
};
