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
are known as prerequisites.  Rivet ensures that all prerequisites have been
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
    
Prerequisites resolve within the current namespace.  Relative namespaces can be
used to refer to parent namespaces if necessary.

    rivet.namespace('informal', function() {
      rivet.task('greet', '^:hello', function() {
        console.log('What can I help you with?');
      });
    });

The use of a caret (^) is used to refer to a parent namespace.  These can be
strung together as needed.  For example, `^:^:hello` would reference the `hello`
task in the grandparent namespace.

#### Multi-Step Tasks

A single task can be declared multiple times.  In this case, each function is
additive.  When the task is executed, each step will be invoked in sequence.

    rivet.task('archive', function(done) {
      copy(['app.js', 'utils.js'], 'output', done);
    })
    
    rivet.task('archive', function(done) {
      zip('output', 'output.zip', done);
    })

Rivet provides syntactic sugar in the form of "targets" and "steps", which lets
this be expressed in a form that is more clear.

    rivet.target('archive', function() {
      this.step(function(done) {
        copy(['app.js', 'utils.js'], 'output', done);
      })
      this.step(function(done) {
        zip('output', 'output.zip', done);
      })
    });

This is an effective way to break up a set of asynchronous operations, writing
them as if they were sequential commands.

## FAQ

##### How is Rivet different from Jake?

Rivet is conceptually the same as [Jake](https://github.com/mde/jake/).  I was
using Jake for this purpose, but ultimately found it lacking for the following
reasons:

1. Jake treats asynchronous tasks as second-class, requiring extra options to
   enable them.  This works against the Node.js grain.
2. Tasks are not "additive", in that they can't be redeclared.  I found that
   this tended to result in unnecessary verbosity and nested callbacks.
3. Prerequisites don't resolve within the containing namespace.  This limited
   the effectiveness of using namespaces and resulted in parent namespaces being
   peppered throughout separate files.

All of these things could (and should, IMO) be fixed in Jake.  However, after
attempting to do that, I concluded that it would be simpler to start from a
fresh codebase where other simplifying assumptions could be made.

##### How is Rivet different from Grunt?

[Grunt](https://github.com/cowboy/grunt) does away with prerequisites and
centralizes configuration while tying that configuration to the type of task.
While this approach certainly works, it doesn't suit my own personal tastes.

I prefer to decouple the implementation of tasks from their configuration.
By embracing the functional aspects of JavaScript, and setup functions
popularized by [Connect](http://www.senchalabs.org/connect/) and [Express](http://expressjs.com/)
middleware, it is easy to write succinct tasks with declarative, inline
configuration.  For example:

    function zip(dir, zipfile) {
      return function(done) {
        var command = 'zip -r ' + zipfile + ' ' + dir;
        exec(command, done)
      }
    }
   
    task('zip_app', zip('app', 'app.zip'));
    task('zip_plugins, zip('plugins', 'plugins.zip'));

While completely subjective, I find this much more aesthetically pleasing.  This
syntax also makes it easy to retain prerequisites, which are too useful to be
unsupported by a build tool.

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
