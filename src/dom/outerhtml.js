/**
 * @author xuld
 */

//#include dom/base.js

Dom.prototype.outerHtml = function () {
	return this.access(function (elem) {
		if ("outerHTML" in elem) {
			return elem.outerHTML;
		} else {
			var div = Dom.getDocument(elem).createElement('div')
			div.appendChild(Dom.clone(elem));
			return div.innerHTML;
		}
	}, function (elem, value) {
		if ("outerHTML" in elem && !/<(?:script|style|link)/i.test(value)) {
			elem.outerHTML = value;
		} else {
			Dom.before(elem, value);
			Dom.remove(elem);
		}
	}, arguments, 0);
};
