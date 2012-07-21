/**
 * `TaskCtx` constructor.
 *
 * Task functions will be invoked within a context established by this class.
 * The context binds the task to the `rivet` instance, and exposes a shared
 * `scratch`.
 *
 * @api private
 */
function TaskCtx(rivet) {
  this.scratch = rivet.scratch;
  this._rivet = rivet;
};

// TODO: Implement insert (next) function
// TODO: Implement append (last) function


/**
 * Expose `TaskCtx`.
 */
module.exports = TaskCtx;
