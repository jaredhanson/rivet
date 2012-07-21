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
  require(file)(rivet);
  rivet.run(tasks, options, function(err) {
    if (err) {
      console.error(err.message);
      if (options.trace) { console.error(err.stack); }
    }
  });
}
