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
module.exports = function exec(file, tasks) {
  require(path.resolve(process.cwd(), file))(rivet);
  rivet.run(tasks, function(err) {
    // TODO: Write short error message to console.
    if (err) { throw err; }
  });
}
