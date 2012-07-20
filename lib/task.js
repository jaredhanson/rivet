/**
 * `Task` constructor.
 *
 * @param {String} name
 * @param {Array} prereqs
 * @api private
 */
function Task(name, prereqs) {
  this.name = name;
  this._prereqs = prereqs;
  this._fns = [];
  this._execd = false;
};

Task.prototype.push = function(fn) {
  // TODO: Allow array of fns to be added here and in the .task() declaration
  if (!fn) { return; }
  this._fns.push(fn)
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
 * @api private
 */
Task.prototype.exec = function(rivet, cb) {
  if (this._execd) { return cb(); }
  this._execd = true;
  
  var self = this;
  
  // wrap `cb` for logging
  console.log('[rivet] begin task: ' + self.name);
  function done(err) {
    console.log('[rivet] end task: ' + self.name)
    cb && cb(err);
  }
  
  // exec task functions
  function exec() {
    var stack = self._fns;
    (function pass(i, err) {
      if (err) { return done(err); }
    
      var layer = stack[i];
      if (!layer) { return done(); } // done
    
      try {
        var arity = layer.length;
        if (arity == 0) { // sync
          layer();
          pass(i + 1);
        } else { // async
          layer(function(e) { pass(i + 1, e); } );
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
