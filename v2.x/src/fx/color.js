/**
 * DOM 补间动画 - 颜色
 * @author xuld
 */

//#include fx/tween.js


Fx.defaultTweeners.unshift({
	
	set: Fx.numberTweener.set,
	
	compute: function(from, to, delta){
		var compute = Fx.numberTweener.compute,
			r = [
				Math.round(compute(from[0], to[0], delta)),
				Math.round(compute(from[1], to[1], delta)),
				Math.round(compute(from[2], to[2], delta))
			],
			i = 0;
		
		while(i < 3) {
			delta = r[i].toString(16);
			r[i++] = delta.length === 1 ? '0' + delta : delta;
		}
		return '#' + r.join('');
	},
	
	parse: function(value){
		if(value === 'transparent')
			return [255, 255, 255];
		var i, r, part;
		
		if(part = /^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})$/i.exec(value)){
			i = 0;
			r = [];
			while (++i <= 3) {
				value = part[i];
				r.push(parseInt(value.length == 1 ? value + value : value, 16));
			}
		} else if(part = /(\d+),\s*(\d+),\s*(\d+)/.exec(value)){
			i = 0;
			r = [];
			while (++i <= 3) {
				r.push(parseInt(part[i]));
			}
		}
		
		return r;
	},
	
	get: function(elem, name){
	    return this.parse(Dom.styleString(elem, name));
	}

});