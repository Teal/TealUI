/**
 * @fileOverview 所有控件的基类。
 * @author xuld
 */

// #require ../lang/class
// #require ../dom/base

/**
 * 表示一个控件。
 * @abstract
 * @class
 * @abstract
 */
var Control = Base.extend({

    /**
     * 获取当前组件的角色。
     * @type {String}
     * @example alert($("#elem").role().role)
     * @inner
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
     * 用于创建当前组件的模板。
     */
    tpl: '<div class="x-{role}"></div>',

    /**
     * 当被子类重写时，负责创建当前组件对应的 DOM 对象。
     * @returns {Dom} 返回新创建的 DOM 组件。
	 * @protected
	 * @virtual
     * @inner
     */
    create: function () {
        var result = Dom(this.tpl.replace(/{role}/g, this.role.toLowerCase()));
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

        var me = this;

        // 获取或创建 DOM 节点。
        dom = Dom(dom);
        if (!dom.length) {
            dom = me.create();
            me.created = true;
        }
        me.dom = dom;

        typeof console === "object" && console.assert(dom && dom.length === 1, "new Control(dom, options): control.dom 必须有且仅有一项");

        var opt = {};

        // 从 HTML 载入配置。
        for (var key = 0; key < dom[0].attributes.length; key++) {
            var attr = dom[0].attributes[key];
            var attrName = attr.name.toLowerCase();
            if (/^data-/.test(attrName) && attrName !== 'data-role') {
                opt[attrName.slice(5).replace(/-(\w)/, function (_, w) {
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

    ///**
    // * 设置当前组件的选项。
    // * @param {Object} options 要设置的选项。
    // * @returns this
    // */
    //set: function(options, initing) {
    //},

    toString: function () {
        return this.role;
    },

    /**
     * 将当前控件作为指定控件返回。
     * @returns {Control} 如果允许作为指定控件则返回相应控件，否则返回 @undefined。 
     */
    as: function (controlType) {
        var role = controlType.prototype.role;
        return this.dom.is(".x-" + role.toLowerCase()) ? this.dom.role(role) : Dom.data(this.dom[0], 'roles')[role];
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

///**
// * 创建一个节点属性。
// * @returns {} 
// */
//Control.prop = function (parser, defaultValue) {
//    parser = parser || function (value) { return value; };
//    var propValue;
//    return function (value) {
//        var me = this;
//
//        // 设置属性。
//        if (value !== undefined) {
//            propValue = parser.call(me, propValue);
//            return me;
//        }
//
//        // 获取默认属性。
//        if (propValue === undefined) {
//            propValue = defaultValue ? null : defaultValue.call(me);
//        }
//
//        // 返回属性。
//        return propValue;
//    };
//};

// 默认初始化一次页面全部组件。
Dom(function () {
    Dom("[data-role]").role();
});
