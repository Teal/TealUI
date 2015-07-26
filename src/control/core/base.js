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
	 * 当前控件对应的原生节点。
	 * @type {Dom}
	 */
    dom: null,

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
	 */
    constructor: function (dom, options) {

        // 绑定 DOM 节点。
        this.dom = Dom(dom);

        // 预处理所有选项。
        // 选项的可能情况：
        //  直接设置为当前属性。
        //  直接设置为事件绑定。
        //  不处理直接传递给 init。

        // 延时应用的选项。
        var delayedOptions, key, value;

        for (key in options) {
            value = options[key];
            switch (typeof this[key]) {

                case 'undefined':

                    // 自定义事件。
                    var match = /^on[a-z]/.exec(key);
                    if (match) {
                        try {
                            value = new Function("event", value);
                        } catch (e) { }
                        this.on(match[1], value);
                        continue;
                    }

                    break;
                case 'function':
                    delayedOptions = delayedOptions || {};
                    delayedOptions[match] = value;
                    continue;
                case 'object':
                    try {
                        value = JSON.parse(value);
                    } catch (e) { }
                    break;
                case 'number':
                    value = +value || 0;
                    break;
                case 'boolean':
                    value = !!value && !/^false|off|no|0$/i.test(value);
                    break;
            }

            this[key] = value;
        }

        // 调用初始化函数。
        this.init();

        // 设置相关值。
        for (key in delayedOptions) this[key](delayedOptions[key]);

    }

});

/**
 * 根据类名获取组件类型。
 */
Control.getControlTypeByName = function (roleName) {
    if (roleName) {
        roleName = roleName.replace(/^[a-z]/, function (w) {
            return w.toUpperCase();
        });
        roleName = Control[roleName] || window[roleName];
    }
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

    var data = Dom.data(elem),
        instance = (data.roles || (data.roles = {}))[roleName];

    // 已经初始化则不再初始化。
    if (!instance) {

        // 获取相应的组件类。
        var controlClass = Control.getControlTypeByName(roleName);

        // 从 DOM 载入配置。
        for (var i = 0; i < elem.attributes.length; i++) {
            var attr = elem.attributes[i];
            if (/^data-/i.test(attr.name) && attr.name !== 'data-role') {
                options = options || {};
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
$(function () {
    NodeList.each(document.querySelectorAll('[data-role]'), function (elem) {
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
$.prototype.role = function (roleName, options) {
    if (!this.length) {
        return null;
    }
    var result = Control.get(this[0], roleName, options);
    for (var i = 1; i < this.length; i++) {
        Control.get(this[i], roleName, options);
    }
    return result;
};

// 支持 Zepto
if ($.fn) {
    $.fn.role = $.prototype.role;
}