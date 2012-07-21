module.exports = function(rivet) {
  // Tasks are additive.  Declaring the same task twice will cause any
  // functions to execute in sequence.  In the case of async tasks, this
  // sequence proceeds as each function calls `done()`.
  
  rivet.desc('say hello')
  rivet.task('hello', function(done) {
    setTimeout(function() {
      console.log('Hello!');
      done();
    }, 1000);
  });
  
  rivet.task('hello', function(done) {
    setTimeout(function() {
      console.log('How are you?');
      done();
    }, 1000);
  });
  
  rivet.alias('default', 'hello');
}
