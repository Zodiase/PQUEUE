/*!
 * Process Queue v1.0
 *
 * Copyright 2013 Xingchen Hong
 *
 * Date: 2012-09-12 19:48
 */
function PQUEUE(a,b,c){if("object"==typeof a){var d={error:!1,autoProceed:!1,name:String(c?c:(new Date).getTime()),heap:{},processes:[],pc:0,tick:function(){if(d.autoProceed=!1,d.error!==!1);else if(d.pc>=d.processes.length)d.error=!0;else{var a=d.processes[d.pc];"function"!=typeof a?d.error=!0:a===PQUEUE_HALT||(++d.pc,d.autoProceed=!0,a.call(d,d))}d.autoProceed===!0&&window.setTimeout(function(){d.tick()},0)}};for(var e in a)d.processes.push(a[e]);return d.pc=parseInt(b,10)||0,d}}function PQUEUE_HALT(){}