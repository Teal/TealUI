/**
 * @author xuld
 */

//#require dom/base.js
//#require dom/pin.js
//#require ui/core/base.js
//#require fx/animate.js

var Popover = Control.extend({

    role: 'popover',

    init: function(options) {
        options.target && this.setPopover(Dom.find(options.target));
    },

    /**
     * 设置指定元素的弹出菜单。
     */
    setPopover: function (target) {
        this.target = target;
        Dom.hover(target, this.show.bind(this), this.hide.bind(this));
    },
    
    /**
     * 当被子类重写时，负责定义当前组件的显示方式。
     */
    onShow: function () {
        Dom.fadeIn(this.elem);
    },

    /**
     * 当被子类重写时，负责定义当前组件的隐藏方式。
     */
    onHide: function () {
        Dom.fadeOut(this.elem);
    },

    /**
     * 显示当前弹出层。
     * @return this
     */
    show: function () {
        this.onShow();
        this.trigger('show');
        return this;
    },

    /**
     * 隐藏当前弹出层。
     * @return this
     */
    hide: function () {
        this.onHide();
        this.trigger('hide');
        return this;
    }

});
