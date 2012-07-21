module.exports = function(rivet) {
  rivet.desc('say hello')
  rivet.target('hello', function() {
    this.step(function(done) {
      setTimeout(function() {
        console.log('Hello!');
        done();
      }, 1000);
    })
    this.step(function() {
      console.log('How are you?')
    })
  });
  
  rivet.alias('default', 'hello');
}
