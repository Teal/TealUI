/**
 * @author  xuld
 */

// #require ../control/input
// #require ../control/dropDown
// #require ../control/base

/**
 * 表示一个数据选择器。
 * @abstract class
 * @extends Control
 */
var Picker = Input.extend({

    role: 'picker',

    /**
     * 设置下拉菜单的角色。
     */
    dropDownRole: 'popover',

    /**
     * 设置下拉菜单的宽度。如果为百分数，则根据目标节点自动调整。
     */
    dropDownWidth: '100%',

    /**
     * 设置当前选择器的菜单。
     */
    menu: null,

    init: function () {

        var me = this,

            // 获取输入框。
            input = me.input(),

            // 获取额外的按钮。
            button = me.button(),

            // 初始化下拉菜单。
            // 菜单可以由 menu 直接指定，或者紧跟着的 .x-popover，如果找不到则自动生成。
            dropDown = Dom(me.menu).valueOf() || me.dom.next('.x-popover');

        // 关闭默认的智能提示。
        input.attr('autocomplete', 'off');

        // 获取或创建下拉菜单。
        me.dropDown = dropDown = dropDown.role('popover', {
            event: 'focus',
            pinAlign: 'bl',
            target: input
        });

        // 绑定下拉按钮。
        button.on('click', function () {
            input[0] && input[0].focus();
        });
        
        dropDown.on('show', function (e) {
            me.realignDropDown(e);
            me.updateDropDown(e);
            me.state('actived', true);
            me.onDropDownShow && me.onDropDownShow(e);
        });

        dropDown.on('hide', function (e) {
            me.state('actived', false);
            me.onDropDownHide && me.onDropDownHide(e);
        });

        // 初始化自定义下拉菜单。
        me.initDropDown();

    },

    /**
     * 获取当前选择器的按钮部分。
     */
    button: function () {
        return this.dom.find('.x-button, button, input[type="button"]');
    },

    /**
     * 当被子类重写时负责初始化下拉菜单。
     */
    initDropDown: function () { },

    /**
	 * 当被子类重写时，负责更新下拉菜单的大小和位置。
	 * @protected 
	 * @virtual
	 */
    realignDropDown: function () {
        var me = this;

        // 更新下拉菜单尺寸。
        if (me.dropDownWidth) {
            me.dropDown.dom.rect({ width: /%$/.test(me.dropDownWidth) ? me.dom[0].offsetWidth * parseFloat(me.dropDownWidth) / 100 : parseFloat(me.dropDownWidth) });
        }
    },

    /**
	 * 当被子类重写时，负责将当前文本的值同步到下拉菜单。
	 * @protected 
	 * @virtual
	 */
    updateDropDown: function () { },

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

    /**
     * 设置当前输入控件的状态。
     * @param {String} name 状态名。
     * @param {Boolean} value=false 要设置的状态值。
     */
    state: function (name, value) {
        value = value !== false;
        var me = this;
        var result = Input.prototype.state.call(me, name, value);
        if (result === undefined) {
            return result;
        }
        me.button()
            .toggleClass(('x-button-' + name).toLowerCase(), value)
            .attr(name, value);
        return me;
    }

});
