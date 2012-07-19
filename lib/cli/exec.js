/**
 * Module dependencies.
 */
var path = require('path')
  , rivet = require('..')


module.exports = function exec(file, tasks) {
  require(path.resolve(process.cwd(), file))(rivet);
  rivet.run(tasks, function(err) {
    if (err) { throw err; }
  });
}
