import { Program, BARRIER, HALT } from 'library';
import request from 'request';

const progA = new Program({
  // Optional. A name used for identifying the program. A random ID would be used by default.
  name: 'Program A',
  // Required. The list of instructions has to be pre-determined and can not be changed.
  instructions: [
    function hiddenInstruction() {
      /**
       * This is an example of a hidden instruction.
       * It sits at instruction 0 while the program starts on instruction 1 in this example.
       */
    },
    function firstInstruction() {
      // Anything stored in the heap is shared across the program.
      this.heap.set('message', 'hello world!');
      this.heap.set('title', 'Demo');

      // This is a shorthand for setting multiple values at the same time.
      this.heap.set({
        var1: 1,
        var2: 2
      });
    },
    function secondInstruction() {
      // Any instruction can read from the heap.
      var message = this.heap.get('message');
      var {
        var1,
        var2
      } = this.heap.get(['var1', 'var2']);
      console.log(message, var1, var2);

      // Any instruction can also update the Program Counter to do jumps.
      this.pc.offset(1);
    },
    function skippedInstruction() {
      /**
       * This instruction is skipped by the previous one with the offset.
       */
    },
    function asyncTasks(next) {
      /**
       * This instruction shows how it can contain an async task.
       * When the instruction function takes one argument, the instruction will block the program until the `next` is called.
       * `next` conforms the interface of a Promise callback. It accepts two arguments: (error, result).
       */

      request('http://www.google.com', function (error, response, body) {
        /**
         * Although the callback takes two arguments, you should always try to handle the error if possible.
         * Passing a valid error to the callback will halt the entire program.
         */
        next(error, body);
      });

      /**
       * An async instruction should not return anything.
       * In strict mode, doing so would throw an error.
       */
      return {}; // Don't!
    },
    function returnSomething() {
      /**
       * Instructions may return values.
       * The returned values are written into a special heap location `result`.
       * Even async instructions like the previous one can return value with the `next` callback. But its own return values are discarded.
       */

      // This reads the result passed in by the `next(error, body)` above.
      var googlePageContent = this.heap.get('result');

      return {
        source: 'google',
        html: googlePageContent
      };
    },
    function readReturnedResults() {
      // This reads the object returned by the previous instruction.
      var result = this.heap.get('result');
      console.log(result.source, result.html);

      // Without explicitly returning a value, the previous results are passed on.
      // Same as `return this.heap.get('result');`.
    },
    function readOldResults() {
      // Since the previous instruction doesn't return anything, the old results are passed on.
      var result = this.heap.get('result');
      console.log(result.source, result.html);

      // To clear the results, explicitly return null.
      return null;
    },
    function someParallelTask1() {
      // Notice how this instruction doesn't block the program.
      request('url1', (error, response, body) => {
        this.heap.set('pageBody1');
      });
    },
    function someParallelTask2() {
      // Notice how this instruction doesn't block the program.
      request('url2', (error, response, body) => {
        this.heap.set('pageBody2');
      });
    },
    /**
     * A barrier blocks the program.
     * In this case, it's a conditional barrier that keeps the program blocked until both `pageBody1` and `pageBody2` in the heap have truthy values.
     * In this way, `someParallelTask1` and `someParallelTask2` could be running in parallel.
     */
    BARRIER(['pageBody1', 'pageBody2']),
    function ending() {
      var {
        pageBody1,
        pageBody2
      } = this.heap.get(['pageBody1', 'pageBody2']);
      console.log(pageBody1, pageBody2);
    },
    // It's always a good idea to put a clear ending to your program.
    HALT
  ],
  // Optional. Use this to set the starting PC. Default value is 0.
  startPC: 0,
  // Optional. Turn on strict mode to get more styling errors to help write better code.
  strict: true,
  // Optional. Turn on verbose mode to get more logs.
  verbose: true,
});

/**
 * Start the program from instruction 1.
 * If no start point is provided, the program starts from instruction 0 by default.
 */
progA.run(1);
