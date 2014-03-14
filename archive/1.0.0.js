/*!
 * Process Queue v1.0
 *
 * Copyright 2013 Xingchen Hong
 *
 * Date: 2012-09-12 19:48
 */
function PQUEUE (processArray, initialProcessID, queueName)
{
	if (typeof processArray !== 'object') return;
	var prototype = {
		error : false,
		autoProceed : false,
		// name of queue
		name : String(queueName ? queueName : (new Date()).getTime()),
		// for temporary storage for processes
		heap : {},
		// array of processes
		processes : [],
		// process counter
		pc : 0,
		// process next
		tick : function ()
		{
		//	console.group('PQUEUE[' + prototype.name + '].tick');
			// disable autoProceed at first
			prototype.autoProceed = false;
			// cant process with error
			if (prototype.error !== false) {
			//	console.warn('error');
			} else {
			//	console.log('PC = %i', prototype.pc);
				if (prototype.pc >= prototype.processes.length) {
				//	console.warn('stack overflow');
					prototype.error = true;
				} else {
					var currentProcess = prototype.processes[prototype.pc];
					if (typeof currentProcess !== 'function') {
					//	console.warn('invalid current process');
						prototype.error = true;
					} else if (currentProcess === PQUEUE_HALT) {
					//	console.log('halt');
					} else {
						++prototype.pc;
					//	console.log('PC = %i', prototype.pc);
						prototype.autoProceed = true;
						currentProcess.call(prototype, prototype);
					}
				}
			}
		//	console.groupEnd();
			if (prototype.autoProceed === true)
				window.setTimeout(function () {prototype.tick()}, 0);
		}
	};
	for (var key in processArray)
		prototype.processes.push(processArray[key]);
	prototype.pc = parseInt(initialProcessID, 10) || 0;
	return prototype;
}
function PQUEUE_HALT (q) {}