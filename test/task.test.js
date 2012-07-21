var Task = require('../lib/task')
  , should = require('should')

describe('Task', function() {
  
  describe('constructor with name', function() {
    var t = new Task('foo');
    
    it('should have correct name', function() {
      t.name.should.equal('foo');
    })
    it('should not have prereqs', function() {
      t._prereqs.should.be.an.instanceOf(Array);
      t._prereqs.should.have.length(0);
    })
    it('should not have functions', function() {
      t._fns.should.be.an.instanceOf(Array);
      t._fns.should.have.length(0);
    })
    it('should not have been executed', function() {
      t._execd.should.be.false;
    })
  })
  
  describe('.prereqs with string argument', function() {
    var t = new Task('foo');
    t.prereqs('x');
    t.prereqs('y');
    
    it('should have prereqs', function() {
      t._prereqs.should.be.an.instanceOf(Array);
      t._prereqs.should.have.length(2);
      t._prereqs[0].should.be.equal('x');
      t._prereqs[1].should.be.equal('y');
    })
  })
  
  describe('.prereqs with array argument', function() {
    var t = new Task('foo');
    t.prereqs(['a', 'b']);
    t.prereqs(['x', 'y']);
    
    it('should have prereqs', function() {
      t._prereqs.should.be.an.instanceOf(Array);
      t._prereqs.should.have.length(4);
      t._prereqs[0].should.be.equal('a');
      t._prereqs[1].should.be.equal('b');
      t._prereqs[2].should.be.equal('x');
      t._prereqs[3].should.be.equal('y');
    })
  })
  
  describe('.fn with function argument', function() {
    var t = new Task('foo');
    function x() {};
    function y() {};
    t.fn(x);
    t.fn(y);
    
    it('should have functions', function() {
      t._fns.should.be.an.instanceOf(Array);
      t._fns.should.have.length(2);
      t._fns[0].should.be.equal(x);
      t._fns[1].should.be.equal(y);
    })
  })
  
  describe('.fn with array argument', function() {
    var t = new Task('foo');
    function a() {};
    function b() {};
    function x() {};
    function y() {};
    t.fn([a, b]);
    t.fn([x, y]);
    
    it('should have functions', function() {
      t._fns.should.be.an.instanceOf(Array);
      t._fns.should.have.length(4);
      t._fns[0].should.be.equal(a);
      t._fns[1].should.be.equal(b);
      t._fns[2].should.be.equal(x);
      t._fns[3].should.be.equal(y);
    })
  })
  
})
