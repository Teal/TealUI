/**
 * @author xuld
 */

// #require base
// #require ../dom/pin
// #require ../dom/animate

var DropDown = Control.extend({

    /**
     * 获取或设置当前下拉菜单的目标。
     */
    target: undefined,

    /**
     * 渐变显示的特效时间。
     */
    toggleDuration: 150,

    /**
     * 当前工具提示和目标文本的距离。
     */
    distance: -1,

    init: function () {
        this.target !== null && this.setDropDown(document.query(this.target) || this.elem.previousElementSibling);
    },

    /**
     * 设置指定元素的弹出菜单。
     */
    setDropDown: function (target) {
        this.target = target;
        target && target.on('click', this.toggle, this);
    },
    
    /**
     * 当被子类重写时，负责定义当前组件的显示方式。
     */
    onShow: function (e) {
        var me = this;
        me.elem.show('opacity', null, me.toggleDuration);
    },

    /**
     * 当被子类重写时，负责定义当前组件的隐藏方式。
     */
    onHide: function (e) {
        this.elem.hide('opacity', null, this.toggleDuration);
    },

    /**
     * 判断当前下拉菜单是否被隐藏。
     * @return {Boolean} 如果下拉菜单已经被隐藏，则返回 true。
     * @protected virtual
     */
    isHidden: function () {
        return this.elem.isHidden();
    },

    /**
     * 显示当前下拉菜单。
     * @return this
     */
    show: function (e) {
        
        if (this.isHidden() && this.onShow(e) !== false) {

            // 设置隐藏事件。
            document.on('mousedown', function (e) {
                
                // 不处理下拉菜单本身事件。
                if (!this.elem.contains(e.target)) {

                    // 如果在目标节点点击，则直接由目标节点调用 hide()。
                    if (!this.target || !this.target.contains(e.target)) {
                        this.hide();
                    }

                    // 确保当前事件只执行一次。
                    document.off('mousedown', arguments.callee);
                }

            }, this);

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
