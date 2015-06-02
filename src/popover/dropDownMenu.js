/**
 * @author xuld
 */

// #require ui/form/listbox.css
// #require ../dom/keyNav
// #require ui/core/listcontrol.js
// #require ui/core/idropdownowner.js

/**
 * 表示一个下拉菜单。用于 Suggest 和 ComboBox 组件。
 */
var DropDownMenu = DropDown.extend({

    init: function () {
        var me = this;
        DropDown.prototype.init.call(me);
        Dom.on(me.elem, 'mouseenter', 'li', function (e) {
            me.onItemHover(this, e);
        });
        Dom.on(me.elem, 'click', 'li', function(e) {
            me.onItemClick(this, e);
        });
    },

    setDropDown: function (target) {
        if (target) {
            var me = this;
            Dom.keyNav(target, {

                up: function (e) {
                    me.onPressUpDown(false, e);
                },

                down: function (e) {
                    me.onPressUpDown(true, e);
                },

                enter: function (e) {
                    me.onPressEnter(e);
                },

                esc: function () {
                    me.hide();
                },

                other: function (e) {
                    me.update(e);
                }

            });
        }
        return DropDown.prototype.setDropDown.call(this, target);
    },

    onShow: function (e) {
        this.onItemHover(this.elem.firstElementChild, e);
        this.update();
        DropDown.prototype.onShow.call(this, e);
    },

    /**
     * 当鼠标移到某一项时执行。
     */
    onItemHover: function (item, e) {
        var current = Dom.find('.x-listbox-selected', this.elem);
        current && current.classList.remove('x-listbox-selected');
        item && item.classList.add('x-listbox-selected');
    },

    /**
     * 当鼠标点击某一项时执行。
     */
    onItemClick: function (item, e) {
        e.preventDefault();
        this.selectItem(item);
        this.hide();
    },

    /**
	 * 当前目标按下上下按键时执行。
	 */
    onPressUpDown: function (isDown, e) {
        e.preventDefault();
        this.show();

        var current = Dom.find('.x-listbox-selected', this.elem);
        if (current) {
            current = isDown ? current.nextElementSibling : current.previousElementSibling;
        }
        if (!current) {
            current = isDown ? this.elem.firstElementChild : this.elem.lastElementChild;
        }

        this.onItemHover(current, e);
    },

    /**
	 * 当前目标按下回车时执行。
	 */
    onPressEnter: function (e) {
        if (!this.isHidden()) {
            e.preventDefault();
            this.onItemClick(Dom.find('.x-listbox-selected', this.elem));
        }
    },

    /**
	 * 模拟用户选择某一项。
	 */
    selectItem: function (item) {
        this.trigger('select', item);
        return this;
    },

    /**
     * 模拟用户更新当前菜单。
     */
    update: function() {
        this.trigger('update');
        return this;
    }

});
