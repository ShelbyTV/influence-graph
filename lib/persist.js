var fs = require('fs');
/*
 * Persist : the graph to disk
 */

module.exports = function(graph, persist_loc, cb){
  var graph_as_string = JSON.stringify(graph);
  fs.writeFile(persist_loc, graph_as_string, 'utf8', function(e){
    if (!e){
      return cb(e, Object.keys(graph.topics).length);
    } else {
      return cb(e);
    }
  });
};
