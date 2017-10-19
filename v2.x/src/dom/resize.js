/**
 * @author xuld
 */

//#include dom/base.js

Dom.resize = (function() {
	
	var timer;
	
	function resizeProxy(e){
		if(timer)
			clearTimeout(timer);
		
		timer = setTimeout(function (){
			timer = 0;
			Dom.global.trigger('resize', e);
		}, 200);
	}
	
	return function (fn) {

		if(typeof fn === 'function') {
			Dom.global.on('resize', fn, window);

			if (resizeProxy) {
				Dom.on(window, 'resize', resizeProxy);
				resizeProxy = null;
			}
		} else {
			Dom.global.trigger('resize');
		}
	}

	
})();
