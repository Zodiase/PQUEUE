/*!
 * Process Queue v2.1
 *
 * Copyright 2013 Xingchen Hong
 *
 * Date: 2013-07-31 19:48
 */
function PQUEUE_2(a,b,c,d){"use strict";if("object"==typeof b)return new function(){function i(){return g.pc>=g.processes.length}function j(){g.error=!0}function k(a){return"function"==typeof a}function l(a){return a===PQUEUE_HALT}var e=this,f=a?a:null,g={calling:!1,ticking:!1,error:!1,autoProceed:!1,name:String(d?d:(new Date).getTime()),processes:[],processIndex:[],pc:0},h={};this.tick=function(){if(!g.ticking){if(g.ticking=!0,g.autoProceed=!0,g.error!==!1);else if(i())j();else{var a=g.processes[g.pc];if(k(a))if(l(a));else{++g.pc;var b={heap:h,heap_dump:function(){var a="";for(var b in h)""!==a&&(a+=", \n"),a+=b+":"+h[b];return"{\n"+a+"\n}"},wait:function(a){g.calling===!0&&g.autoProceed===!0&&(g.autoProceed=!1,"number"==typeof a&&window.setTimeout(b.walk,a))},walk:function(){g.calling===!1&&g.autoProceed===!1&&(g.autoProceed=!0,e.tick())},pc:{increment:function(){++g.pc},decrement:function(){--g.pc},offset:function(a){g.pc+=Number(a)||0},"goto":function(a){g.pc=Number(a)||-1},locate:function(a){return g.processIndex[String(a)]||-1}},parent:f};g.calling=!0,a.call(b,b),g.calling=!1}else j()}g.ticking=!1,g.autoProceed===!0&&window.setTimeout(function(){e.tick()},0)}};for(var m in b){var n=b[m],o=g.processes.length,p=n.name;g.processes.push(n),""!==p&&(g.processIndex[p]=o)}g.pc=parseInt(c,10)||0}}function PQUEUE_HALT(){}if("undefined"==typeof PQUEUE)var PQUEUE=PQUEUE_2;