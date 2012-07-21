#!/usr/bin/env node

var rivet = require('../')
  , optimist = require('optimist')
  , argv = optimist
    .usage('$0 [-f file] {options} targets')
    .alias('f', 'file').default('f', 'rivet.js').describe('f', 'file containing tasks to load')
    .alias('n', 'dry-run').default('n', false).describe('n', 'do a dry run without executing tasks')
    .alias('q', 'quiet').default('q', false).describe('q', 'do not log messages to standard output')
    .alias('h', 'help')
    .argv

console.log(argv)

if (argv.help) {
  optimist.showHelp();
} else {
  rivet.cli.exec(argv.file, argv._.length ? argv._ : [ 'default' ], argv);
}
