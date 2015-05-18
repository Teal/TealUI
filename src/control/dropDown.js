/**
 * @author xuld
 */

//#require dom/base.js
//#require dom/pin.js
//#require ui/core/base.js
//#require fx/animate.js

var DropDown = Control.extend({

    role: 'dropDown',

    init: function(options) {
        options.target && this.setDropDown(Dom.find(options.target));
    },

    /**
     * 设置指定元素的弹出菜单。
     */
    setDropDown: function (target) {
        this.target = target;
        Dom.on(target, 'click', this.toggle.bind(this));
    },
    
    /**
     * 当被子类重写时，负责定义当前组件的显示方式。
     */
    onShow: function () {
        Dom.fadeIn(this.elem);
        //var me = this;

        //// 如果是因为 DOM 事件而切换菜单，则测试是否为 disabled 状态。
        //if (!e || !Dom.getAttr(me.elem, 'disabled') && !Dom.getAttr(me.elem, 'readonly')) {

        //    // 如果下拉菜单被隐藏，则先重设大小、定位。
        //    if (me.isDropDownHidden()) {
        //        Dom.show(me.dropDownNode);
        //    }

        //    me.onDropDownShow();

        //    // 重新修改宽度。

        //    // 重新设置位置。
        //    if (!me.isDropDownHidden()) {
        //        var dropDown = me.dropDownNode,
        //			dropDownWidth = me.dropDownWidth;

        //        if (dropDownWidth < 0) {

        //            // 在当前目标元素的宽、下拉菜单的 min-width 属性、下拉菜单自身的宽度中找一个最大值。
        //            dropDownWidth = Math.max(Dom.getSize(me.elem).x, Dom.styleNumber(dropDown, 'min-width'), Dom.getScrollSize(dropDown).x);

        //        }

        //        if (dropDownWidth !== 'auto') {
        //            Dom.setSize(dropDown, { x: dropDownWidth });
        //        }

        //        // 设置 mouseup 后自动隐藏菜单。
        //        Dom.on(document, 'mouseup', me.hideDropDown, me);

        //        Dom.pin(dropDown, me.elem, 'b', 0, -1);
        //    }

        //}

    },

    /**
     * 当被子类重写时，负责定义当前组件的隐藏方式。
     */
    onHide: function (e) {
        Dom.fadeOut(this.elem);
    },

    /**
     * 判断当前下拉菜单是否被隐藏。
     * @return {Boolean} 如果下拉菜单已经被隐藏，则返回 true。
     * @protected virtual
     */
    isHidden: function () {
        return Dom.isHidden(this.elem);
    },

    /**
     * 显示当前下拉菜单。
     * @return this
     */
    show: function () {
        
        if (this.isHidden() && this.onShow() !== false) {
            var me = this;

            // 设置隐藏事件。
            Dom.on(document, 'mousedown', function (e) {
                
                // 不处理下拉菜单本身事件。
                if (!me.elem.contains(e.target)) {

                    // 如果在目标节点点击，则直接由目标节点调用 hide()。
                    if (!me.target || !me.target.contains(e.target)) {
                        me.hide();
                    }

                    // 确保当前事件只执行一次。
                    Dom.off(document, 'mousedown', arguments.callee);
                }

            });

            this.trigger('show');

        }

        return this;
    },

    /**
     * 隐藏下拉菜单。
     * @return this
     */
    hide: function () {
        if (!this.isHidden() && this.onHide() !== false) {
            this.trigger('hide');
        }

        return this;
    },

    /**
     * 切换显示下拉菜单。
     * @return this
     */
    toggle: function () {
        return this.isHidden() ? this.show() : this.hide();
    }

});
