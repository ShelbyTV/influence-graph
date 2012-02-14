var graph_keys = require('./graph_keys.js');

/*
 * Query
 * this has its own file
 * as queries may be db based in future
 */

/*
 * Returns a map of requested topics to influencers
 * {
 *  'beach' : [{influencer obj}]
 * }
 */


var get_influencer_handle_sets = function(redis, topics, cb){
  var multi = redis.multi();
  topics.forEach(function(topic){
    multi.smembers(graph_keys.get_topic_key(topic))
  });
  multi.exec(cb);
};

var get_influencers = function(redis, topic, influencer_handles, results, cb){
  var multi = redis.multi();
  influencer_handles.forEach(function(handle){
    multi.hgetall(graph_keys.get_influencer_key(handle))
  });
  multi.exec(function(e, influencers){
    results[topic] = influencers;
    return cb();
  });
};

module.exports = function(redis, topics, cb){
  var results = {};
  get_influencer_handle_sets(redis, topics, function(e, influencer_handle_sets){
    for (var i=0; i<influencer_handle_sets.length; i++) {
      get_influencers(redis, topics[i], influencer_handle_sets[i], results, function(){
        if (Object.keys(results).length === topics.length){
          return cb(null, results);
        }
      });
    }
  });
};
