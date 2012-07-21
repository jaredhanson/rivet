/**
 * Module dependencies.
 */
var TaskCtx = require('./taskctx');


/**
 * `Task` constructor.
 *
 * @param {String} name
 * @param {Array} prereqs
 * @api private
 */
function Task(name, desc) {
  this.name = name;
  this.desc = desc;
  this._prereqs = [];
  this._fns = [];
  this._execd = false;
};

/**
 * Assign additional prerequisites to task.
 *
 * @param {String|Array} name
 * @api protected
 */
Task.prototype.prereqs = function(preq) {
  if (!preq) { return; }
  if (Array.isArray(preq)) {
    this._prereqs = this._prereqs.concat(preq);
  } else {
    this._prereqs.push(preq);
  }
};

/**
 * Assign additional functions to task.
 *
 * @param {String|Array} name
 * @api protected
 */
Task.prototype.fn = function(fn) {
  if (!fn) { return; }
  if (Array.isArray(fn)) {
    this._fns = this._fns.concat(fn);
  } else {
    this._fns.push(fn);
  }
};

/**
 * Execute task.
 *
 * All functions assigned to the task are executed sequentially.  If any
 * prerequisite tasks exist, those will be executed first, before execution
 * returns to this task.
 *
 * During a single Rivet run, a task is only ever executed once.  Any attempt
 * to execute a task a second (or third, fourth, etc) time, will immediately
 * return without executing.
 *
 * @param {Rivet} rivet
 * @param {Function} cb
 * @api protected
 */
Task.prototype.exec = function(rivet, cb) {
  if (this._execd) { return cb(); }
  this._execd = true;
  
  var self = this;
  
  // wrap `cb` for logging
  if (rivet.argv.trace) { console.log('[rivet] begin task: ' + self.name); }
  function done(err) {
    if (rivet.argv.trace) { console.log('[rivet] end task: ' + self.name); }
    cb && cb(err);
  }
  
  // exec task functions
  function exec() {
    if (rivet.argv['dry-run']) { return done(); }
    
    var stack = self._fns;
    (function pass(i, err) {
      if (err) { return done(err); }
    
      var layer = stack[i];
      if (!layer) { return done(); } // done
    
      try {
        var ctx = new TaskCtx(rivet, self.name);
        var arity = layer.length;
        if (arity == 0) { // sync
          layer.call(ctx)
          pass(i + 1);
        } else { // async
          layer.call(ctx, function(e) { pass(i + 1, e); } );
        }
      } catch(e) {
        return done(e);
      }
    })(0);
  }
  
  // exec task prereqs
  (function prereqs() {
    var queue = self._prereqs;
    (function pass(i, err) {
      if (err) { return done(err); }
    
      var name = queue[i];
      if (!name) { return exec(); } // prereqs done, exec functions
      
      var task = rivet._tasks[name];
      if (!task) { return done(new Error('No task named "' + name + '"')); }
    
      task.exec(rivet, function(e) {
        pass(i + 1, e);
      });
    })(0);
  })();
}


/**
 * Expose `Task`.
 */
module.exports = Task;
