

include("core/class/base.js");

var Dom = (function($){

	var Dom = Class.Native(function (nodelist) {
		if(nodelist) {
			var i = 0;
			while (nodelist[i])
				this[this.length++] = nodelist[i++];
		}
    });

    Dom.prototype = $();

    Object.extend(Dom, {

    	get: function (id, context) {
    		return typeof id === "string" ? (id = document.getElementById(id)) && new Dom([id]) :
				id ? id.nodeType || id.setTimeout ? new Dom([id]) :
					id instanceof Dom ? id : Dom.get(id[0]) :
					null;
    	},

    	find: function (selector, context) {
    		return typeof selector === 'string' ? new Dom([$(selector, context)[0]]) :
				selector instanceof Dom ? selector :
					selector ? selector.nodeType || selector.setTimeout ?
							new Dom([selector]) : new Dom(selector) :
						new Dom;
    	},

    	query: function (selector, context) {
    		return typeof selector === 'string' ? new Dom($(selector, context)) :
				selector instanceof Dom ? selector :
					selector ? selector.nodeType || selector.setTimeout ?
							new Dom([selector]) : new Dom(selector) :
						new Dom;
    	},

    	create: function (tagName, className) {
    		assert.isString(tagName, 'Dom.create(tagName, className): {tagName} ~');
    		var div = document.createElement(tagName);
    		if (className)
    			div.className = className;
    		return new Dom([div]);
    	},

        parse: function (html, context) {
        	return typeof html === 'string' ? new Dom(jQuery(html.trim(), context)) : html;
        },

        ready: function (callback) {
			$(document).ready(callback);
			return this;
        },

        laod: function (callback) {
			$(window).load(callback);
			return this;
        },

        calc: function (elem, attributes) {

        },

        getText: function (elem) {
			
        },

        setText: function (elem, value) {
			
        },

        getStyle: function (elem, name) {

        },

        styleNumber: function (elem, name) {

        },

        styleString: function (elem, name) {

        },

        movable: function (elem, name) {

        },

        getAttr: function (elem, type) {

        },

        has: function (elem, child) {

        },

        show: function (elem) {

        },

        hide: function (elem) {

        },

        isHidden: function (elem) {

        },

        getDocument: function (elem) {

        },

        data: function (elem) {

        }

    });

    Dom.implement({
    	
    	constructor: Dom,
    	
    	toString: Class.Base.prototype.toString,

    	// addClass
    	// removeClass
    	// hasClass
    	// index
    	// delegate
    	// trigger
    	// has
    	// clone
    	// append
    	// prepend
    	// after
    	// before
    	// appendTo
    	// prev
    	// next
    	// parent
    	// closest
    	// prevAll
    	// nextAll
    	// parents
    	// offsetParent
    	// children
    	// siblings
    	// empty
    	// remove
    	// replaceWith
    	// each
    	// length
    	// filter
    	// add
    	// slice
    	// splice
    	// push

    	animate: function () {
    
    	},
    	
    	item: function (index) {
    		var elem = this[index < 0 ? this.length + index : index];
			return new Dom(elem && [elem]);
    	},

    	on: function (eventName, handler, context) {
    		//return this.bind(eventName, handler)
    	},

    	un: function (eventName, handler) {

    	},

    	once: function (eventName, handler) {

    	},

    	setStyle: function (name, value) {
			return this.css(name, value);
    	},

    	getStyle: function (name) {
			return this.css(name);
    	},

    	setAttr: function (name, value) {
			return this.attr(name, value);
    	},

    	getAttr: function (name, type) {
			return type ? type !== 2 ? this.attr(name) : this.prop('default' + name) : this.prop(name);
    	},

    	setHtml: function (value) {
    		return iterateDom(this, Dom.setHtml, value);
    	},

    	getHtml: function () {
			return Dom.getHtml(this[0]);
    	},

    	setText: function (value) {
    		return iterateDom(this, Dom.setText, value);
    	},

    	getText: function () {
			return this.text();
    	},

    	setSize: function (value) {

    	},

    	getSize: function () {
			
    	},

    	setWidth: function (value) {

    	},

    	getWidth: function () {

    	},

    	setHeight: function (value) {

    	},

    	getHeight: function (value) {

    	},

    	show: function (value) {

    	},

    	hide: function (value) {

		},

    	toggle: function (value) {

    	},

    	unselectable: function () {
    
    	},

    	getScrollSize: function () {

    	},

    	setScroll: function (value) {

    	},

    	getScroll: function () {

    	},

    	setOffset: function (value) {

    	},

    	getOffset: function () {

    	},

    	setPosition: function (value) {

    	},

    	getPosition: function () {

    	},

    	child: function (index) {

    	},

    	find: function () {

    	},

    	query: function () {

    	},

    	match: function () {

    	},

    	isHidden: function () {

    	},

    	insert: function (newChild, refChild) {
    
    	},

    	has: function (dom, allowSelf) {

    	}

		// ���·����� jquery-style �ṩ��
    	// attr
    	// prop
    	// text
    	// html
    	// val
    	// css
    	// bind
    	// unbind
    	// is
    	// offset
    	// width
    	// height
    	// position
    	// one
    	// eq
    	// get
    	// scrollTop
    	// scrollLeft

    });

	function iterateDom(dom, fn, args1, args2){
		for(var i = 0, len = dom.length; i < len; i++) {
			fn(dom[i], args1, args2);
		}
		return dom;
	}

    return Dom;

})(jQuery);
