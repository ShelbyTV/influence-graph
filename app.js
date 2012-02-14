/*
 * Arguments
 */

/*
 * Server dependencies
 */

var express = require('express')
  , routes = require('./routes')
  , server_conf = require('./conf/server.js')
  , db_conf = require('./conf/db.js')
  , graph_conf = require('./conf/graph.js');

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
 * Routes
 */

app.get('/query', routes.query);
app.get('/topics', routes.topics);
app.get('/rebuild', routes.rebuild);

app.listen(server_conf.port);
console.log("Influencer graph listening on port %d in %s mode", app.address().port, app.settings.env);
