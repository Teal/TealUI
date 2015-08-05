/**
 * @fileOverview 所有控件的基类。
 * @author xuld
 */

// #require ../lang/class
// #require ../dom/base

/**
 * 表示一个控件。
 * @class
 * @abstract
 */
var Control = Base.extend({

    /**
     * 获取当前组件的角色。
     * @type {String}
     * @example alert($("#elem1").role().role)
     * @inner
     */
    role: "control",

    /**
	 * 获取当前控件对应的 DOM 对象。
	 * @type {Dom}
	 * @example $("#elem1").role().dom.html()
	 */
    dom: null,

    /**
     * 当前组件涉及动画的特效时间。如果值为 0 则不使用特效。 
     */
    duration: 150,

    /**
     * 当前组件的初始化模板。
     */
    tpl: '<div class="x-{role}"></div>',

    /**
     * 当被子类重写时，负责创建 DOM 对象。
	 * @protected
	 * @virtual
     * @inner
     */
    create: function () {
        var me = this;
        var result = me.created = Dom(me.tpl.replace(/{role}/g, me.role.toLowerCase()));
        if (document.body) {
            Dom(document.body).append(result);
        } else {
            Dom(function () {
                result.appendTo(document.body, true);
            });
        }
        return result;
    },

    /**
	 * 当被子类重写时，负责初始化当前控件。
	 * @protected
	 * @virtual
     * @inner
	 */
    init: function () { },

    /**
	 * 初始化一个新的控件。
	 * @param {Dom} dom 绑定当前控件的节点。
	 * @param {Object} [options] 初始化控件的相关选项。
	 * @constructor
     * @example new Control("#id")
	 */
    constructor: function Control(dom, options) {

        // 创建 DOM 节点。
        dom = Dom(dom);
        if (!dom.length) {
            dom = this.create();
        }
        this.dom = dom;

        typeof console === "object" && console.assert(dom && dom[0], "new Control: control.dom 不能为空");

        var opt = {};

        // 从 HTML 载入配置。
        for (var i = 0; i < dom[0].attributes.length; i++) {
            var attr = dom[0].attributes[i],
                attrName = attr.name.toLowerCase();
            if (/^data-/.test(attrName) && attrName !== 'data-role') {
                opt[attrName.substr(5).replace(/-(\w)/, function (_, w) {
                    return w.toUpperCase();
                })] = attr.value;
            }
        }

        // 从 options 载入配置。
        for (var key in options) {
            opt[key] = options[key];
        }

        // 应用配置。
        for (var key in opt) {
            var value = opt[key];
            switch (typeof this[key]) {
                case 'undefined':
                    // 自定义事件。
                    var match = /^on[a-z]/.exec(key);
                    if (match) {
                        if (value != null && value.constructor == String) {
                            try {
                                value = new Function("event", value);
                            } catch (e) { }
                        }
                        this.on(match[1], value);
                        delete opt[key];
                        continue;
                    }
                    break;
                case 'object':
                    try {
                        value = JSON.parse(value);
                    } catch (e) { }
                    break;
                case "number":
                    value = +value || 0;
                    break;
                case 'boolean':
                    value = !!value && !/^false|off|no|0$/i.test(value);
                    break;
                case 'function':
                    continue;
            }
            this[key] = value;
            delete opt[key];
        }

        // 调用初始化函数。
        this.init();

        // 剩下的函数直接调用。
        for (var key in opt) {
            this[key](opt[key]);
        }
    },

    toString: function() {
        return this.role;
    }

});

/**
 * 定义一个组件类型。
 * @param {Object} prototype 子类实例成员列表。
 * @example 
 * Control.extend({
 *      role: "myButton",
 *      init: function(){
 *          this.dom.html('text');
 *      }
 * })
 */
Control.extend = function (prototype) {
    var clazz = Base.extend.call(this, prototype);
    var role = clazz.prototype.role;
    if (role) {
        Dom.roles[role] = clazz;
    }
    return clazz;
};

// 默认初始化一次页面全部组件。
Dom(function () {
    Dom("[data-role]").role();
});
