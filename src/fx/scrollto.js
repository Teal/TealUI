/** * @author  */using("System.Fx.Animate");Dom.implement({
	scrollTo: function(y, x, duration, callback) {
		var obj = {};
		if (y != null) {
			obj.scrollTop = y;
		}
		if (x != null) {
			obj.scrollLeft = x;
		}
		return this.animate(obj, duration, callback, 'abort');	},	scrollBy: document.scrollBy = function(y, x, duration, callback) {
		var scroll = this.getScroll();
		return this.scrollTo(y == null ? y : (scroll.y + y), x == null ? x : (scroll.x + x), duration, callback);	}});document.scrollTo = function(y, x, duration, callback){	Dom.get(this).scrollTo(y, x, duration, callback);};