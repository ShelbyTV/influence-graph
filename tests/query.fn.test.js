var db_conf = require('../conf/db.js');
var mongoat = require('mongoat')(db_conf.db_name, db_conf.host, db_conf.port);
var build = require('../lib/build.js');
var build_num_users = 100;
var query = require('../lib/query.js');

/*
 * Query functional test
 */

var TOPICS = ['developers', 'las vegas'];

var query_graph = function(graph, topics){
  console.log('querying', graph);
  var results = query(graph, topics); 
  console.log(results);
  if (Object.keys(results).length){
      console.log('PASS: got', Object.keys(results).length, 'results for', TOPICS.join(','));
  } else {
      console.log('FAIL!');
  }
  process.exit();
};

mongoat.db.open(function(e, db_client){
  build(db_client, build_num_users, mongoat.do_query, function(e, graph){
    query_graph(graph, TOPICS);
  });
});
