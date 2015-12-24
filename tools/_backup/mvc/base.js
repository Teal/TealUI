/**
 * @fileOverview 所有控件的基类。
 */

// #require ../../utility/lang/class.js
// #require ../dom/base.js

/**
 * 表示一个控件。
 * @class
 * @abstract
 */
var Control = Base.extend({

    /**
	 * 当前控件对应的原生节点。
	 * @type {Element}
	 */
    elem: null,

    /**
     * 当前控件的角色。
	 * @type {String}
     */
    role: null,

    /**
	 * 当被子类重写时，负责初始化当前控件。
	 * @protected
	 * @virtual
	 */
    init: function () { },

    /**
	 * 初始化一个新的控件。
	 * @param {Element} elem 绑定当前控件的节点。
	 * @param {Object} [options] 初始化控件的相关选项。
	 */
    constructor: function (elem, options) {

        // 绑定 DOM 节点。
        this.elem = elem;

        // 预处理所有选项。
        // 选项的可能情况：
        //  直接设置为当前属性。
        //  直接设置为事件绑定。
        //  直接调用 setXXX。
        //  不处理直接传递给 init。

        // 延时应用的选项。
        var delayedOptions, key, value;

        for (key in options) {
            value = options[key];
            switch (typeof this[key]) {

                // 自定义配置。
                case 'undefined':

                    // 绑定事件。
                    var match = /^on(\w+)$/.exec(key);
                    if (match) {
                        try {
                            this.on(match[1], new Function("event", newValue));
                        } catch (e) { }
                    }

                    // 执行 setter
                    match = 'set' + key.replace(/^\w/, function (w) {
                        return w.toUpperCase();
                    });
                    if (this[match] instanceof Function) {
                        delayedOptions = delayedOptions || {};
                        delayedOptions[match] = value;
                        continue;
                    }

                    break;
                case 'object':
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                    }
                    break;
                case 'number':
                    value = +value || 0;
                    break;
                case 'boolean':
                    value = !/^false|off|no|0$/i.test(value);
                    break;
                case 'function':
                    delayedOptions = delayedOptions || {};
                    delayedOptions[match] = value;
                    break;
            }

            this[key] = value;
        }

        // 调用初始化函数。
        this.init(options || {});

        // 最后延时申请。
        for (key in delayedOptions) {
            this[key](delayedOptions[key]);
        }

    }

});

/**
 * 根据类名获取组件类型。
 */
Control.getControlTypeByName = function (roleName) {
    roleName = window[roleName.replace(/^[a-z]/, function (w) {
        return w.toUpperCase();
    })];
    return roleName && roleName.constructor === Function ? roleName : Control;
};

/**
 * 获取指定元素绑定的控件实例。
 * @param {Element} elem 要获取的元素。
 * @param {String?} roleName 指定初始化的控件名。
 */
Control.get = function (elem, roleName, options) {

    // 默认根据 data-role 指定角色名。
    roleName = roleName || elem.getAttribute('data-role');

    var data = Dom.getData(elem),
        instance = (data.roles || (data.roles = {}))[roleName];

    // 已经初始化则不再初始化。
    if (!instance) {

        // 获取相应的组件类。
        var controlClass = Control.getControlTypeByName(roleName);

        // 生成组件配置项。
        options = options || {};

        // 从 DOM 载入配置。
        for (var i = 0; i < elem.attributes.length; i++) {
            var attr = elem.attributes[i];
            if (/^data-/i.test(attr.name) && attr.name !== 'data-role') {
                options[attr.name.substr('data-'.length).replace(/-(\w)/, function (_, w) {
                    return w.toUpperCase();
                })] = attr.value;
            }
        }

        // 创建组件实例。
        data.roles[roleName] = instance = new controlClass(elem, options);

    }

    return instance;
};

// 默认初始化一次页面全部组件。
Dom.ready(function () {
    Dom.each(document.querySelectorAll('[data-role]'), function (elem) {
        Control.get(elem);
    });
});

/**
 * 初始化一个或多个控件。
 * @param {String} roleName 要初始化的角色类型。
 * @example
 * $().role('toolTip'); // 将所有 DOM 节点初始化为 ToolTip 控件，并返回第一个控件实例。
 * $().role(); // 将所有 DOM 节点初始化为控件，控件类型根据 DOM 的 data-role 属性指定，并返回第一个控件实例。
 */
$.prototype.role = function (roleName) {
    if (!this.length) {
        return null;
    }
    var result = Control.get(this[0], roleName);
    for (var i = 1; i < this.length; i++) {
        Control.get(this[i], roleName);
    }
    return result;
};

// 支持 jQuery & Zepto
if ($.fn) $.fn.role = $.prototype.role;
