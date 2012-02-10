/*
 * Arguments
 */

var USERS = process.argv[2];
var DISK;

if (!USERS){
  console.error('Specify graph size in users');
  process.exit();
}

if (USERS==='-d'){
  DISK = true; 
}

/*
 * Server dependencies
 */

var express = require('express')
  , routes = require('./routes')
  , server_conf = require('./conf/server.js')
  , db_conf = require('./conf/db.js')
  , graph_conf = require('./conf/graph.js')
  , mongoat = require('mongoat')(db_conf.db_name, db_conf.host, db_conf.port)
  , build = require('./lib/build.js')
  , build_from_disk = require('./lib/build_from_disk.js');

var app = module.exports = express.createServer();

/*
 * Configuration
 */

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

/*
 * Initialization
 */

mongoat.db.open(function(e, db_client){
  
  var build_callback = function(e, graph){

    if (e){
      console.error('BUILD FAIL:', e)
      process.exit();
    }

    var resources = {
      graph : graph,
      do_query : mongoat.do_query,
      db_client : db_client
    };

    /*
     * Routes
     */
    app.get('/query', function(req, res){
      routes.query(resources, req, res);
    });

    app.get('/rebuild', function(req, res){
      routes.rebuild(resources, req, res, function(e, _graph){
        resources.graph = _graph;
        res.end(JSON.stringify({e:e, data:Object.keys(resources.graph.topics).length}));
      });
    });

    app.get('/persist', function(req, res){
      routes.persist(resources, req, res);
    });

    app.listen(server_conf.port);
    console.log("Graph with "+Object.keys(resources.graph.topics).length+" topic nodes and "+Object.keys(resources.graph.influencers).length+" influencers listening on port %d in %s mode", app.address().port, app.settings.env);
  };

  if (DISK){
    build_from_disk(graph_conf.persist_loc, build_callback);
  } else {
    build(db_client, USERS, mongoat.do_query, build_callback);
  }

});
