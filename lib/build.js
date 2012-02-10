var klout_conf = require('../conf/klout.js');
var klout = require('klout-api-node')(klout_conf.key);
/*
 * Build : build the influence graph
 */


var is_twitter_user = function(user){
  var is_twitter_user  = false;
  user.authentications.forEach(function(auth){
    is_twitter_user = (auth.provider && auth.provider === 'twitter');
  });
  return is_twitter_user;
};

var get_query_options = function(db_client, num_users, cb){
  var options = num_users == 'all' ? {} : {limit:num_users};
  return {
    collection : 'users',
    params : {},
    options : options 
  };
};

var get_user_topics = function(username, cb){
  klout.topics(username, function(e, data){
    return cb(e, data);
  });
};

var get_user_scores = function(username, cb){
  klout.users(username, function(e, data){
    return cb(e, data);
  });
};

var get_twitter_users = function(users){
  var twitter_users = [];
  users.forEach(function(u){
    if (is_twitter_user(u)){
      twitter_users.push(get_user_twitter_handle(u));
    }
  });
  return twitter_users.join(',');
};

var get_twitter_user_map = function(users){
  var map = {};
  users.forEach(function(u){
    if (is_twitter_user(u)){
      map[get_user_twitter_handle(u)] = u;
    }
  });
  return map;
};

var get_user_twitter_handle = function(u){
  var twitter_handle;
  u.authentications.forEach(function(auth){
    if (auth.provider && auth.provider === 'twitter'){
      twitter_handle = auth.nickname;
    }
  });
  return twitter_handle;
};

create_topics_map = function(topic_objects){
  var map = {};
  topic_objects.forEach(function(topic_o){
    topic_o.topics.forEach(function(topic){
      if (map[topic]){
        map[topic].push(topic_o.twitter_screen_name);
      } else {
        map[topic] = [topic_o.twitter_screen_name];
      }
    });
  });
  return map;
};

create_influencers_map = function(twitter_user_map, scores){
  var map = {};
  scores.forEach(function(score){
    map[score.twitter_screen_name] = {score:score.score, user:twitter_user_map[score.twitter_screen_name]}
  });
  return map;
};

var create_graph = function(topics, scores, twitter_user_map){
  return {
    topics : create_topics_map(topics),
    influencers : create_influencers_map(twitter_user_map, scores)
  };
};

module.exports = function(db_client, num_users, do_query, cb){
  var query_options = get_query_options(db_client, num_users);
  do_query(db_client, query_options, function(e, users){
    var twitter_users = get_twitter_users(users);
    var twitter_user_map = get_twitter_user_map(users);
    get_user_topics({users:twitter_users}, function(e, topics){
      get_user_scores({users:twitter_users}, function(e, scores){
        var graph = create_graph(topics, scores, twitter_user_map);
        return cb(null, graph);    
      });
    });
  });
};
