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
 * Declare task `name` to execute `fn`, with optional `prereqs`.
 *
 * @param {String} name
 * @param {Array|String} prereqs
 * @param {Function} fn
 * @api public
 */
Rivet.prototype.task = function(name, prereqs, fn) {
  if (typeof prereqs == 'function') {
    fn = prereqs;
    prereqs = [];
  }
  if (typeof prereqs == 'string') {
    prereqs = prereqs.split(' ');
  }
  
  // TODO: allow array of functions to be specified
  
  var ns = this._ns[this._ns.length - 1]
    , qname = ns.qname(name)
    , qprereqs = prereqs.map(function(n) { return Namespace.resolve(ns.qname(), n); });
  
  debug('declared task: %s', qname);
  for (var i = 0, len = qprereqs.length; i < len; i++) {
    debug('  prereq: %s', qprereqs[i])
  }
  
  var t = (this._tasks[qname] = this._tasks[qname] || new Task(qname));
  t.prereqs(qprereqs)
  t.fn(fn);
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
 * A target is a task with a set of sequential steps.  When the task is executed,
 * these steps are invoked sequentially, one after the other.
 *
 * Declaring targets and steps is syntactic sugar.  It is equivalent to to
 * declaring the same task multiple times with different functions; each
 * function is additive, and will be invoked in the order declared.
 *
 * @param {String} name
 * @param {Array|String} prereqs
 * @param {Function} fn
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

/**
 * Alias `tasks` to `name`.
 *
 * An alias is a convenient way to assign a name to a task or set of tasks.
 *
 * Declaring an alias is syntactic sugar.  It is equivalent to declaring a task
 * with prerequisites.
 *
 * @param {String} name
 * @param {Array|String} tasks
 * @api public
 */
Rivet.prototype.alias = function(name, tasks) {
  this.task(name, tasks);
}


Rivet.prototype.run = function(tasks, cb) {
  cb = cb || function() {};
  
  this._queue = tasks;
  
  var self = this;
  (function pass(i, err) {
    if (err) { return cb(err); }
    
    var name = self._queue[i];
    if (!name) { return cb(); } // done
    
    var task = self._tasks[name]
    if (!task) { return cb(new Error('No task named "' + name + '"')); }
    
    // Execute the task.  During execution, a task may enqueue additional tasks
    // to be executed.  However, these only enqueued *after* the current task,
    // ensuring that the `i` iterator is not invalidated.
    task.exec(self, function(e) {
      pass(i + 1, e);
    });
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
