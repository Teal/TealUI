

//#include core/class.js

var Dom = (function($){

	var Dom = Class.Native(function (nodelist) {
		if(nodelist) {
			var i = 0;
			while (nodelist[i])
				this[this.length++] = nodelist[i++];
		}
	}),
		div = document.createElement('div');

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
    		//assert.isString(tagName, 'Dom.create(tagName, className): {tagName} ~');
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
        	return 0;
        },

    	/**
		 * 特殊属性集合。
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
        propFix: {
        	innerText: 'innerText' in div ? 'innerText' : 'textContent'
        },

    	/**
		 * 获取文本时应使用的属性值。
		 * @private
	 	 * @static
		 */
        textFix: {},

        getText: function (elem) {
			
        },

        setText: function (elem, value) {
			
        },

        getStyle: $.css,

    	/**
		 * 显示元素的样式。
		 * @static
		 * @type Object
		 */
        displayFix: {
        	position: "absolute",
        	visibility: "visible",
        	display: "block"
        },

        styleNumber: function (elem, name) {
        	var value = parseFloat(elem.style[name]);
        	if (!value && value !== 0) {
        		value = parseFloat(Dom.getStyle(elem, name));

        		if (!value && value !== 0) {
        			if (name in styleFix) {

        				var styles = {};
        				for (var style in Dom.displayFix) {
        					styles[style] = elem.style[style];
        				}

        				Object.extend(elem.style, Dom.displayFix);
        				value = parseFloat(Dom.getStyle(elem, name)) || 0;
        				Object.extend(elem.style, styles);
        			} else {
        				value = 0;
        			}
        		}
        	}

        	return value;
        },

        styleString: function (elem, name) {
        	//assert.isElement(elem, "Dom.styleString(elem, name): {elem} ~");
        	return elem.style[name] || Dom.getStyle(elem, name);
        },

        movable: function (elem, name) {
        	//assert.isElement(elem, "Dom.movable(elem): 参数 elem ~");
        	if (!/^(?:abs|fix)/.test(Dom.styleString(elem, "position")))
        		elem.style.position = "relative";
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

        getDocument: function (node) {
        	//assert.isNode(node, 'Dom.getDocument(node): {node} ~', node);
        	return node.ownerDocument || node.document || node;
        },

        data: function (elem) {
        	return elem.$data || (elem.$data = {});
        }

    });

    Dom.implement({
    	
    	constructor: Dom,
    	
    	toString: Class.Base.prototype.toString,

    	/**
		 * 用于查找所有支持的伪类的函数集合。
		 * @private
	 	 * @static
		 */
    	pseudos: {

    		target: function (elem) {
    			var hash = window.location && window.location.hash;
    			return hash && hash.slice(1) === elem.id;
    		},

    		focus: function (elem) {
    			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
    		},

    		/**
			 * 判断一个节点是否有元素节点或文本节点。
			 * @param {Element} elem 要测试的元素。
			 * @return {Boolean} 如果存在子节点，则返回 true，否则返回 false 。
			 */
    		empty: function (elem) {
    			for (elem = elem.firstChild; elem; elem = elem.nextSibling)
    				if (elem.nodeType === 1 || elem.nodeType === 3)
    					return false;
    			return true;
    		},

    		contains: function (elem, args) {
    			return Dom.getText(elem).indexOf(args) >= 0;
    		},

    		/**
			 * 判断一个节点是否不可见。
			 * @return {Boolean} 如果元素不可见，则返回 true 。
			 */
    		hidden: function (elem) {
    			return (elem.style.display || getStyle(elem, 'display')) === 'none';
    		},
    		visible: function (elem) { return !this.hidden(elem); },

    		not: function (elem, args) { return !match(elem, args); },
    		has: function (elem, args) { return query(args, new Dom(elem)).length > 0; },

    		selected: function (elem) { return attrFix.selected.get(elem, 'selected', 1); },
    		checked: function (elem) { return elem.checked; },
    		enabled: function (elem) { return elem.disabled === false; },
    		disabled: function (elem) { return elem.disabled === true; },

    		input: function (elem) { return /^(input|select|textarea|button)$/i.test(elem.nodeName); },

    		"nth-child": function (args, oldResult, result) {
    			var t = Dom.pseudos;
    			if (t[args]) {
    				t[args](null, oldResult, result);
    			} else if (args = oldResult[args - 1])
    				result.push(args);
    		},
    		"first-child": function (args, oldResult, result) {
    			if (args = oldResult[0])
    				result.push(args);
    		},
    		"last-child": function (args, oldResult, result) {
    			if (args = oldResult[oldResult.length - 1])
    				result.push(args);
    		},
    		"only-child": function (elem) {
    			var p = new Dom(elem.parentNode).first(elem.nodeName);
    			return p && p.next();
    		},
    		odd: function (args, oldResult, result) {
    			var index = 0, elem, t;
    			while (elem = oldResult[index++]) {
    				if (args) {
    					result.push(elem);
    				}
    			}
    		},
    		even: function (args, oldResult, result) {
    			return this.odd(!args, oldResult, result);
    		}

    	},

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

    	on: $.fn.on || function (eventName, handler, context) {
    		//return this.bind(eventName, handler)
    	},

    	un: $.fn.off || function (eventName, handler) {

    	},

    	once: $.fn.one || function (eventName, handler) {

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

    	setHtml: $.fn.html || function (value) {
    		return iterateDom(this, Dom.setHtml, value);
    	},

    	getHtml: $.fn.html || function () {
			return Dom.getHtml(this[0]);
    	},

    	setText: function (value) {
    		return iterateDom(this, Dom.setText, value);
    	},

    	getText: $.fn.text || function () {
			return this.text();
    	},

    	setSize: function (value) {
    		var me = this;

    		if (value.x != null) me.setWidth(p.x - Dom.calc(me[0], 'bx+px'));

    		if (value.y != null) me.setHeight(p.y - Dom.calc(me[0], 'by+py'));

    		return me;
    	},

    	getSize: function () {
    		return {
    			x: this[0].offsetWidth,
    			y: this[0].offsetHeight
    		};
    	},

    	setWidth: function (value) {
    		return this.css('width', value);
    	},

    	getWidth: function () {
    		return Dom.styleNumber(this[0], 'width');
    	},

    	setHeight: function (value) {
    		return this.css('height', value);
    	},

    	getHeight: function () {
    		return Dom.styleNumber(this[0], 'height');
    	},

    	show: $.fn.show || function (value) {
    		
    	},

    	hide: $.fn.hide || function (value) {

		},

    	toggle: $.fn.toggle || function (value) {

    	},

    	unselectable: function () {
    
    	},

    	getScrollSize: function () {
    		var elem = this.node,
				x,
				y;

    		if (elem.nodeType !== 9) {
    			x = elem.scrollWidth;
    			y = elem.scrollHeight;
    		} else {
    			var body = elem.body;
    			elem = elem.documentElement;
    			x = Math.max(elem.scrollWidth, body.scrollWidth, elem.clientWidth);
    			y = Math.max(elem.scrollHeight, body.scrollHeight, elem.clientHeight);
    		}

    		return {x: x, y: y};
    	},

    	setScroll: function (value) {
    		if (value.x != null)
    			this.scrollLeft(value.x);
    		if (value.y != null)
    			this.scrollLeft(value.y);
    		return this;
    	},

    	getScroll: function () {
			return {x: this.scrollLeft(), y: this.scrollTop()}
    	},

    	setOffset: function (value) {
    		if (value.x != null)
    			this.css('left', value.x);
    		if (value.y != null)
    			this.css('top', value.x);
    		return this;
    	},

    	getOffset: function () {
    		var offset = this.position();
    		offset.x = offset.left;
    		offset.y = offset.top;
    		return offset;
    	},

    	setPosition: function (value) {
    		if (value.x != null)
    			value.left = value.x;
    		if (value.y != null)
    			value.top = value.x;
    		return this.offset(value);
    	},

    	getPosition: function () {
    		var offset = this.offset();
    		offset.x = offset.left;
    		offset.y = offset.top;
    		return offset;
    	},

    	child: function (index) {
    		var children = this.children();
    		return children.eq(index < 0 ? children.length + index : index);
    	},

    	find: function () {
    		return new Dom($.fn.find.apply(this, arguments).first());
    	},

    	query: function () {
    		return new Dom($.fn.find.apply(this, arguments));
    	},

    	match: $.fn.is,

    	isHidden: function () {
    		return (elem.style.display || Dom.getStyle(elem, 'display')) === 'none';
    	},

    	insert: function (newChild, refChild) {
    		this[0].insertBefore(newChild, refChild);
    		if (newChild.attach) {
    			newChild.attach(this, refChild);
    		}

    		return this;
    	},

    	has: $.fn.has || function (dom, allowSelf) {

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
