var db_conf = require('../conf/db.js');
var mongoat = require('mongoat')(db_conf.db_name, db_conf.host, db_conf.port);
var build = require('../lib/build.js');
var get_topics = require('../lib/get_topics.js');
var build_num_users = 100;

/*
 * Get Topics functional test
 */

var TOPICS = ['developers', 'las vegas'];

var build_cb = function(e, graph){
  var topics = get_topics(graph);    
  console.log('TOPICS', topics);
  if (topics.length){
    console.log('PASS!');
  }
  process.exit();
};

mongoat.db.open(function(e, db_client){
  build(db_client, build_num_users, mongoat.do_query, build_cb);
});
