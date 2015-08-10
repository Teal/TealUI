/**
 * @fileOverview 多个元素的效果
 * @author xuld
 */

typeof include === "function" && include("../dom/dom");

Dom.prototype.multiFade = function (opacity, onFade, onShow) {
	opacity = opacity === undefined ? .3 : opacity;

	var me =this;

	function update(target, opacity, callback) {
		for (var i = 0; i < me.length; i++) {
			if (me[i] !== target) {
				Dom(me[i]).animate({ opacity: opacity }, callback);
			}
		}
	}

	return this.on('mouseenter', function (e) {
		update(this, opacity, onFade);
	}).on('mouseleave', function (e) {
		update(this, 1, onShow);
	});

};
