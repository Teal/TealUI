/**
 * @fileOverview 所有 UI 控件的基类。
 */

//#include ui/core/base.css
//#include core/class.js
//#include dom/base.js

/**
 * 表示一个 UI 控件。
 * @class
 * @abstract
 * 控件的生命周期：
 * constructor - 创建控件对应的 Javascript 类。不建议重写构造函数，除非你知道你在做什么。
 * create - 创建本身的 dom 节点。默认为解析 #tpl 对应的 HTML 字符串，返回相应原生节点。
 * init - 初始化控件本身。默认为空函数。
 * attach - 添加控件对应的节点到 DOM 树。不建议重写，如果一个控件封装了多个 DOM 节点则需重写本函数。
 * detach - 删除控件对应的节点。不建议重写，如果一个控件封装了多个 DOM 节点则需重写本函数。
 */
var Control = Base.extend({

    /**
	 * 当前 UI 组件对应的原生节点。
	 * @type {Element}
	 */
    elem: null,

    /**
	 * 当前 UI 组件的 css 类。
	 * @protected 
	 * @virtual
	 */
    cssClass: "x-control",

    /**
	 * 当前 UI 组件的 HTML 模板字符串。其中 x-control 会被替换为 cssClass 属性的值。
	 * @getter {String} tpl
	 * @protected 
	 * @virtual
	 */
    tpl: '<div class="{cssClass}" />',

    /**
	 * 当被子类重写时，生成当前控件对应的原生节点。
	 * @param {Object} options 选项。
     * @return {Element} 原生的 DOM 节点。
	 * @protected 
	 * @virtual
	 */
    create: function () {

        // 转为对 tpl解析。
        return Dom.parse(String.format(this.tpl, this));
    },

    /**
	 * 当被子类重写时，初始化当前控件。
	 * @param {Object} options 当前控件的初始化配置。
	 * @protected virtual
	 */
    init: Function.empty,

    attach: function (parentNode, refNode) {
    	Dom.render(this.elem, parentNode, refNode);
    },

    detach: function () {
    	Dom.remove(this.elem);
    },

	/**
	 * 初始化一个新的控件。
	 * @param {String/Element/Dom/Object} [options] 绑定的节点或节点 id 或完整的配置对象，用于初始化当前控件。
	 */
    constructor: function (options) {

    	// 这是所有控件共用的构造函数。
    	var me = this,

			// 临时的配置对象。
			opt = {},
    	    
			key,
			    
			value;

    	// 如果存在配置。
    	if (options) {

    		// 如果 options 是纯配置。
    	    if (options.constructor === Object) {

    	        // 将配置拷贝到 opt 对象。
    	        Object.extend(opt, options);

    	        me.elem = opt.elem = opt.elem ? Dom.find(opt.elem) : me.create(opt);

    		} else {

    			// 否则，尝试根据 options 找到节点。
    			me.elem = Dom.find(options);
    		}

    	} else {

    		me.elem = me.create(opt);
    	}

    	// 调用 init 初始化控件。
    	me.init(opt);

    	// 设置其它的各个选项。
    	for (key in opt) {
    	    value = opt[key];

    	    if (typeof me[key] === 'function') {
    	        me[key](value);
    	    } else {
    	        me[key] = value;
    	    }
    	}
    },

    renderTo: function (parent, refChild) {
        this.attach(Dom.find(parent), refChild ? Dom.find(refChild) : null);
    	return this;
    },

    remove: function () {
    	this.detach();
    	return this;
    }

});
