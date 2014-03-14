/*!
 * Process Queue v2.3
 *
 * Copyright 2013 Xingchen Hong
 *
 * Date: 2013-06-03 19:48
 */
/*
Change Log:
     Added package protection and console debugging support.
*/
// add ';' to seperate from previous code clips.
// w,d, c, u refers to window, document, console and undefined, respectively.
;(function (w, d, c, u) {
	// function wrapped inside
	// fall-back for console
	if (c === u) {
		c = {
			log: function () {},
			warn: function () {}
		};
	}
	function microtime(get_as_float) {
		var now = new Date().getTime() / 1000;
		var s = parseInt(now, 10);
		return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
	}
	var startTime = microtime(true);
	function elapsedTime() {
		return microtime(true) - startTime;
	}
	function log(msg) {
		c.log('@' + elapsedTime().toString(10).substr(0,16) + ', PQUEUE_2: ' + msg);
	}
	function warn(msg) {
		c.warn('@' + elapsedTime().toString(10).substr(0,16) + ', PQUEUE_2: ' + msg);
	}
	function PQUEUE_2(parent, processArray, initialProcessID, queueName) {
		"use strict";
		log('Instantiating new process queue.');
		if (typeof processArray !== 'object') {
			warn('Invalid argument[1]. Expecting an Object.');
			warn('Returning NULL.');
			return;
		}
		log('Generating new process queue object.');
		return new function () {
			// make a backup reference to this.
			var pqueue = this;
			// connect with parent queue
			var _parent = (typeof parent === 'object') ? parent : null;
			// private variables
			var status = {
				calling: false,
				ticking: false,
				error: false,
				errorMessage: [],
				autoProceed: false,
				// name of queue
				name: String(queueName ? queueName : (new Date()).getTime()),
				// array of processes
				processes: [],
				processIndex: [],
				// process counter
				pc: 0,
			};
			// for temporary storage for processes
			var sharedHeap = {};
			// helper functions
			function pcOverflow() {
				return status.pc >= status.processes.length;
			}
	
			function fireError(message) {
				status.error = true;
				status.errorMessage.push((typeof message === 'string') ? message : '');
			}
			function throwError() {
				while (status.errorMessage.length > 0) {
					warn(status.errorMessage.shift());
				}
			}
	
			function is_function(object) {
				return typeof object === 'function';
			}
	
			function is_HALT(process) {
				return process === PQUEUE_HALT;
			}
	
			function is_BARRIER(process) {
				return process === PQUEUE_BARRIER;
			}
			// start running
			this.tick = function () {
				// if already ticking, halt.
				if (status.ticking) {
					warn('Already ticking.');
					return;
				}
				status.ticking = true;
				log('[' + status.name + '].tick');
				// don't autoProceed by default
				status.autoProceed = false;
				
				if (status.error !== false) {
					// cant process with error
					throwError();
				} else {
					log('PC = ' + status.pc);
					if (pcOverflow()) {
						fireError('PC overflow');
					} else {
						var currentProcess = status.processes[status.pc];
						if (!is_function(currentProcess)) {
							fireError('invalid process');
						} else if (is_HALT(currentProcess)) {
							log('halt');
						} else if (is_BARRIER(currentProcess)) {
							log('barrier');
						} else {
							// now can proceed
							++status.pc;
							status.autoProceed = true;
							log('>>' + currentProcess.name);
							/**
							 * pass _api over so client script
							 * can only harm _api
							 */
							var _api = {
								heap: sharedHeap,
								heap_dump: function () {
									var result = '';
									for (var key in sharedHeap) {
										if (result !== '') result += ', \n';
										result += key + ':' + sharedHeap[key];
									}
									return '{\n' + result + '\n}';
								},
								wait: function (time) {
									if (status.calling === true && status.autoProceed === true) {
										switch (typeof time) {
											case 'number':
												w.setTimeout(_api.walk, time);
											case 'undefined':
												status.autoProceed = false;
												break;
											default:
										}
									}
								},
								walk: function () {
									if (status.calling === false && status.autoProceed === false) {
										status.autoProceed = true;
										pqueue.tick();
									}
								},
								pc: {
									increment: function () {
										++status.pc;
									},
									decrement: function () {
										--status.pc;
									},
									offset: function (value) {
										status.pc += Number(value) || 0;
									},
									goto: function (value) {
										status.pc = Number(value) || -1;
									},
									locate: function (funcName) {
										return status.processIndex[String(funcName)] || -1;
									}
								},
								parent: _parent
							};
							status.calling = true;
							try {
								currentProcess.call(_api, _api);
							} catch (e) {
								fireError(e.message);
							}
							status.calling = false;
						}
					}
				}
				status.ticking = false;
				if (status.autoProceed === true) w.setTimeout(function () {
					pqueue.tick()
				}, 0);
			};
			for (var key in processArray) {
				var process = processArray[key];
				var index = status.processes.length;
				var name = process.name;
				status.processes.push(process);
				if (name !== '') status.processIndex[name] = index;
			}
			status.pc = parseInt(initialProcessID, 10) || 0;
		};
	}
	
	function PQUEUE_HALT(q) {}
	
	function PQUEUE_BARRIER(q) {
		q.wait();
	}
	if (w.PQUEUE === u) {
		w.PQUEUE = PQUEUE_2;
		w.PQUEUE_HALT = PQUEUE_HALT;
		w.PQUEUE_BARRIER = PQUEUE_BARRIER;
	}
})(window, document, console);