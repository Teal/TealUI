/** * @author xuld *///#include fx/animate.jsDom.implement({
	scrollTo: function(y, x, duration, callback) {
		var obj = {};
		if (y != null) {
			obj.scrollTop = y;
		}
		if (x != null) {
			obj.scrollLeft = x;
		}
		return this.animate(obj, duration, callback, 'abort');	},	scrollBy: function(y, x, duration, callback) {		return this.forEach(function(elem) {			var scroll = Dom.getScroll(elem);			return Dom.query(elem).scrollTo(y == null ? y : (scroll.y + y), x == null ? x : (scroll.x + x), duration, callback);		});	}});