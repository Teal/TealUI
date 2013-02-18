/**
 * @author xuld
 */

include("dom/base.js");

Dom.implement({

	getOuterHtml: function () {
		if (!this.length) {
			return null;
		}

		var elem = this[0];
		if ("outerHTML" in elem) {
			return elem.outerHTML;
		} else {
			var div = Dom.getDocument(elem).createElement('div')
			div.appendChild(Dom.clone(elem));
			return div.innerHTML;
		}
	},

	setOuterHtml: function (value) {
		return Dom.iterate(this, function (elem) {
			if ("outerHTML" in elem && !/<(?:script|style|link)/i.test(value)) {
				elem.outerHTML = value;
			} else {
				Dom.before(elem, value);
				Dom.remove(elem);
			}
		});
	}

});