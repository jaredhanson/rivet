# Rivet

Rivet is a task-based build tool, scripted in JavaScript and executed using
[Node.js](http://nodejs.org/).  Similar to [make](http://www.gnu.org/software/make/)
or [rake](http://rake.rubyforge.org/), it can be used in any scenario that can
be broken into tasks, from building native and web applications to automating
deployment procedures.  

## Installation

    $ npm install -g rivet

## Usage

From the command line, simply use rivet to execute a task.

    $ rivet hello
    
Tasks are declared in a rivet file, by default named "rivet.js".

#### Declaring a Task

Tasks are declared using `rivet.task()`, and given a name, optional
prerequisites, and a function to execute.

    module.exports = function(rivet) {
      rivet.desc('say hello')
      rivet.task('hello', function() {
        console.log('Hello!');
      });
    }

All rivet files export a function using standard `module.exports` boilerplate.
For brevity, this is omitted from further examples.

Asynchronous tasks are as easy as accepting a `done` callback and invoking it
when the task completes.

    rivet.task('hello', function(done) {
      setTimeout(function() {
        console.log('How are you?');
        done();
      }, 1000);
    });

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/jaredhanson/rivet.png)](http://travis-ci.org/jaredhanson/rivet)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

(The MIT License)

Copyright (c) 2012 Jared Hanson

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
