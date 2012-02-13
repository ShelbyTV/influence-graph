var graph_keys = require('./graph_keys.js');

/*
 * Helper functions for creating
 * component maps in the i-graph
 */

module.exports = {
  create_topics_map : function(redis, topic_objects, cb){
    topic_objects.forEach(function(topic_o){
      redis.sadd(graph_keys.get_all_topics_key(), topic_o.topics);
      topic_o.topics.forEach(function(topic){
        redis.sadd(graph_keys.get_topic_key(topic), topic_o.twitter_screen_name);
      });
      cb(null);
    });
  },
  create_influencers_map : function(redis, twitter_user_map, scores){
    var completed = 0;
    scores.forEach(function(score){
      score.score.shelby_id = twitter_user_map[score.twitter_screen_name];
      redis.hmset(graph_keys.get_influencer_key(score.twitter_screen_name), score.score);
    });
  }
};
