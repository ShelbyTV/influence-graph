var db_conf = require('../conf/db.js');
var mongoat = require('mongoat')(db_conf.db_name, db_conf.host, db_conf.port);
var get_all_users = require('../lib/get_all_users.js');

mongoat.db.open(function(e, db_client){
  get_all_users(db_client, mongoat.do_query, function(e, users){
    console.log(users.length, 'users');
    process.exit();
  });
});
