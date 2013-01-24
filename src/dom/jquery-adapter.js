

include("core/class.js");

var Dom = (function($){

	var Dom = Class.Native(function (nodelist) {
		var i = 0;
		while(this[this.length++] = nodelist[i++]);
    });

    Dom.prototype = $();

    Object.extend(Dom, {

    	get: function (id, context) {
    
    	},

    	find: function (selector, context) {

    	},

    	query: function (selector, context) {

    	},

    	create: function (tagName, className) {
    		
    	},

        parse: function (html, context) {
        	return new Dom(jQuery(html, context));
        },

        ready: function (callback) {

        },

        laod: function (callback) {

        },

        calc: function (elem, attributes) {

        },

        getText: function (elem) {

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

        dataField: function (elem) {

        }

    });

    Dom.implement({

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
    
    	},

    	on: function (eventName, handler) {
    
    	},

    	un: function (eventName, handler) {

    	},

    	once: function (eventName, handler) {

    	},

    	setStyle: function (name, value) {

    	},

    	getStyle: function (name) {

    	},

    	setAttr: function (name, value) {

    	},

    	getAttr: function (name, type) {

    	},

    	setHtml: function (name) {

    	},

    	getHtml: function () {

    	},

    	setText: function (name) {

    	},

    	getText: function () {

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

		// 以下方法由 jquery-style 提供。
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

})(jQuery);