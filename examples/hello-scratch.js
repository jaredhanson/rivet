module.exports = function(rivet) {
  rivet.desc('say hello')
  rivet.task('hello', 'lookup_name', function() {
    console.log('Hello ' + this.scratch.name + '!');
  });
  
  // Tasks share a "scratch" area, useful for passing information
  // between tasks.
  rivet.task('lookup_name', function() {
    this.scratch.name = 'Dave';
  });
  
  rivet.alias('default', 'hello');
}
