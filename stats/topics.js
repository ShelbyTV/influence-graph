var db_conf = require('../conf/db.js');
var mongoat = require('mongoat')(db_conf.db_name, db_conf.host, db_conf.port);
var get_topics = require('../lib/get_topics.js');
var graph_keys = require('../lib/graph_keys.js');
var redis_conf = require('../conf/db.js').redis;
var redis = require('redis').createClient(redis_conf.port, redis_conf.host);

/*
 * Get Topics functional test
 */

var get_topic_influencer_count = function(topic, map, cb){
  redis.scard(graph_keys.get_topic_key(topic), function(e, count){
    map[topic] = count;
    return cb();
  });
};

var get_most_popular_topic = function(map){
  var highest_score = 0;
  var highest_key;
  Object.keys(map).forEach(function(topic){
    if (map[topic] > highest_score){
      highest_score = map[topic];
      highest_key = topic;
    }
  });
  return highest_key;
};

var get_average_i_count = function(map){
  var total = 0;
  Object.keys(map).forEach(function(topic){
    total += map[topic];
  });
  return total/Object.keys(map).length;
};

var get_num_influencers = function(map, cb){
  redis.keys('i:*', function(e, keys){
    return cb(e, keys.length);
  });
};

var print_res = function(map){
  get_num_influencers(map, function(e, num){
    console.log('num influencers', num);
  });
  console.log('num topics', Object.keys(map).length);
  var most_pop = get_most_popular_topic(map);
  console.log('most influenced topic', most_pop, 'with', map[most_pop], 'influencers');
  console.log('average influencer count is', get_average_i_count(map));
};

get_topics(redis, function(e, topics){
  var map = {};
  topics.forEach(function(t){
    get_topic_influencer_count(t, map, function(){
      if (Object.keys(map).length === topics.length){
        print_res(map);
      }
    });
  });
});    
