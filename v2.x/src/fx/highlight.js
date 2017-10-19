/** * @author xuld *///#include dom/base.js//#include fx/color.js//#include fx/animate.js/** * 高亮元素。 * @param {String} color 颜色。 * @param {Function} [callback] 回调。 * @param {Number} duration=500 时间。 * @return this */Dom.prototype.highlight = function(){	//assert(!callback || typeof callback === 'function', "Dom#highlight(color, duration, callback): 参数 {callback} 不是可执行的函数。", callback);	return this.iterate(function (elem, color, duration, callback) {
		var fx = Dom.tween(elem),		back = {
			elem: elem,			params: {},			duration: duration,			stop: callback
		};		fx.run({
			elem: elem,			params: {
				backgroundColor: color || '#ffff88'
			},			duration: duration,			start: function () {
				back.params.backgroundColor = Dom.styleString(elem, 'backgroundColor');
			}
		}).run(back);
	}, arguments);}; 