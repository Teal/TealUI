//===========================================
//  表示延时的任务   delayedtask.js  A
//===========================================


	
	
	
namespace(".DelayedTask", JPlus.Base.extend({
	
	constructor: function(fn, scope, args) {
		var id = null, d, t;
		
	},
	
	call: function() {
			var now = new Date().getTime();
			if (now - t >= d) {
				clearInterval(id);
				id = null;
				fn.apply(scope, args || []);
			}
		},
	
		delay: function(delay, newFn, newScope, newArgs) {
			if (id && delay != d) {
				this.cancel();
			}
			d = delay;
			t = new Date().getTime();
			fn = newFn || fn;
			scope = newScope || scope;
			args = newArgs || args;
			if (!id) {
				id = setInterval(call, d);
			}
		},
	
	cancel: function() {
			if (id) {
				clearInterval(id);
				id = null;
			}
		}
}));