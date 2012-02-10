var db_conf = require('../conf/db.js');
var mongoat = require('mongoat')(db_conf.db_name, db_conf.host, db_conf.port);
var build = require('../lib/build.js');
var build_num_users = 100;

mongoat.db.open(function(e, db_client){
  build(db_client, build_num_users, mongoat.do_query, function(e, graph){
    console.log('Graph:', graph);
    if (!e && graph.hasOwnProperty('topics') && graph.hasOwnProperty('influencers')){
      console.log('PASS: graph successfully built');
    } else {
      console.log('FAIL: bad graph');
    }
    process.exit();
  });
});
