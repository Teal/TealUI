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
        return Dom.find('.x-button', this.elem);
    },

    createDropDown: function (dropDown) {
        return Control.get(dropDown, 'dropDown', { target: me.getButton() });
    },

    /**
     * 当被子类重写时负责初始化下拉菜单。
     */
    initDropDown: function (dropDown) {},

    init: function () {

        // 初始化下拉菜单。
        var me = this,
            dropDown = me.elem.nextElementSibling;
        dropDown = dropDown && dropDown.classList.contains('x-dropdown') ? dropDown : Dom.append(document.body, '<div class="x-dropdown"></div>');
        me.dropDown = dropDown = me.createDropDown(dropDown);
        me.initDropDown(dropDown.elem);

        dropDown.onShow = function (e) {
            DropDown.prototype.onShow.call(this, e);
            me.realignDropDown();
            me.updateDropDown();
            me.onDropDownShow();
        };
        dropDown.onHide = function (e) {
            DropDown.prototype.onHide.call(this, e);
            me.onDropDownHide();
        };
    },

    /**
	 * 当被子类重写时，负责更新下拉菜单的位置。
	 * @protected 
	 * @virtual
	 */
    realignDropDown: function () {
        
        // 更新下拉菜单尺寸。
        if (this.dropDownWidth) {
            var width = /%$/.test(this.dropDownWidth) ? this.elem.offsetWidth * parseFloat(this.dropDownWidth) / 100 : parseFloat(this.dropDownWidth);
            Dom.setRect(this.dropDown.elem, { width: width });
        }

        // 更新下拉菜单位置。
        var rect = Dom.getRect(this.elem),
            doc = Dom.getDocument(this.elem),
            docRect = Dom.getRect(doc),
            dropDownHeight = this.dropDown.elem.offsetHeight;
        
        rect.top += rect.height;

        // 如果超出文档区域，则显示在另一侧。
        if (rect.top + dropDownHeight > docRect.top + docRect.height && rect.top - rect.height - dropDownHeight > docRect.top) {
            rect.top -= rect.height + dropDownHeight - 1;
        } else {
            rect.top--;
        }

        rect.width = rect.height = null;
        Dom.setRect(this.dropDown.elem, rect);

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
