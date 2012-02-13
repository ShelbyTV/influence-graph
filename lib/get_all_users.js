var db_conf = require('../conf/db.js');

/*
 * Get all the users
 */

var get_queries = function(num_users, max_users_chunk){
  var queries = [];
  var num_queries = Math.ceil(num_users/max_users_chunk);
  for (var q = 0 ; q < num_queries ; q++){
    queries.push({
      collection : 'users',
      params : {},
      options : {skip:(q*max_users_chunk), limit:max_users_chunk}
    });
  }
  return queries;
};

var get_total_num_users = function(db_client, cb){
  db_client.collection('users', function(e, users){
    users.count(function(e, count){
      return cb(e, count);
    });
  });
};

module.exports = function(db_client, do_query, cb){
  
  get_total_num_users(db_client, function(e, num_users){
    var users = [];
    var queries = get_queries(num_users, db_conf.max_users_chunk);
    var completed = 0;
    var _cb  = function(e, data){
      completed += 1;  
      users = users.concat(data);
      if (completed === queries.length){
        return cb(e, users);
      }
    };
    queries.forEach(function(q){
      do_query(db_client, q, _cb);    
    });
  });
};
