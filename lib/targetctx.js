/**
 * `TargetCtx` constructor.
 *
 * Blocks passed to `rivet.target()` will be invoked within a context
 * established by this class.  The context binds the target `name` and `rivet`
 * instance, and exposes a `step` function.  Internally, a single task is
 * defined with a sequence of functions, as provided to `step`.
 *
 * @api private
 */
function TargetCtx(rivet, name) {
  this._rivet = rivet;
  this._name = name;
};

/**
 * Create a step to be invoked when target is executed.
 *
 * @param {Function} fn
 * @api public
 */
TargetCtx.prototype.step = function(fn) {
  this._rivet.task(this._name, fn);
};


module.exports = TargetCtx;
