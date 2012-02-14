var graph_keys = require('./graph_keys.js');

/*
 * Get all influencers for a topic
 */

var get_influencers = function(redis, handles, cb){
  var multi = redis.multi();  
  handles.forEach(function(h){
    multi.hgetall(graph_keys.get_influencer_key(h))
  });
  multi.exec(cb);
};

var add_class = function(kclass, stats){
  if (stats.classes[kclass]){
    stats.classes[kclass] += 1;
  } else {
    stats.classes[kclass] = 1;
  }
};

var get_stats = function(influencers){
  var stats = {
    classes : {},
    true_reach : 0,
    amplification_score : 0,
    network_score : 0,
    kscore : 0,
    influencers : influencers.length
  };
  influencers.forEach(function(i){
    add_class(i.kclass, stats);
    stats.true_reach+=(i.true_reach/1);
    stats.amplification_score+=(i.amplification_score/1);
    stats.network_score+=(i.network_score/1);
    stats.kscore+=(i.kscore/1);
  });
  return stats;
};

module.exports = function(redis, topic, cb){
  redis.smembers(graph_keys.get_topic_key(topic), function(e, inf_handles){
    get_influencers(redis, inf_handles, function(e, influencers){
      return cb(e, get_stats(influencers));
    });
  });
};
