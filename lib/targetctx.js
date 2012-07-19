function TargetCtx(rivet, name) {
  this._rivet = rivet;
  this._name = name;
};

TargetCtx.prototype.step = function(fn) {
  this._rivet.task(this._name, fn);
};


module.exports = TargetCtx;
