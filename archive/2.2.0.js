/*!
 * Process Queue v2.2
 *
 * Copyright 2013 Xingchen Hong
 *
 * Date: 2013-07-31 19:48
 */
/*
Change Log:
     Added pre-defined constant PQUEUE_BARRIER for easier process separation. Execution won't be able to pass a barrier under any circumstances.
*/
function PQUEUE_2(parent, processArray, initialProcessID, queueName) {
	"use strict";
	if (typeof processArray !== 'object') return;
	return new function () {
		var _self = this;
		var _parent = (typeof parent === 'object') ? parent : null;
		var _pstat = {
			calling: false,
			ticking: false,
			error: false,
			autoProceed: false,
			/* name of queue */
			name: String(queueName ? queueName : (new Date()).getTime()),
			/* array of processes */
			processes: [],
			processIndex: [],
			/* process counter */
			pc: 0,
		}; /* for temporary storage for processes */
		var _heap = {}; /* helper functions */

		function _overflow() {
			return _pstat.pc >= _pstat.processes.length;
		}

		function _error() {
			_pstat.error = true;
		}

		function _isFunction(object) {
			return typeof object === 'function';
		}

		function _isHalt(process) {
			return process === PQUEUE_HALT;
		}

		function _isBarrier(process) {
			return process === PQUEUE_BARRIER;
		} /* start running */
		this.tick = function () { /* if already ticking, halt */
			if (_pstat.ticking) return;
			_pstat.ticking = true;
			//     console.group('PQUEUE[' + prototype.name + '].tick');
			/* autoProceed by default */
			_pstat.autoProceed = true; /* cant process with error */
			if (_pstat.error !== false) {
				//     console.warn('error');
			} else {
				//     console.log('PC = %i', prototype.pc);
				if (_overflow()) {
					//     console.warn('stack overflow');
					_error();
				} else {
					var currentProcess = _pstat.processes[_pstat.pc];
					if (!_isFunction(currentProcess)) {
						//     console.warn('invalid current process');
						_error();
					} else if (_isHalt(currentProcess)) {
						//     console.log('halt');
					} else {
						if (!_isBarrier(currentProcess)) ++_pstat.pc;
						//     console.log('PC = %i', prototype.pc);
						/**
						 * pass _api over so client script
						 * can only harm _api
						 */
						var _api = {
							heap: _heap,
							heap_dump: function () {
								var result = '';
								for (var key in _heap) {
									if (result !== '') result += ', \n';
									result += key + ':' + _heap[key];
								}
								return '{\n' + result + '\n}';
							},
							wait: function (time) {
								if (_pstat.calling === true && _pstat.autoProceed === true) {
									if (typeof time === 'number') {
										_pstat.autoProceed = false;
										window.setTimeout(_api.walk, time);
									}
								}
							},
							walk: function () {
								if (_pstat.calling === false && _pstat.autoProceed === false) {
									_pstat.autoProceed = true;
									_self.tick();
								}
							},
							pc: {
								increment: function () {
									++_pstat.pc;
								},
								decrement: function () {
									--_pstat.pc;
								},
								offset: function (value) {
									_pstat.pc += Number(value) || 0;
								},
								goto: function (value) {
									_pstat.pc = Number(value) || -1;
								},
								locate: function (funcName) {
									return _pstat.processIndex[String(funcName)] || -1;
								}
							},
							parent: _parent
						};
						_pstat.calling = true;
						try {
							currentProcess.call(_api, _api);
						} catch (e) {
							_error();
						}
						_pstat.calling = false;
					}
				}
			}
			_pstat.ticking = false;
			//     console.groupEnd();
			if (_pstat.autoProceed === true) window.setTimeout(function () {
				_self.tick()
			}, 0);
		};
		for (var key in processArray) {
			var process = processArray[key];
			var index = _pstat.processes.length;
			var name = process.name;
			_pstat.processes.push(process);
			if (name !== '') _pstat.processIndex[name] = index;
		}
		_pstat.pc = parseInt(initialProcessID, 10) || 0;
	};
}

function PQUEUE_HALT(q) {}

function PQUEUE_BARRIER(q) {
	q.wait();
}
if (typeof PQUEUE == 'undefined') var PQUEUE = PQUEUE_2;