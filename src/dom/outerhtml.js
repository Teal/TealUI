/**
 * @author xuld
 */

//#include dom/base.js

Dom.prototype.outerHtml = function (value) {

	if (arguments.length === 0) {
		if (this.length) {
			var elem = this[0];
			if ("outerHTML" in elem) {
				return elem.outerHTML;
			} else {
				var div = Dom.getDocument(elem).createElement('div')
				div.appendChild(Dom.clone(elem));
				return div.innerHTML;
			}
		}

		return null;
	} else {
		return this.iterate(function (elem) {
			if ("outerHTML" in elem && !/<(?:script|style|link)/i.test(value)) {
				elem.outerHTML = value;
			} else {
				Dom.before(elem, value);
				Dom.remove(elem);
			}
		});
	}
};
