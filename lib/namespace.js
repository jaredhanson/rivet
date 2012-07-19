/**
 * `Namespace` constructor.
 *
 * @api private
 */
function Namespace(name, parent) {
  this.name = name || '';
  this.parent = parent || null;
};

/**
 * Fully qualified name.
 *
 * @param {String} name
 * @return {String}
 * @api protected
 */
Namespace.prototype.qname = function(name) {
  var qual = name;
  var ns = this;
  while (ns) {
    qual = (ns.name.length) ? (ns.name + ':' + qual) : (qual);
    ns = ns.parent;
  }
  return qual;
}


/**
 * Expose `Namespace`.
 */
exports = module.exports = Namespace;
