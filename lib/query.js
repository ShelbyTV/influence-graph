/*
 * Query
 * this has its own file
 * as queries may be db based in future
 */

module.exports = function(graph, topics){
  var results = {};
  topics.forEach(function(topic){
    results[topic] = [];
    if (graph.topics.hasOwnProperty(topic)){
      graph.topics[topic].forEach(function(influencer){
        results[topic].push(graph.influencers[influencer]);
      });
    }
  });
  return results;
};
