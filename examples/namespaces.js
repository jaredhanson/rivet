module.exports = function(rivet) {
  
  rivet.task('hello', function() {
    console.log('Hello!');
  });
  
  rivet.namespace('formal', function() {
    rivet.task('hello', function() {
      console.log('Hello, sir!');
    });
    
    // dependency is on this namespace's `hello` task.
    rivet.task('greet', 'hello', function() {
      console.log('How may I be of assistance?');
    });
  });
  
  rivet.namespace('informal', function() {
    // dependency is on parent namespace's `hello` task
    // as indicated by "^" indicator
    rivet.task('greet', '^:hello', function() {
      console.log('How may I be of assistance?');
    });
  });
  
  rivet.alias('default', 'hello');
}
