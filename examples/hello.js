module.exports = function(rivet) {
  rivet.desc('say hello')
  rivet.task('hello', function() {
    console.log('Hello!');
  });
  
  // $ rivet hello-name --name Dave
  rivet.desc('say hello to someone')
  rivet.task('hello-name', function() {
    console.log('Hello ' + this.argv.name + '!');
  });
  
  rivet.alias('default', 'hello');
}
