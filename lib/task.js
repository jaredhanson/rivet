function Task(name, prereqs) {
  this.name = name;
  this.prereqs = prereqs;
  this._fns = [];
};

Task.prototype.push = function(fn) {
  // TODO: Allow array of fns to be added here and in the .task() declaration
  if (!fn) { return; }
  this._fns.push(fn)
};

Task.prototype.exec = function(cb) {
  cb = cb || function() {};
  
  var stack = this._fns;
  (function pass(i, err) {
    if (err) { return cb(err); }
    
    var layer = stack[i];
    if (!layer) { return cb(); }
    
    try {
      var arity = layer.length;
      if (arity == 0) { // sync
        var rv = layer();
        pass(i + 1);
      } else { // async
        layer(function(e) { pass(i + 1, e); } );
      }
    } catch(e) {
      return cb(e);
    }
  })(0);
}


module.exports = Task;
