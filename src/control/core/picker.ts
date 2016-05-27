/**
 * @author  xuld
 */

typeof include === "function" && include("control
");
typeof include === "function" && include("formControl
");
typeof include === "function" && include("popover
");

/**
 * 表示一个填选框。
 * @abstract
 * @class
 * @extends FormControl
 * @remark
 * 填选框表示一个输入域。用户可以通过扩展的下拉菜单快速填写内容。
 * Picker 的默认实现要求：
 * menuRole 表示默认对应的角色。目标角色必须可以触发 select 事件，并提供 value 以供选择。
 */
var Picker = FormControl.extend({

    role: 'picker',

    /**
     * 设置当前填选框的菜单节点。
     * @type {String}
     */
    menu: null,

    /**
     * 设置菜单对应的控件。
     */
    menuRole: 'control',

    /**
     * 设置菜单的宽度。
     * @type {String}
     * @returns
     * 如果为百分数，则根据相对于当前表单的宽度。
     * 如果为 @null，则表示使用菜单的原始宽度。
     */
    menuWidth: null,

    /**
     * 设置是否允许自动弹出菜单。
     */
    autoPopover: false,

    /**
     * 当被子类重写时，负责获取当前选择器的按钮部分。
	 * @returns {Dom} 一个用于触发表单焦点的数据域。
     */
    getButton: function () {
        var me = this;
        // 如果当前控件本身就是 .x-button,button,input[type="button"]，则输入域为自身。
        // 否则在控件内部查找 .x-button,button,input[type="button"]。
        return Dom(me.button).valueOf() || (me.button = me.dom.find('.x-button,button,input[type="button"]'));
    },

    /**
     * 当被子类重写时，负责获取或设置当前输入框的值。
     * @param {String} [value] 要设置的文本。
     * @returns {mixed} this
	 * @virtual
     */
    value: function (value) {
        // 支持基于 <span> 存储当前选择项的组件。
        if (value !== undefined) {
            this.dom.find('span').text(value);
        }
        return FormControl.prototype.value.call(this, value);
    },

    /**
     * 当被子类重写时，负责获取或设置当前输入控件的状态。
     * @param {String} name 要设置的状态名。
     * @param {Boolean} [value=false] 要设置的状态值。
     * @returns {mixed} 返回 @this 或获取的状态值。
	 * @virtual
     */
    state: function (name, value) {
        value = value !== false;

        var me = this;

        // 获取属性。
        var state = FormControl.prototype.state.call(me, name, value);
        if (value === undefined) {
            return state;
        }

        // 设置属性时同时设置按钮的属性。
        me.getButton()
            .toggleClass('x-button-' + name.toLowerCase(), value)
            .attr(name, value || null);
        return me;
    },

    init: function () {

        var me = this;

        // 创建自定义下拉菜单。
        // 菜单可以由 menu 直接指定，或者紧跟着的 .x-popover，如果找不到则自动生成。
        me.menu = me.createMenu(Dom(me.menu).valueOf() || me.dom.next('.x-popover'));
        
        // 关闭默认的智能提示。
        var input = me.getInput().attr('autocomplete', 'off').on('input', function (e) {

            // 自动弹出菜单。
            if (me.autoPopover) {
                me.popover.show(e);
            }

            // 输入时更新菜单。
            if (!me.popover.isHidden(e)) {
                me.updateMenu(e);
            }

        });

        // 区分当前选择器的主要工作者是按钮还是输入框。
        var inputMode = me.inputMode = !input.is('[type="hidden"]') && !input.isHidden();

        // 实现下拉菜单效果。
        me.popover = me.menu.dom.role('popover', {
            event: inputMode ? "focus" : "click",
            target: inputMode ? input : me.dom,
            pinAlign: "bl",
            pinTarget: me.dom
        }).on('show', function (e) {
            me.state('actived', true);
            me.updateMenu(e);

            // 更新下拉菜单尺寸。
            if (me.menuWidth != null) {
                var width = parseFloat(me.menuWidth);
                me.popover.dom.rect({ width: /%$/.test(me.menuWidth) ? me.dom[0].offsetWidth * width / 100 : width });
            }

        }).on('hide', function (e) {
            me.state('actived', false);
        });

        // 绑定按钮。
        if (inputMode) {
            me.getButton().on('click', function () {
                me.getInput().focus();
            });
        }

        // 绑定键盘事件。
        me.popover.target.keyNav(me.keyBindings());

    },

    /**
     * 当被子类重写时，负责创建下拉菜单。
     * @param {Dom} menu 当前实际存在的菜单节点。
	 * @protected 
	 * @virtual
     */
    createMenu: function (menu) {
        var me = this;
        return menu.role(me.menuRole).on('select', function (e) {
            if (me.trigger('select', e)) {
                me.value(e.value);
                me.trigger('change');
                me.popover.hide();
            }
            // 由于即将关闭菜单，避免菜单更新导致的闪动。
            return false;
        });
    },

    /**
	 * 当被子类重写时，负责将当前文本的值同步到下拉菜单。
	 * @protected 
	 * @virtual
	 */
    updateMenu: function () {
        this.menu.value && this.menu.value(this.value());
    },

    /**
     * 获取当前输入框的键盘绑定。
     * @returns {Object} 返回各个绑定效果。 
     */
    keyBindings: function () {
        var me = this;

        // 实现绑定。
        var keyBindings = me.menu.keyBindings ? me.menu.keyBindings() : {};

        keyBindings.up = keyBindings.up || 0;
        keyBindings.down = keyBindings.down || 0;
        keyBindings.enter = keyBindings.enter || 0;

        for (var keyEvent in keyBindings) {
            (function (keyEvent) {
                var fn = keyBindings[keyEvent];
                keyBindings[keyEvent] = function (e) {
                    // 首先呼出菜单。
                    if (me.popover.isHidden()) {

                        // 回车仅在非文本框模式有效。
                        if (keyEvent === "enter" && me.inputMode) {
                            return;
                        }
                        me.popover.show();
                    } else {
                        fn && fn.call(keyBindings, e);
                    }
                    return false;
                };
            })(keyEvent);
        }

        keyBindings.esc = function (e) {
            me.popover.hide(e);
        };

        return keyBindings;
    }

});
