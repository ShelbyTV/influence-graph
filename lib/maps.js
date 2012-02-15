var graph_keys = require('./graph_keys.js');
var get_topic_stats = require('./get_topic_stats.js');

/*
 * Helper functions for creating
 * component maps in the i-graph
 */

var write_stats = function(redis, topic, stats){
  redis.hmset(graph_keys.get_stats_key(topic), stats);
};

module.exports = {
  create_topics_map : function(redis, topic_objects){
    var topics_added = 0;
    topic_objects.forEach(function(topic_o){
      // adding all topics to 'all_topics' set
      if (topic_o) {
        redis.sadd(graph_keys.get_all_topics_key(), topic_o.topics, function(){
          topics_added+=1;
        });
        topic_o.topics.forEach(function(topic){
          redis.sadd(graph_keys.get_topic_key(topic), topic_o.twitter_screen_name);
        });
      }
    });
  },
  create_influencers_map : function(redis, twitter_user_map, users, cb){
    var completed = 0;
    var multi = redis.multi();
    users.forEach(function(u){
      u.score.shelby_id = twitter_user_map[u.twitter_screen_name];
      multi.hmset(graph_keys.get_influencer_key(u.twitter_screen_name), u.score);
    });
    multi.exec(cb);
  },
  create_stats_map : function(redis, topics){
    topics.forEach(function(t){
      get_topic_stats(redis, t, function(e, stats){
        write_stats(redis, t, stats);
      });
    });
  }
};
