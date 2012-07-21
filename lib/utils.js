/**
 * Module dependencies.
 */
var path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // < 0.8 compat


/**
 * Find file named `name` starting in `dir`, searching parent directories until
 * found.
 *
 * @param {String} path
 * @param {String} name
 * @return {String}
 * @api public
 */
exports.findupSync = function(dir, name) {
  var fpath = path.join(dir, name);
  if (existsSync(fpath)) { return fpath; }
  var pdir = path.resolve(dir, '..');
  return pdir === dir ? null : exports.findupSync(pdir, name);
}
