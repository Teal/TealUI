/** * @author xuld *///#include dom/base.jsvar jQuery = function (selector, context) {
	if (!selector) {
		return new Dom();
	}

	if (typeof selector === "string" && selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
		return Dom.parse(selector, context);
	} else if (typeof selector === "function") {
		return Dom.ready(selector, context);
	}

	return Dom.query(selector, context);
},
	_$ = window.$,
	$ = jQuery;

jQuery.prototype = jQuery.fn = Dom.prototype;

Dom.implement({

	attr: function (name, value) {
		return arguments.length > 1 ? this.setAttribute(name, value) : this.getAttribute(name, value, 2);
	},

	prop: function (name, value) {
		return arguments.length > 1 ? this.setAttribute(name, value) : this.getAttribute(name, value, 1);
	},

	css: function (name, value) {
		return arguments.length > 1 ? this.setStyle(name, value) : this.getStyle(name, value);
	},

	position: function (value) {
		return arguments.length > 1 ? this.setOffset(value) : this.getOffset();
	}

});