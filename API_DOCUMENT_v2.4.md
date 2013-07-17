Process Queue library for Javascript
====================================
**Ver. 2.4**

**PQUEUE Creation Interface:**

	pqueue PQUEUE([pqueue_api parent, ]array processArray[, int initialPC][, string queueName]);

	Arguments:
		pqueue_api parent      : Optional argument. Used when connecting a sub-queue to its parent. NULL by default.
		array      processArray: An array of `process` functions to be executed. Each function will be filled with 
		                         two arguments as illustrated below:
		
		                         +--------------------------------------------------------+
		                         | function aProcess(pqueue_api queue, object heap) {...} |
		                         +--------------------------------------------------------+
				
		int        initialPC   : Initial value of the process counter. 0 by default.
		string     queueName   : Name of the queue. If specified, the result queue can be fetched later with the 
		                         Reference Interface.
	Return:
		A pqueue object if all given arguments are valid. NULL on error.

**PQUEUE Reference Interface:**

	pqueue_object PQUEUE(string queueName);

	Arguments:
		string     queueName   : Name of the queue to search.
	Return:
		A pqueue object if found, otherwise undefined.

**`pqueue` interface:**

	interface pqueue {
		void function boot();
		void function halt();
	}

**`pqueue_api` interface:**

	interface pqueue_api {
		object heap;
		string function heap_dump();
		void function pause(int time);
		void function resume();
		pqueue_api_pc pc;
		boolean function isPaused();
		pqueue_api parent;
	}

**`pqueue_api_pc` interface:**

	interface pqueue_api_pc {
		void function increment();
		void function decrement();
		void function offset(int offset);
		void function goto(int newPc);
		int function locate(string funcName);
		int function valueOf();
		string function toString();
	}

------------------------------------------------------------------------------------------

PQUEUE takes as many as four arguments but you can offer just one:

	var theQueue = PQUEUE([
		function1,
		function2,
		...,
		PQUEUE_HALT
	]); // only the process array is needed

You can also specify a value as the initial process counter value:

	var theQueue = PQUEUE([
		function1,
		function2,
		...,
		PQUEUE_HALT
	], 5); // queue will start executing from the sixth process
	
Also a name for the queue is good for debugging:

	var theQueue = PQUEUE([
		function1,
		function2,
		...,
		PQUEUE_HALT
	], 0, 'main'); // the initialPC argument could be omitted
	// now you can get a reference to theQueue with PQUEUE('main') wherever you put it

Here's an example of how to cascade pqueues:

	var bigQueue = PQUEUE([
		function createSubQueue(queue, heap) {
			queue.pause(); // pause the parent queue
			heap.subQueue = PQUEUE(queue, [ // pass the pqueue_api object to the child
				someOtherFunctions,
				function resumeParent(queue) {
					queue.parent.resume(); // resume `bigQueue`
				},
				PQUEUE_HALT
			]);
		},
		function2,
		...,
		PQUEUE_HALT
	], 'complex'); // the initialPC argument could be omitted

*If you have any questions feel free to [contact me](mailto:hello@xc-h.net)*
