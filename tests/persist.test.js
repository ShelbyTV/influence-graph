var db_conf = require('../conf/db.js');
var mongoat = require('mongoat')(db_conf.db_name, db_conf.host, db_conf.port);
var build = require('../lib/build.js');
var build_num_users = 100;
var persist = require('../lib/persist.js');
var build_from_disk = require('../lib/build_from_disk.js');
var graph_conf = require('../conf/graph.js');

var build_cb = function(e, graph){
  persist(graph, graph_conf.persist_loc, function(e, res){
    if (e){
      console.error('persist failed', e);
      process.exit();
    } else {
      build_from_disk(graph_conf.persist_loc, function(e, _graph){
        if (!e && Object.keys(_graph).length===Object.keys(graph).length){
          console.log('PASS: persisted graph is correct');
        } else {
          console.log('FAIL: persisted graph is bad');
        }
        process.exit();
      });
    }
  });
};

mongoat.db.open(function(e, db_client){
  build(db_client, build_num_users, mongoat.do_query, build_cb);
});
