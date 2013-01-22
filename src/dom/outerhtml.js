/** * @author  */Dom.implement({	getOuterHtml: function() {
		var elem = this.node;
		if ("outerHTML" in elem) {
			return elem.outerHTML;
		} else {
			var div = Dom.getDocument(elem).createElement('div')
			div.appendChild(this.clone().node);
			return div.innerHTML;
		}
	}}).implement({	setOuterHtml: function(value) {
		var elem = this.node;
		if ("outerHTML" in this && !/<(?:script|style|link)/i.test(value)) {
			elem.outerHTML = value;
		} else {
			this.before(value);
			this.remove();
		}
		return this;
	}});