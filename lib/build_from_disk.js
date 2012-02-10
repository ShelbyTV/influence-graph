var fs = require('fs');

/*
 * Build graph from Dist (not mongodb)
 */

module.exports = function(loc, cb){
  fs.readFile(loc, 'utf8', function(e, data){
    var graph;
    try {
      graph = JSON.parse(data); 
    } catch (e) {
      return cb(e);
    }
    return cb(e, graph);
  });
};
