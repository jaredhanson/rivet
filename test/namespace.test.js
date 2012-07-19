var Namespace = require('../lib/namespace')
  , resolve = Namespace.resolve
  , should = require('should')

describe('Namespace', function() {
  
  describe('root namespace', function() {
    var ns = new Namespace();
    
    it('should have empty name', function() {
      ns.name.should.be.equal('');
    })
    it('should not have a parent namespace', function() {
      should.not.exist(ns.parent);
    })
    it('should return correct qname', function() {
      ns.qname().should.be.equal('');
    })
    it('should return correct qname of child task', function() {
      ns.qname('task').should.be.equal('task');
    })
  })
  
  describe('namespace', function() {
    var ns = new Namespace('foo');
    
    it('should have empty name', function() {
      ns.name.should.be.equal('foo');
    })
    it('should not have a parent namespace', function() {
      should.not.exist(ns.parent);
    })
    it('should return correct qname', function() {
      ns.qname().should.be.equal('foo');
    })
    it('should return correct qname of child task', function() {
      ns.qname('task').should.be.equal('foo:task');
    })
  })
  
  describe('child namespace', function() {
    var net = new Namespace('net');
    var ns = new Namespace('http', net);
    
    it('should have empty name', function() {
      ns.name.should.be.equal('http');
    })
    it('should have a parent namespace', function() {
      should.exist(ns.parent);
    })
    it('should return correct qname', function() {
      ns.qname().should.be.equal('net:http');
    })
    it('should return correct qname of child task', function() {
      ns.qname('task').should.be.equal('net:http:task');
    })
  })
  
  describe('resolve', function() {
    it('should resolve against root namespace', function() {
      resolve('', 'foo').should.be.equal('foo');
    })
    it('should resolve against namespace', function() {
      resolve('net', 'foo').should.be.equal('net:foo');
    })
    it('should resolve against two-level namespace', function() {
      resolve('net:http', 'foo').should.be.equal('net:http:foo');
    })
    
    it('should resolve absolute against root namespace', function() {
      resolve('', ':foo').should.be.equal('foo');
    })
    it('should resolve absolute against namespace', function() {
      resolve('net', ':foo').should.be.equal('foo');
    })
    it('should resolve absolute against two-level namespace', function() {
      resolve('net:http', ':foo').should.be.equal('foo');
    })
    
    it('should resolve relative against namespace', function() {
      resolve('net', '^:foo').should.be.equal('foo');
    })
    it('should resolve relative against two-level namespace', function() {
      resolve('net:http', '^:foo').should.be.equal('net:foo');
    })
    it('should resolve two-level relative against two-level namespace', function() {
      resolve('net:http', '^:^:foo').should.be.equal('foo');
    })
    it('should resolve two-level relative against three-level namespace', function() {
      resolve('net:http:www', '^:^:foo').should.be.equal('net:foo');
    })
    
    it('should resolve too many ups against namespace to root', function() {
      resolve('net', '^:^:foo').should.be.equal('foo');
    })
    it('should resolve too many ups against two-level namespace to root', function() {
      resolve('net:http', '^:^:^:foo').should.be.equal('foo');
    })
  })
  
})
