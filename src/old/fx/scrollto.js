/**

		var obj = {};
		if (y != null) {
			obj.scrollTop = y;
		}
		if (x != null) {
			obj.scrollLeft = x;
		}
		return this.animate(obj, duration, callback, 'abort');