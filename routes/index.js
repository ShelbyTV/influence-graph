var query = require('../lib/query.js');
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
  get_topics(redis, function(e, data){
    success(e, data, res);
  });
};

exports.rebuild = function(req, res){
  /*console.log('rebuilding graph, covering ', req.query.users, ' users');
  build(r.db_client, req.query.users, r.do_query, cb);*/
};
