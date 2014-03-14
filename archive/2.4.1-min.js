!function(a,b,c){function d(a){var b=(new Date).getTime()/1e3,c=parseInt(b,10);return a?b:Math.round(1e3*(b-c))/1e3+" "+c}function f(){return d(!0)-e}function g(a){b.log("@"+(f().toString(10)+"        ").substr(0,8)+", PQUEUE: "+a)}function h(a){b.warn("@"+(f().toString(10)+"        ").substr(0,8)+", PQUEUE: "+a)}function i(a){return"object"!=typeof a?!1:"function"!=typeof a.constructor?!1:"string"!=typeof a.constructor.name?!1:"Array"===a.constructor.name}b===c&&(b={log:function(){},warn:function(){}});var e=d(!0),j=[],k=function(){"use strict";function D(){q.clock===!1&&(q.clock=a.setInterval(db,0))}function E(){q.clock!==!1&&(a.clearInterval(q.clock),q.clock=!1)}function F(){var a="";for(var b in q.sharedHeap)""!==a&&(a+=", \n"),a+=b+":"+q.sharedHeap[b];return"{\n"+a+"\n}"}function H(a,b){var d=Boolean(q.status&b);return a!==c&&(a?q.status|=b:q.status&=~b),d}function I(a){return H(a,r)}function J(a){return H(a,s)}function K(a){return H(a,t)}function L(a){return H(a,u)}function M(a){return H(a,v)}function N(a){return H(a,w)}function O(a){return H(a,x)}function P(a){return H(a,y)}function Q(a){return H(a,z)}function R(a){return H(a,A)}function T(){N(q.processCounter<0),O(q.processCounter>=q.processStack.length),P(q.nextProcess===m),Q(q.nextProcess===n),R("function"!=typeof q.nextProcess),M(N()||O()||R())}function U(a){"number"==typeof a&&(q.processCounter=a,q.nextProcess=q.processStack[q.processCounter],T())}function V(){M()||U(q.processCounter+1)}function W(){M()||U(q.processCounter-1)}function X(a){"number"==typeof a&&(q.processCounter+=a,q.nextProcess=q.processStack[q.processCounter],T())}function Y(a){var b=q.processIndexs[String(a)];return"number"==typeof b?b:-1}function Z(){return q.processCounter}function $(){return"function"==typeof q.nextProcess?q.nextProcess.name:String(q.processCounter)}function _(a){M(!0),q.errorMessages.push("string"==typeof a?a:"")}function ab(){for(h("pcUnderflow: "+Boolean(N())),h("pcOverflow: "+Boolean(O())),h("pcAtNoOp: "+Boolean(R())),h("pcAtHalt: "+Boolean(P())),h("pcAtBarrier: "+Boolean(Q()));q.errorMessages.length>0;)h(q.errorMessages.shift())}function bb(){K()||(K(!0),g("["+q.name+"].boot"),D())}function cb(){K()&&(K(!1),g("["+q.name+"].halt"),E())}function db(){if(K()&&!L()&&!J()){if(J(!0),g("["+q.name+"].tick"),M())return h("Has error(s)"),J(!1),ab(),cb(),void 0;if(P())return J(!1),cb(),void 0;var a=q.processCounter,b=q.nextProcess;V(),g("PC:"+a+">>"+b.name),I(!0);try{b.call(B,B,B.heap)}catch(c){_(c.message)}I(!1),J(!1)}}function eb(b){q.wakerStack.push(a.setTimeout(B.resume,b))}function fb(){for(;q.wakerStack.length>0;)a.clearTimeout(q.wakerStack.shift())}function gb(a){K()&&(L()||(L(!0),E(),"number"==typeof a&&eb(a)))}function hb(){K()&&L()&&(L(!1),fb(),D())}var b=null,d=[],e=0,f="",k=typeof arguments[0],l=typeof arguments[1],o=typeof arguments[2],p=typeof arguments[3];switch(arguments.length){case 1:if("string"===k)return j[arguments[0]];if("object"!==k)return null;if(i(arguments[0]))d=arguments[0];else{if(!i(arguments[0].processArray))return null;b="object"==typeof arguments[0].parent?arguments[0].parent:null,d=arguments[0].processArray,e="number"==typeof arguments[0].initialProcessID?arguments[0].initialProcessID:0,f="string"==typeof arguments[0].queueName?arguments[0].queueName:""}break;case 2:if("object"===k&&"object"===l)b=arguments[0],d=arguments[1],e=0,f="";else if("object"===k&&"number"===l)b=null,d=arguments[0],e=arguments[1],f="";else{if("object"!==k||"string"!==l)return null;b=null,d=arguments[0],e=0,f=arguments[1]}break;case 3:if("object"===k&&"object"===l&&"number"===o)b=arguments[0],d=arguments[1],e=arguments[2],f="";else if("object"===k&&"object"===l&&"string"===o)b=arguments[0],d=arguments[1],e=0,f=arguments[2];else{if("object"!==k||"number"!==l||"string"!==o)return null;b=null,d=arguments[0],e=arguments[1],f=arguments[2]}break;case 4:if("object"!==k||"object"!==l||"number"!==o||"string"!==p)return null;b=arguments[0],d=arguments[1],e=arguments[2],f=arguments[3];break;default:return null}if(2===arguments.length&&"object"==typeof arguments[0]&&"object"==typeof arguments[1]&&(b=arguments[0],d=arguments[1]),2===arguments.length&&"object"==typeof arguments[0]&&"object"==typeof arguments[1]&&(b=arguments[0],d=arguments[1]),g("Instantiating new process queue."),"object"!=typeof d)return h("Invalid argument[1]. Expecting an Object."),h("Returning NULL."),null;g("Generating new process queue object.");for(var q={clock:!1,parent:b&&"object"==typeof b&&b.PQUEUE?b:null,name:"",status:0,errorMessages:[],processStack:[],processIndexs:[],processCounter:0,nextProcess:null,sharedHeap:{},wakerStack:[]},r=1,s=2,t=4,u=8,v=16,w=32,x=64,y=128,z=256,A=512,B={heap:q.sharedHeap,heap_dump:F,pause:function(a){I()&&!L()&&gb(a)},resume:function(){L()&&hb()},pc:{increment:V,decrement:W,offset:X,"goto":U,locate:Y,valueOf:Z,toString:$},isPaused:function(){return L()},parent:q.parent},C={boot:bb,halt:cb},ib=0,jb=d.length;jb>ib;++ib){var kb=d[ib],lb=kb.name,mb=q.processStack.length;q.processStack.push(kb),""!==lb&&(q.processIndexs[lb]=mb)}return U("number"==typeof e?e:0),"string"==typeof f&&""!==f?(q.name=f,j[f]=B):q.name=String((new Date).getTime()),C},l="2.4.1",m=function(){},n=function(a){a.pause()};a.PQUEUE,a.PQUEUE_HALT,a.PQUEUE_BARRIER,k.PQUEUE=l,"object"==typeof a&&"object"==typeof a.document&&(a.PQUEUE=k,a.PQUEUE_HALT=m,a.PQUEUE_BARRIER=n)}(window,console);