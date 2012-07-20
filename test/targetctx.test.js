var TargetCtx = require('../lib/targetctx')
  , should = require('should')

describe('TargetCtx', function() {
  // mocks
  var rivet = new Object();
  rivet.task = function(name, fn) {
    this.tasks = this.tasks || {};
    this.tasks[name] = fn;
  }
  
  describe('.step', function() {
    var ctx = new TargetCtx(rivet, 'foo');
    
    function action() {}; 
    ctx.step(action);
    
    it('should add task to rivet', function() {
      should.exist(rivet.tasks['foo']);
      rivet.tasks['foo'].should.equal(action);
    })
  })
})
