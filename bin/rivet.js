#!/usr/bin/env node

var rivet = require('../')
  , path = require('path')
  , optimist = require('optimist')
  , argv = optimist
    .usage('$0 [-f file] {options} targets')
    .alias('f', 'file').default('f', 'rivet.js').describe('f', 'file containing tasks to load')
    .alias('T', 'tasks').default('T', false).describe('T', 'display tasks')
    .alias('n', 'dry-run').default('n', false).describe('n', 'do a dry run without executing tasks')
    .alias('t', 'trace').default('t', false).describe('t', 'turn on execute tracing')
    .alias('h', 'help')
    .argv

if (argv.help) {
  optimist.showHelp();
} else if (argv.tasks) {
  var file = rivet.utils.findupSync(process.cwd(), argv.file);
  if (!file) { return console.error('No "rivet.js" file found'); }
  process.chdir(path.dirname(file));
  rivet.cli.tasks(file, argv);
} else {
  var file = rivet.utils.findupSync(process.cwd(), argv.file);
  if (!file) { return console.error('No "rivet.js" file found'); }
  process.chdir(path.dirname(file));
  rivet.cli.exec(file, argv._.length ? argv._ : [ 'default' ], argv);
}
