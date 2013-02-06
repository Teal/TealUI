/**
 * @author xuld
 */

include("dom/base.js");

Dom.implement({

	autoResize: function() {
		this
			.setStyle('overflow', 'hidden')
			.on('keyup', autoResize);

		this.each(function (elem) {
			autoResize.call(elem);
		})

		function autoResize() {
			var dom = Dom.get(this);
			dom.setHeight('auto').setHeight(dom.getScrollSize().y);
		}
	}

});