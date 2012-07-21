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
        console.log('Hello! (in a little while)');
        done();
      }, 1000);
    });
    
#### Prerequisites (and The Scratch!)

In many cases, a task often requires that another task execute first.  These
are known as perquisites.  Rivet ensures that all prerequisites have been
executed prior to any task that requires them.

    rivet.task('hello', 'lookup_name', function() {
      console.log('Hello ' + this.scratch.name + '!');
    });
    
    rivet.task('lookup_name', function() {
      this.scratch.name = 'Dave';
    });

Also demonstrated here is what's known as the "scratch".  This is a shared
area that any task can write to or read from, making it convenient to pass data
between tasks.

#### Namespaces

Tasks can be grouped into namespaces, making it easy to organize related tasks
and limit there scope in larger projects.

    rivet.namespace('formal', function() {
      rivet.task('hello', function() {
        console.log('Hello, sir!');
      });

      rivet.task('greet', 'hello', function() {
        console.log('How may I be of assistance?');
      });
    });
    
Dependencies resolve within the current namespace.  Relative namespaces can be
used to refer to parent namespaces if necessary.

    rivet.namespace('informal', function() {
      rivet.task('greet', '^:hello', function() {
        console.log('What can I help you with?');
      });
    });

The use of a caret (^) is used to refer to a parent namespace.  These can be
strung together as needed.  For example, `^:^:hello` would reference the `hello`
task in the grandparent namespace.

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
