/**
 * Module dependencies.
 */
var path = require('path')
  , rivet = require('..')


/**
 * Executes `tasks` in rivet `file`.
 *
 * @param {String} file
 * @param {Array} tasks
 * @api protected
 */
module.exports = function exec(file, tasks, options) {
  // TODO: Search up directories to find file, if necessary.
  
  require(path.resolve(process.cwd(), file))(rivet);
  rivet.run(tasks, options, function(err) {
    // TODO: Write short error message to console.
    if (err) { throw err; }
  });
}
