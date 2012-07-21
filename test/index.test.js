var rivet = require('../lib/index')
  , should = require('should')

describe('rivet', function() {
  
  describe('module', function() {
    it('should export default singleton', function() {
      rivet.should.be.an.instanceOf(rivet.Rivet);
    })
    it('should export version', function() {
      rivet.version.should.be.a.string;
    })
  })
  
  describe('with task', function() {
    var r = new rivet.Rivet();
    r.task('foo', function() {
      this.scratch['foo'] = (this.scratch['foo'] ? 'err' : 'ok');
    });
    
    before(function(done) {
      r.run('foo', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke task function', function() {
        r.scratch.foo.should.equal('ok');
      })
    })
  })
  
  describe('with task declared multiple times', function() {
    var r = new rivet.Rivet();
    r.task('foo', function() {
      this.scratch['foo'] = (this.scratch['foo'] ? 'err' : 'ok');
    });
    r.task('foo', function() {
      this.scratch['foo'] = (this.scratch['foo'] != 'ok' ? 'err' : 'ok-ok');
    });
    
    before(function(done) {
      r.run('foo', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke both task functions with shared scratch', function() {
        r.scratch.foo.should.equal('ok-ok');
      })
    })
  })
  
  describe('with task that has a dependency', function() {
    var r = new rivet.Rivet();
    r.task('f', function() {
      this.scratch['test'] = 'f';
    });
    r.task('foo', 'f', function() {
      this.scratch['test'] = this.scratch['test'] + '-foo';
    });
    
    before(function(done) {
      r.run('foo', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke dependency followed by task', function() {
        r.scratch.test.should.equal('f-foo');
      })
    })
  })
  
  describe('with task that has multiple dependencies declared with a string', function() {
    var r = new rivet.Rivet();
    r.task('f', function() {
      this.scratch['test'] = 'f';
    });
    r.task('o', function() {
      this.scratch['test'] = this.scratch['test'] + '-o';
    });
    r.task('foo', 'f o', function() {
      this.scratch['test'] = this.scratch['test'] + '-foo';
    });
    
    before(function(done) {
      r.run('foo', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke dependencies followed by task', function() {
        r.scratch.test.should.equal('f-o-foo');
      })
    })
  })
  
  describe('with task that has multiple dependencies declared with an array', function() {
    var r = new rivet.Rivet();
    r.task('b', function() {
      this.scratch['test'] = 'b';
    });
    r.task('a', function() {
      this.scratch['test'] = this.scratch['test'] + '-a';
    });
    r.task('bar', ['b', 'a'], function() {
      this.scratch['test'] = this.scratch['test'] + '-bar';
    });
    
    before(function(done) {
      r.run('bar', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke dependencies followed by task', function() {
        r.scratch.test.should.equal('b-a-bar');
      })
    })
  })
  
  describe('with task that has multiple dependencies declared multiple times', function() {
    var r = new rivet.Rivet();
    r.task('b', function() {
      this.scratch['test'] = 'b';
    });
    r.task('a', function() {
      this.scratch['test'] = this.scratch['test'] + '-a';
    });
    r.task('bar', ['b', 'a'], function() {
      this.scratch['test'] = this.scratch['test'] + '-bar';
    });
    r.task('bar', ['b', 'a'], function() {
      this.scratch['test'] = this.scratch['test'] + '-bar2';
    });
    
    before(function(done) {
      r.run('bar', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke dependencies once followed by both task functions', function() {
        r.scratch.test.should.equal('b-a-bar-bar2');
      })
    })
  })
  
  describe('with task in namespace with dependency on task in same namespace', function() {
    var r = new rivet.Rivet();
    r.task('foo', function() {
      this.scratch['test'] = 'no-foo';
    });
    
    r.namespace('baz', function() {
      r.task('foo', function() {
        this.scratch['test'] = 'foo';
      });
      r.task('bar', 'foo', function() {
        this.scratch['test'] = this.scratch['test'] + '-bar';
      });
    })
    
    before(function(done) {
      r.run('baz:bar', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke dependency in same namespace', function() {
        r.scratch.test.should.equal('foo-bar');
      })
    })
  })
  
  describe('with task in namespace with dependency on task in parent namespace', function() {
    var r = new rivet.Rivet();
    r.task('foo', function() {
      this.scratch['test'] = 'parent-foo';
    });
    
    r.namespace('baz', function() {
      r.task('foo', function() {
        this.scratch['test'] = 'no-foo';
      });
      r.task('bar', '^:foo', function() {
        this.scratch['test'] = this.scratch['test'] + '-bar';
      });
    })
    
    before(function(done) {
      r.run('baz:bar', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke dependency in parent namespace', function() {
        r.scratch.test.should.equal('parent-foo-bar');
      })
    })
  })
  
  describe('with task in namespace with dependency on task in parent namespace declared absolutely', function() {
    var r = new rivet.Rivet();
    r.task('foo', function() {
      this.scratch['test'] = 'parent-foo';
    });
    
    r.namespace('baz', function() {
      r.task('foo', function() {
        this.scratch['test'] = 'no-foo';
      });
      r.task('bar', ':foo', function() {
        this.scratch['test'] = this.scratch['test'] + '-bar';
      });
    })
    
    before(function(done) {
      r.run('baz:bar', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke dependency in parent namespace', function() {
        r.scratch.test.should.equal('parent-foo-bar');
      })
    })
  })
  
  describe('with task in namespace with dependency on task in grand-parent namespace', function() {
    var r = new rivet.Rivet();
    r.task('foo', function() {
      this.scratch['test'] = 'grand-parent-foo';
    });
    
    r.namespace('bax', function() {
      r.task('foo', function() {
        this.scratch['test'] = 'parent-foo';
      });
      
      r.namespace('baz', function() {
        r.task('foo', function() {
          this.scratch['test'] = 'no-foo';
        });
        r.task('bar', '^:^:foo', function() {
          this.scratch['test'] = this.scratch['test'] + '-bar';
        });
      })
    })
    
    before(function(done) {
      r.run('bax:baz:bar', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke dependency in grand-parent namespace', function() {
        r.scratch.test.should.equal('grand-parent-foo-bar');
      })
    })
  })
  
  describe('with task in namespace with dependency on task in grand-parent namespace declared absolutely', function() {
    var r = new rivet.Rivet();
    r.task('foo', function() {
      this.scratch['test'] = 'grand-parent-foo';
    });
    
    r.namespace('bax', function() {
      r.task('foo', function() {
        this.scratch['test'] = 'parent-foo';
      });
      
      r.namespace('baz', function() {
        r.task('foo', function() {
          this.scratch['test'] = 'no-foo';
        });
        r.task('bar', ':foo', function() {
          this.scratch['test'] = this.scratch['test'] + '-bar';
        });
      })
    })
    
    before(function(done) {
      r.run('bax:baz:bar', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke dependency in grand-parent namespace', function() {
        r.scratch.test.should.equal('grand-parent-foo-bar');
      })
    })
  })
  
  describe('with task in namespace with dependency on task in parent namespace', function() {
    var r = new rivet.Rivet();
    r.task('foo', function() {
      this.scratch['test'] = 'grand-parent-foo';
    });
    
    r.namespace('bax', function() {
      r.task('foo', function() {
        this.scratch['test'] = 'parent-foo';
      });
      
      r.namespace('baz', function() {
        r.task('foo', function() {
          this.scratch['test'] = 'no-foo';
        });
        r.task('bar', '^:foo', function() {
          this.scratch['test'] = this.scratch['test'] + '-bar';
        });
      })
    })
    
    before(function(done) {
      r.run('bax:baz:bar', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke dependency in grand-parent namespace', function() {
        r.scratch.test.should.equal('parent-foo-bar');
      })
    })
  })
  
  describe('with task in namespace with dependency on task in parent namespace declared absolutely', function() {
    var r = new rivet.Rivet();
    r.task('foo', function() {
      this.scratch['test'] = 'grand-parent-foo';
    });
    
    r.namespace('bax', function() {
      r.task('foo', function() {
        this.scratch['test'] = 'parent-foo';
      });
      
      r.namespace('baz', function() {
        r.task('foo', function() {
          this.scratch['test'] = 'no-foo';
        });
        r.task('bar', ':bax:foo', function() {
          this.scratch['test'] = this.scratch['test'] + '-bar';
        });
      })
    })
    
    before(function(done) {
      r.run('bax:baz:bar', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke dependency in grand-parent namespace', function() {
        r.scratch.test.should.equal('parent-foo-bar');
      })
    })
  })
  
  // TODO: Implement test cases for running multiple tasks
  
  describe('running a task that does not exist', function() {
    var err = null;
    var r = new rivet.Rivet();
    r.task('foo', function() {
      this.scratch['test'] = 'foo';
    });
    
    before(function(done) {
      r.run('xfoo', function(e) {
        //if (err) return done(err);
        err = e;
        return done();
      });
    })
    
    describe('result', function() {
      it('should callback with error', function() {
        err.should.be.an.instanceOf(Error);
        err.message.should.be.equal('No task named "xfoo"');
      })
    })
  })
  
  describe('running a task with dependency that does not exist', function() {
    var err = null;
    var r = new rivet.Rivet();
    r.task('foo', 'xbar', function() {
      this.scratch['test'] = 'foo';
    });
    
    before(function(done) {
      r.run('foo', function(e) {
        //if (err) return done(err);
        err = e;
        return done();
      });
    })
    
    describe('result', function() {
      it('should callback with error', function() {
        err.should.be.an.instanceOf(Error);
        err.message.should.be.equal('No task named "xbar"');
      })
    })
  })
  
})
