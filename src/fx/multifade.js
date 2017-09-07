/**
 * @fileOverview 多个元素的效果
 * @author xuld
 */

//#include fx/animate.js

Dom.prototype.multiFade = function (opacity, onFade, onShow) {
	opacity = opacity === undefined ? 0.3 : opacity;

	var me = this;

	this.each(function (elem) {

		Dom.on(elem, 'mouseenter', function (e) {
			update(opacity, onFade, this);
		});

		Dom.on(elem, 'mouseleave', function (e) {
			update(1, onShow, this);
		})

	});

	function update(opacity, callback, target) {
		for (var i = 0; i < me.length; i++) {
			if (me[i] !== target) {
				Dom.animate(me[i], { opacity: opacity }, -1, callback, 'abort');
			}
		}
	}

};
