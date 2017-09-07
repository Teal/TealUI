/**
 * @author xuld
 */

//#include dom/base.js

Dom.autoResize = function (elem) {
	Dom.setStyle(elem, 'overflow', 'hidden');
	Dom.on(elem, 'keyup', autoResize);
	autoResize.call(elem);

	function autoResize() {
		Dom.setHeight(this, 'auto');
		Dom.setHeight(this, this.scrollHeight);
	}
}

Dom.implement({

	autoResize: function() {
		this.each(Dom.autoResize);
		return this;
	}

});