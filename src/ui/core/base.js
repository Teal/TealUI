/** * @author xuld */
include("core/class.js");
/**
 * 所有 UI 组件的基类。
 * @class Control
 * @abstract
 * 控件的生命周期：
 * constructor - 创建控件对应的 Javascript 类。不建议重写构造函数，除非你知道你在做什么。
 * create - 创建本身的 dom 节点。默认为解析 #tpl 对应的 HTML 字符串，返回相应原生节点。
 * init - 初始化控件本身。默认为空函数。
 * attach - 添加控件对应的节点到 DOM 树。不建议重写，如果一个控件封装了多个 DOM 节点则需重写本函数。
 * detach - 删除控件对应的节点。不建议重写，如果一个控件封装了多个 DOM 节点则需重写本函数。
 */
var Control = Class({

    /**
	 * 当前 UI 组件绑定的 Dom 对象。
	 * @type {Dom}
	 */
    dom: null,

    /**
	 * 用于标记控件的 css 类。
	 * @protected virtual
	 */
    cssClass: "ui-control",

    /**
	 * 当前控件的 HTML 模板字符串。
	 * @getter {String} tpl
	 * @protected virtual
	 */
    tpl: '<div class="ui" />',

    /**
	 * 当被子类重写时，生成当前控件对应的原生节点。
	 * @param {Object} options 选项。
     * @return {Element} 原生的 DOM 节点。
	 * @protected virtual
	 */
    create: function () {

        // 转为对 tpl解析。
        return Dom.parse(this.tpl.replace(/\bui\b/g, this.cssClass));
    },

    /**
	 * 当被子类重写时，初始化当前控件。
	 * @param {Object} options 当前控件的初始化配置。
	 * @protected virtual
	 */
    init: Function.empty,

    /**
	 * 设置当前输入域的状态, 并改变控件的样式。
     * @param {String} name 状态名。
     * @param {Boolean} value=false 要设置的状态值。
	 * @protected virtual
	 */
    state: function (name, value) {
        this.dom.toggleClass('x-' + this.xtype + '-' + name, value);
    },

    attach: function (parentNode, refNode) {
    
    },

    detach: function (parentNode) {

    },

    appendTo: function (parent) {
        
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

			// 当前实际的节点。
			node;

        // 如果存在配置。
        if (options) {

            // 如果 options 是纯配置。
            if (options.constructor === Object) {

                // 将配置拷贝到 opt 对象。
                Object.extend(opt, options);

                // 处理 node、selector、dom 字段
                if (opt.node) {
                    node = opt.node;
                    delete opt.node;
                } else if (opt.selector) {
                    node = Dom.find(opt.selector);
                    delete opt.selector;
                } else if (opt.dom) {
                    node = opt.dom;
                    delete opt.dom;
                }

                if (node) {
                    node = Dom.getNode(node);
                }

            } else {

                // 否则，尝试根据 options 找到节点。
                node = Dom.getNode(options);
            }

        }

        // 如果 node 被找到，则使用 node，否则使用 #create(opt)生成节点。
        me.node = node || me.create(opt);

        assert.isNode(me.node, "Dom#constructor(options): Dom 对象的 {node} 不是节点。", me.node);

        // 调用 init 初始化控件。
        me.init(opt);

        // 设置其它的各个选项。
        me.set(opt);
    }

});
