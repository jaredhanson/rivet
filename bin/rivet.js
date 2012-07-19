#!/usr/bin/env node

var program = require('commander')
  , rivet = require('../')

program.version(rivet.version)
  .option('-f, --file [file]', 'load tasks from file (default: `rivet.js`)');

program
  .command('*')
  .description('execute the given tasks')
  .action(function(options, task) {
    // TODO: Figure out a scheme for passing arguments to tasks
    //       This may be easier by switching to optimist.
    //console.dir(arguments)
    //console.dir(arguments[arguments.length - 1].parent)
    
    // slice off the last arguement, as it is the `commander.Command` instance
    // itself
    var tasks = [].slice.call(arguments, 0, arguments.length - 1);
    
    // TODO: exec `default` task, if none specified
    rivet.cli.exec(this.file || 'rivet.js', tasks);
  });

program.parse(process.argv);
