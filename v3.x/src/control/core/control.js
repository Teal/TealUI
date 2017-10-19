/**
 * @fileOverview 所有控件的基类。
 * @author xuld
 */

typeof include === "function" && include("../lang/class");
typeof include === "function" && include("../../utility/dom/dom");

/**
 * 表示一个控件。
 * @abstract
 * @class
 */
var Control = Base.extend({

    /**
     * 获取当前组件的角色。
     * @type {String}
     * @example alert($("#elem").role().role)
     */
    role: "control",

    /**
	 * 获取当前控件对应的 DOM 对象。
	 * @type {Dom}
	 * @example $("#elem").role().dom.html()
	 */
    dom: null,

    /**
     * 当前组件涉及动画的特效时间。如果值为 0 则不使用特效。 
     */
    duration: 100,

    /**
     * 判断当前控件是否是自动生成的。
     */
    generated: false,

    /**
     * 用于创建当前组件的模板。
     */
    tpl: '<div class="x-{role}" x-role="{role}" x-generated="true"></div>',

    /**
     * 当被子类重写时，负责创建当前组件对应的 DOM 对象。
     * @returns {Dom} 返回新创建的 DOM 组件。
	 * @protected
	 * @virtual
     */
    create: function () {
        var result = Dom(this.tpl.replace(/\{role\}/g, this.role));
        var body = document.body;
        body ? Dom(body).append(result) : Dom(function () {
            result.appendTo(document.body, true);
        });
        return result;
    },

    /**
	 * 当被子类重写时，负责初始化当前控件。
	 * @protected
	 * @virtual
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

        var me = this;

        // 获取或创建 DOM 节点。
        me.dom = dom = Dom(dom).valueOf() || me.create();

        typeof console === "object" && console.assert(dom && dom.length === 1, "new Control(dom, options): control.dom 必须有且仅有一项");

        var opt = {};

        // 从 HTML 载入配置。
        for (var key = 0; key < dom[0].attributes.length; key++) {
            var attr = dom[0].attributes[key];
            var attrName = attr.name.toLowerCase();
            if (/^x-/.test(attrName) && attrName !== 'x-role') {
                opt[attrName.slice(2).replace(/-(\w)/, function (_, w) {
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
                        if (typeof value === "string") {
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

    /**
     * 将当前控件作为指定控件返回。
     * @returns {Control} 如果允许作为指定控件则返回相应控件，否则返回 @undefined。 
     */
    as: function (controlType) {
        var role = controlType.prototype.role;
        return this.dom.is(".x-" + role) ? this.dom.role(role) : Dom.data(this.dom[0], 'roles')[role];
    },

    /**
     * 返回当前控件的字符串形式。
     * @returns {String} 返回当前控件的字符串形式。
     */
    toString: function () {
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
    Dom("[x-role]").role();
});
