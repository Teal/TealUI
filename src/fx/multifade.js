/**
 * @fileOverview 多个元素的效果
 * @author xuld
 */

include("fx/animate.js");

Dom.implement({
	
	multiFade: function( opacity, onFade, onShow ) {
		opacity = opacity === undefined ? 0.3 : opacity;
		
		this.each(function (elem) {

			Dom.on(elem, 'mouseenter', function (e) {
				if (elem != e.target) {
					Dom.animate(elem, {opacity: opacity}, -1, onFade, 'abort');
				}
			});

			Dom.on(elem, 'mouseleave', function (e) {
				if (elem != e.target) {
					Dom.animate(elem, {opacity: 1}, -1,onShow, 'abort');
				}
			})

		});
		
	}

});

