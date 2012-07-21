#!/usr/bin/env node

var rivet = require('../')
  , optimist = require('optimist')
  , argv = optimist
    .usage('$0 [-f file] {options} targets')
    .alias('f', 'file').default('f', 'rivet.js').describe('f', 'file containing tasks to load')
    .alias('n', 'dry-run').default('n', false).describe('n', 'do a dry run without executing tasks')
    .alias('t', 'trace').default('t', false).describe('t', 'turn on execute tracing')
    .alias('h', 'help')
    .argv

if (argv.help) {
  optimist.showHelp();
} else {
  rivet.cli.exec(argv.file, argv._.length ? argv._ : [ 'default' ], argv);
}
