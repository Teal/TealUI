


using("System.Dom.Base");

Dom.resize = (function() {
	
	var timer;

	Dom.addEvents('resize', {

		add: function (ctrl, type, fn) {
			Dom.$event.$default.add(ctrl, type, resizeProxy);
		},

		remove: function (ctrl, type, fn) {
			Dom.$event.$default.remove(ctrl, type, resizeProxy);
		}

	});
	
	function resizeProxy(e){
		if(timer)
			clearTimeout(timer);
		
		timer = setTimeout(function (){
			timer = 0;
			Dom.window.trigger('resize', e);
		}, 100);
	}
	
	
	
	return function(fn){
		Dom.window[typeof fn === 'function' ? 'on' : 'trigger']('resize', fn);
	}

	
})();