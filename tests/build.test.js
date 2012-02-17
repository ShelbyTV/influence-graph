var db_conf = require('../conf/db.js');
var mongoat = require('mongoat')(db_conf.db_name, db_conf.host, db_conf.port);
var build = require('../lib/build.js');
var build_num_users = 1000;
var fs = require('fs');

var num_users = process.argv[2] || 'all';  
mongoat.db.open(function(e, db_client){
  build(db_client, num_users, mongoat.do_query, function(e, graph){
  });
});
