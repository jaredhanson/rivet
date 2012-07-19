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

Task.prototype.exec = function(rivet, done) {
  if (this._execd) { return done(); }
  this._execd = true;
  
  var self = this;
  
  // wrap `done` for logging
  console.log('[rivet] begin task: ' + self.name);
  function cb(err) {
    console.log('[rivet] end task: ' + self.name)
    done && done(err);
  }
  
  // exec task functions
  function exec() {
    var stack = self._fns;
    (function pass(i, err) {
      if (err) { return cb(err); }
    
      var layer = stack[i];
      if (!layer) { return cb(); } // done
    
      try {
        var arity = layer.length;
        if (arity == 0) { // sync
          layer();
          pass(i + 1);
        } else { // async
          layer(function(e) { pass(i + 1, e); } );
        }
      } catch(e) {
        return cb(e);
      }
    })(0);
  }
  
  // exec task prereqs
  (function prereqs() {
    var queue = self._prereqs;
    (function pass(i, err) {
      if (err) { return cb(err); }
    
      var name = queue[i];
      if (!name) { return exec(); } // prereqs done, exec functions
      
      var task = rivet._tasks[name];
      if (!task) { return cb(new Error('No task named "' + name + '"')); }
    
      task.exec(rivet, function(e) {
        pass(i + 1, e);
      });
    })(0);
  })();
}


module.exports = Task;
