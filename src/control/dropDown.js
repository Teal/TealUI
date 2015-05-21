/**
 * @author xuld
 */

// #require base.js
// #require ../dom/animate.js

var DropDown = Control.extend({

    init: function (options) {
        this.setDropDown(Dom.find(options.target) || this.elem.previousElementSibling);
    },

    toggleDuration: 150,

    /**
     * 设置指定元素的弹出菜单。
     */
    setDropDown: function (target) {
        this.target = target;
        target && Dom.on(target, 'click', this.toggle.bind(this));
    },
    
    /**
     * 当被子类重写时，负责定义当前组件的显示方式。
     */
    onShow: function (e) {
        Dom.fadeIn(this.elem, this.toggleDuration);
    },

    /**
     * 当被子类重写时，负责定义当前组件的隐藏方式。
     */
    onHide: function (e) {
        Dom.fadeOut(this.elem, this.toggleDuration);
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
    show: function (e) {
        
        if (this.isHidden() && this.onShow(e) !== false) {

            // 设置隐藏事件。
            Dom.on(document, 'mousedown', function (e) {
                
                // 不处理下拉菜单本身事件。
                if (!this.elem.contains(e.target)) {

                    // 如果在目标节点点击，则直接由目标节点调用 hide()。
                    if (!this.target || !this.target.contains(e.target)) {
                        this.hide();
                    }

                    // 确保当前事件只执行一次。
                    Dom.off(document, 'mousedown', arguments.callee);
                }

            }.bind(this));

            this.trigger('show', e);

        }

        return this;
    },

    /**
     * 隐藏下拉菜单。
     * @return this
     */
    hide: function (e) {
        if (!this.isHidden() && this.onHide(e) !== false) {
            this.trigger('hide', e);
        }

        return this;
    },

    /**
     * 切换显示下拉菜单。
     * @return this
     */
    toggle: function (e) {
        return this.isHidden() ? this.show(e) : this.hide(e);
    }

});
