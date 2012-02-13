var klout_conf = require('../conf/klout.js');
var redis_conf = require('../conf/db.js').redis;
var twitter = require('./twitter.js');
var maps = require('./maps.js');
var klout = require('klout-api-node')(klout_conf.key);
klout.log_status = true;
var redis = require('redis').createClient(redis_conf.port, redis_conf.host);

/*
 * Build : build the influence graph
 */

var get_query_options = function(db_client, num_users, cb){
  var options = num_users == 'all' ? {} : {limit:num_users};
  return {
    collection : 'users',
    params : {},
    options : options 
  };
};

var create_graph = function(topics, scores, twitter_user_map, redis, cb){
  maps.create_topics_map(redis, topics, function(){
    maps.create_influencers_map(redis, twitter_user_map, scores, cb);
  });
};

module.exports = function(db_client, num_users, do_query, cb){
  var query_options = get_query_options(db_client, num_users);
  redis.flushall(function(){
    // this query needs to use users.count + limit & skip
    do_query(db_client, query_options, function(e, users){
      var twitter_users = twitter.get_twitter_users(users);
      var twitter_user_map = twitter.get_twitter_user_map(users);
      klout.topics({users:twitter_users}, function(e, topics){
        klout.users({users:twitter_users}, function(e, users){
          create_graph(topics, users, twitter_user_map, redis, function(){
            return cb(null, true);    
          });
        });
      });
    });
  });
};
