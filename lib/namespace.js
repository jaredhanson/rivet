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
 * Examples:
 *
 *    ns.qname();
 *    // => "net:http"
 *
 *    ns.qname('www');
 *    // => "net:http:www"
 *
 * @param {String} name
 * @return {String}
 * @api protected
 */
Namespace.prototype.qname = function(name) {
  var qual = name;
  var ns = this;
  while (ns) {
    qual = (ns.name.length) ? (ns.name + (qual ? ':' + qual : '')) : (qual);
    ns = ns.parent;
  }
  return qual || '';
}


/**
 * Expose `Namespace`.
 */
exports = module.exports = Namespace;

exports.resolve = function(from, to) {
  var comps = to.split(':');
  if (to[0] != ':') {
    // `to` is relative to from (iow, `to` is not absolute)
    comps = (from.length ? from.split(':') : []).concat(comps);
  }
  
  // filter out empty components
  comps = comps.filter(function(c) { return c.length != 0 });
  
  // reduce "up-namespace"'d components out, accumulating into `res`
  var res = []
    , ic = 0; // ignore count
  comps.reduceRight(function(prev, cur) {
    if (prev == '^') {
      ic++;
    } else if (cur != '^') {
      ic = ic ? ic - 1 : 0;
      if (!ic) { res.unshift(cur); }
    }
    return cur;
  }, null);
  
  return res.join(':');
}
