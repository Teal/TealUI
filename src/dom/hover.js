/**
 * @author xuld
 */

//#include dom/base.js

Dom.prototype.hover = function (mouseenter, mouseleave) {

	if (typeof mouseenter === 'string') {
		var addClass = mouseenter;
		mouseenter = function (elem) {
			Dom.addClass(elem, addClass);
		}
	}

	if (typeof mouseleave === 'string') {
		var removeClass = mouseleave;
		mouseleave = function (elem) {
			Dom.removeClass(elem, removeClass);
		}
	}

	this.each(function (elem) {
		Dom.on(elem, 'mouseenter', mouseenter);
		Dom.on(elem, 'mouseleave', mouseleave);
	});
	return this;
};
