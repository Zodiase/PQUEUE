Process Queue for Javascript
============================

Originally I wrote this to use with jQuery for better _flow control_ over asynchronous
tasks.

Let me use an example to illustrate the problems I encountered and how this library fixs
them.

One could use chaining in jQuery to create a series of animations on a single object, and
they get executed one by one because jQuery creates an internal animation queue.

In many cases, however, I'd like to ___execute an animation on another object right after
this one finishes___. One simple code clip would look something like this:

```JavaScript
obj1.animate({someProperty}, 300, function () {
	obj2.animate({someOtherProperty}, 300);
});
```

It's not bad for now, but things get _uglier_ soon after I decided to add a third phase:

```JavaScript
obj1.animate({someProperty}, 300, function () {
	obj2.animate({someOtherProperty}, 300, function () {
		obj3.animate({someExtraProperty}, 300);
	});
});
```

And it only gets worse as I make the thing more complex.

I thought I could do something like this:

```JavaScript
function animateObj1 () {
	obj1.animate({someProperty}, 300, animateObj2);
}
function animateObj2 () {
	obj2.animate({someOtherProperty}, 300, animateObj3);
}
function animateObj3 () {
	obj3.animate({someExtraProperty}, 300);
}

animateObj1();
```

It's tidier now, but still I find it a little confusing when I want to make some
adjustments.

Then I wrote this library, PQUEUE, and now the code looks like this:

```JavaScript
var aQueue = PQUEUE([
	function animateObj1 (queue) {
		queue.pause();
		obj1.animate({someProperty}, 300, queue.resume);
	},
	function animateObj2 (queue) {
		queue.pause();
		obj2.animate({someOtherProperty}, 300, queue.resume);
	},
	function animateObj3 (queue) {
		queue.pause();
		obj3.animate({someExtraProperty}, 300, queue.resume);
	},
	PQUEUE_HALT
]);

aQueue.boot();
```

It might look no different but there's more:

```JavaScript
var aQueue = PQUEUE([
	function animateObj2 (queue) {
		queue.pause();
		queue.pc.goto(queue.pc.locate('animateObj3'));
		obj2.animate({someOtherProperty}, 300, queue.resume);
	},
	function animateObj1 (queue) {
		queue.pause();
		queue.pc.goto(queue.pc.locate('animateObj2'));
		obj1.animate({someProperty}, 300, queue.resume);
	},
	function animateObj3 (queue) {
		queue.pause();
		obj3.animate({someExtraProperty}, 300, queue.resume);
	},
	PQUEUE_HALT
], 1);

aQueue.boot();
```

Now I have more freedom in the way of organizing my code.

**For more detail please read the [API document](API_DOCUMENT_v2.4.md).**

*If you have any questions feel free to [contact me](mailto:hello@xc-h.net)*

**Hope you find this usefull! :)**
