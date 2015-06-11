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
    
    dropDownWidth: '100%',

    /**
     * 获取当前选择器的按钮部分。
     */
    getButton: function() {
        return this.elem.querySelector('.x-button');
    },

    /**
     * 当被子类重写时负责创建下拉菜单。
     */
    createDropDown: function (dropDown) {
        return Control.get(dropDown, 'dropDown', { target: this.getButton() });
    },

    /**
     * 当被子类重写时负责初始化下拉菜单。
     */
    initDropDown: function () {},

    init: function () {

        // 初始化下拉菜单。
        var me = this,
            dropDown = me.elem.nextElementSibling;
        dropDown = dropDown && dropDown.classList.contains('x-dropdown') ? dropDown : document.body.append('<div class="x-dropdown"></div>');
        me.dropDown = dropDown = me.createDropDown(dropDown);
        me.initDropDown();

        dropDown.on('show', function() {
            me.realignDropDown();
            me.updateDropDown();
            me.onDropDownShow();
        });

        dropDown.on('hide', function () {
            me.onDropDownHide();
        });

    },

    realignDropDown: function() {
        var me = this;

        // 更新下拉菜单尺寸。
        if (me.dropDownWidth) {
            var width = /%$/.test(me.dropDownWidth) ? me.elem.offsetWidth * parseFloat(me.dropDownWidth) / 100 : parseFloat(me.dropDownWidth);
            me.dropDown.elem.setSize({ width: width });
        }

        me.dropDown.elem.pin(me.elem, 'bl', 0, me.distance);
    },

    /**
	 * 当被子类重写时，负责将当前文本的值同步到下拉菜单。
	 * @protected 
	 * @virtual
	 */
    updateDropDown: function () {},

    /**
     * 当下拉菜单被显示时执行。
     * @protected override
     */
    onDropDownShow: function () {
        this.setState('actived', true);
    },

    /**
     * 当下拉菜单被隐藏时执行。
     * @protected override
     */
    onDropDownHide: function () {
        this.setState('actived', false);
    },
    
    /**
     * 设置当前输入控件的状态。
     * @param {String} name 状态名。
     * @param {Boolean} value=false 要设置的状态值。
     */
    setState: function (name, value) {
        value = value !== false;
        Input.prototype.setState.call(this, name, value);
        this.getButton().classList[value ? 'add' : 'remove'](('x-button-' + name).toLowerCase());
        this.getButton()[name] = value;
        return this;
    }
	
});
