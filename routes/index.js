var query = require('../lib/query.js');
var graph_keys = require('../lib/graph_keys.js');
var get_topics = require('../lib/get_topics.js');
var redis_conf = require('../conf/db.js').redis;
var redis = require('redis').createClient(redis_conf.port, redis_conf.host);

/*
 * Routes 
 */

var success = function(e, data, res){
  res.end(JSON.stringify({e:e, data:data}));
};

exports.query = function(req, res){
  var topics = req.query.topics.split(',');
  query(redis, topics, function(e, data){
    success(e, data, res); 
  });
};

exports.topics = function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  get_topics(redis, function(e, data){
    success(e, data, res);
  });
};

exports.stats = function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  var topics = req.query.topic;
  var multi = redis.multi();
  topics = topics.split(',');
  topics.forEach(function(topic){
    multi.hgetall(graph_keys.get_stats_key(topic));
  });
  multi.exec(function(e, data){
    var map = {};
    topics.forEach(function(t, i){
      map[t] = data[i];
    });
    console.log(map);
    success(e, map, res);
  });
};

exports.rebuild = function(req, res){
  /*console.log('rebuilding graph, covering ', req.query.users, ' users');
  build(r.db_client, req.query.users, r.do_query, cb);*/
};
