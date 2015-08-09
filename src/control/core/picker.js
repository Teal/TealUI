/**
 * @author  xuld
 */

// #require ../control/base
// #require ../control/input
// #require ../control/popover

/**
 * 表示一个数据填选器。
 * @abstract
 * @class
 * @extends Input
 * @remark
 * 数据填选器表示一个输入域。用户可以通过扩展的下拉菜单快速填写内容。
 * Picker 的默认实现要求：
 * dropDownRole 表示默认对应的角色。目标角色必须可以触发 select 事件，并提供 value 以供选择。
 */
var Picker = Input.extend({

    role: 'picker',

    /**
     * 设置当前菜单。
     */
    menu: null,

    /**
     * 设置菜单对应的控件。
     */
    dropDownRole: 'popover',

    /**
     * 设置下拉菜单的宽度。
     * @returns
     * 如果为百分数，则根据相对于输入域的宽度。
     * 如果为 @null，则表示使用菜单的原始宽度。
     */
    dropDownWidth: '100%',

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

    init: function () {

        var me = this;

        // 创建自定义下拉菜单。
        me.dropDown = me.initDropDown(Dom(me.menu).valueOf() || me.dom.next('.x-popover'));
        if (me.dropDown.created) {
            me.dom.parent().append(me.dropDown.dom);
        }

        // 关闭默认的智能提示。
        var input = me.getInput().attr('autocomplete', 'off').on('input', function (e) {
            if (!me.popover.isHidden(e)) {
                me.updateDropDown(e);
            }
        });

        // 区分当前选择器的主要工作者是按钮还是输入框。
        // 绑定下拉按钮。
        if ((me.inputMode = !input.is('[type="hidden"]') && !input.isHidden())) {
            me.getButton().on('click', function () {
                me.getInput().focus();
            });
        }

        // 获取或创建下拉菜单。
        // 菜单可以由 menu 直接指定，或者紧跟着的 .x-popover，如果找不到则自动生成。
        me.popover = me.dropDown.dom.role('popover', {
            event: me.inputMode ? "focus" : "click",
            target: me.inputMode ? input : me.dom,
            pinAlign: "bl",
            pinTarget: me.dom
        }).on('show', function (e) {
            me.state('actived', true);
            me.updateDropDown(e);
            me.onDropDownShow && me.onDropDownShow(e);
            me.realignDropDown(e);
        }).on('hide', function (e) {
            me.state('actived', false);
            me.onDropDownHide && me.onDropDownHide(e);
        });

        // 绑定键盘事件。
        me.popover.target.keyNav(me.keyBindings());

    },

    /**
     * 当被子类重写时，负责获取或设置当前输入框的值。
     * @param {String} [value] 要设置的文本。
     * @returns {mixed} this
	 * @protected 
	 * @override
     */
    value: function (value) {
        // 支持基于 <span> 存储当前选择项的组件。
        if (value !== undefined) {
            this.dom.find('span').text(value);
        }
        return Input.prototype.value.call(this, value);
    },

    /**
     * 设置当前输入控件的状态。
     * @param {String} name 状态名。
     * @param {Boolean} [value=true] 要设置的状态值。
     */
    state: function (name, value) {
        value = value !== false;
        var me = this;
        var result = Input.prototype.state.call(me, name, value);
        if (result === undefined) {
            return result;
        }
        me.getButton()
            .toggleClass('x-button-' + name.toLowerCase(), value)
            .attr(name, value);
        return me;
    },

    /**
     * 当被子类重写时，负责初始化下拉菜单。
	 * @protected 
	 * @virtual
     */
    initDropDown: function (menu) {
        var me = this;
        return menu.role(this.dropDownRole).on('select', function (e) {
            if (me.trigger('select', e)) {
                me.value(e.value);
                me.trigger('change');
                me.popover.hide();
            }
            // 由于即将关闭菜单，避免界面更新。
            return false;
        });
    },

    /**
	 * 当被子类重写时，负责更新下拉菜单的大小和位置。
	 * @protected 
	 * @virtual
	 */
    realignDropDown: function () {
        var me = this;
        // 更新下拉菜单尺寸。
        if (me.dropDownWidth != null) {
            var width = parseFloat(me.dropDownWidth);
            me.popover.dom.rect({ width: /%$/.test(me.dropDownWidth) ? me.dom[0].offsetWidth * width / 100 : width });
        }
    },

    /**
	 * 当被子类重写时，负责将当前文本的值同步到下拉菜单。
	 * @protected 
	 * @virtual
	 */
    updateDropDown: function () {
        this.dropDown.value(this.value());
    },

    /**
     * 获取当前输入框的键盘绑定。
     * @returns {} 
     */
    keyBindings: function () {
        var me = this;
        var keyBindings = me.dropDown.keyBindings();

        function showPopover() {
            if (me.popover && me.popover.isHidden()) {
                me.popover.show();
                return true;
            }
        }

        return {
            up: function () {
                showPopover() || keyBindings.up();
            },
            down: function () {
                showPopover() || keyBindings.down();
            },
            enter: function () {
                if (!me.popover.isHidden()) {
                    keyBindings.enter();
                } else if (!me.inputMode) {
                    showPopover();
                }
            },
            esc: function () {
                me.popover.hide();
            }
        };
    }

    ///**
    // * 当下拉菜单被显示时执行。
    // * @protected override
    // */
    //onDropDownShow: function (e) {},

    ///**
    // * 当下拉菜单被隐藏时执行。
    // * @protected override
    // */
    //onDropDownHide: function() {

    //},

});
