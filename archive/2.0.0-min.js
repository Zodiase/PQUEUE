/*!
 * Process Queue v2.0
 *
 * Copyright 2013 Xingchen Hong
 *
 * Date: 2013-05-25 19:48
 */
function PQUEUE_2(a,b,c){"use strict";if("object"==typeof a)return new function(){function g(){return e.pc>=e.processes.length}function h(){e.error=!0}function i(a){return"function"==typeof a}function j(a){return a===PQUEUE_HALT}var d=this,e={ticking:!1,error:!1,autoProceed:!1,name:String(c?c:(new Date).getTime()),processes:[],processIndex:[],pc:0},f={};this.tick=function(){if(!e.ticking){if(e.ticking=!0,e.autoProceed=!0,e.error!==!1);else if(g())h();else{var a=e.processes[e.pc];if(i(a))if(j(a));else{++e.pc;var b={heap:f,heap_dump:function(){var a="";for(var b in f)""!==a&&(a+=", \n"),a+=b+":"+f[b];return"{\n"+a+"\n}"},wait:function(){e.autoProceed=!1},walk:function(){e.autoProceed=!0,d.tick()},pc:{increment:function(){++e.pc},decrement:function(){--e.pc},offset:function(a){e.pc+=Number(a)||0},"goto":function(a){e.pc=Number(a)||-1},locate:function(a){return e.processIndex[String(a)]||-1}}};a.call(b,b)}else h()}e.ticking=!1,e.autoProceed===!0&&window.setTimeout(function(){d.tick()},0)}};for(var k in a){var l=a[k],m=e.processes.length,n=l.name;e.processes.push(l),""!==n&&(e.processIndex[n]=m)}e.pc=parseInt(b,10)||0}}function PQUEUE_HALT(){}if("undefined"==typeof PQUEUE)var PQUEUE=PQUEUE_2;