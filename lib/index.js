/**
 * Module dependencies.
 */
var Task = require('./task')
  , Namespace = require('./namespace')
  , TargetCtx = require('./targetctx')
  , debug = require('debug')('rivet');


/**
 * `Rivet` constructor.
 *
 * @api public
 */
function Rivet() {
  this._tasks = {};
  this._ns = [];
  this._ns.push(new Namespace());
};

/**
 * Declare task `name` to execute `fn`.
 *
 * @param {String} name
 * @param {Function} fn
 * @return {Rivet} for chaining
 * @api public
 */
Rivet.prototype.task = function(name, prereqs, fn) {
  if (typeof prereqs == 'function') {
    fn = prereqs;
    prereqs = [];
  }
  
  // TODO: qualify and resolve prereqs
  
  var ns = this._ns[this._ns.length - 1]
    , qname = ns.qname(name)
  
  debug('declared task: %s', qname);
  var t = (this._tasks[name] = this._tasks[name] || new Task());
  t.push(fn);
  return this;
};

/**
 * Create namespace in which to organize tasks.
 *
 * @param {String} name
 * @param {Function} block
 * @api public
 */
Rivet.prototype.namespace = function(name, block) {
  var ns = this._ns[this._ns.length - 1];
  this._ns.push(new Namespace(name, ns));
  block && block.call(this);
  this._ns.pop();
}

/**
 * Declare target `name` with defining `block`.
 *
 * A target is a task, in which a set of sequential steps are defined.  When the
 * task is executed, these steps are invoked sequentially, one after the other.
 *
 * Declaring targets and steps is syntactic sugar.  It is equivalent to to
 * declaring a task multiple times with different functions; each function is
 * additive, all of them will be invoked in the order declared.
 *
 * @param {String} name
 * @param {Function} fn
 * @return {Rivet} for chaining
 * @api public
 */
Rivet.prototype.target = function(name, prereqs, block) {
  if (typeof prereqs == 'function') {
    block = prereqs;
    prereqs = [];
  }
  
  // declare task, empty set of functions
  this.task(name, prereqs);
  // apply block, within target context
  var ctx = new TargetCtx(this, name);
  block.apply(ctx);
}

Rivet.prototype.alias = function(name, tasks) {
  this.task(name, tasks);
}


Rivet.prototype.run = function(tasks, cb) {
  cb = cb || function() {};
  
  var self = this;
  
  // TODO: build a queue based on prereqs
  this._queue = [];
  this._queue = this._queue.concat(tasks);
  
  debug('initial task queue:');
  for (var i = 0, len = this._queue.length; i < len; i++) {
    debug('  %s: %s', i, this._queue[i])
  }
  
  (function pass(i, err) {
    if (err) { return cb(err); }
    
    var name = self._queue[i];
    if (!name) { return cb(); }
    
    var task = self._tasks[name]
    if (!task) { return cb(new Error('No task named "' + name + '"')); }
    
    task.exec(function(e) { pass(i + 1, e); });
  })(0);
}


/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports = new Rivet();

/**
 * Framework version.
 */
require('pkginfo')(module, 'version');

/**
 * Expose CLI.
 *
 * @api private
 */
exports.cli = require('./cli');
