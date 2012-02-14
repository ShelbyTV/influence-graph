var graph_keys = require('./graph_keys.js');
/*
 * Get graph topics
 */

module.exports = function(redis, cb){
  redis.smembers(graph_keys.get_all_topics_key(), cb);
};
