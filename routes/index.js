var query = require('../lib/query.js');
var build = require('../lib/build.js');
var persist = require('../lib/persist.js');
var graph_conf = require('../conf/graph.js');

/*
 * Routes 
 */

var success = function(e, data, res){
  res.end(JSON.stringify({e:e, data:data}));
};

exports.query = function(r, req, res){
  var topics = req.query.topics.split(',');
  success(null, query(r.graph, topics), res); 
};

exports.popular = function(r, req, res){
  get_popular(r, req, res);  
};

exports.rebuild = function(r, req, res, cb){
  console.log('rebuilding graph, covering ', req.query.users, ' users');
  build(r.db_client, req.query.users, r.do_query, cb);  
};

exports.persist = function(r, req, res){
  console.log('persisting graph to disk');
  persist(r.graph, graph_conf.persist_loc, function(e, size){
    res.end(JSON.stringify({e:e, data: size+' node graph persisted'}));
  });
};
