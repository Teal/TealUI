/**
 * @author xuld
 */

// #require ../control/base
// #require ../dom/pin
// #require ../dom/animate

var Popover = Control.extend({

    /**
     * 工具提示显示之前经过的时间。
     * @type Integer
     */
    initialDelay: 100,

    /**
     * 渐变显示的特效时间。
     */
    toggleDuration: 150,

    /**
     * 自动定位。
     */
    autoAlign: true,

    /**
     * 当前工具提示和目标文本的距离。
     */
    distance: 10,

    /**
     * 获取或设置当前浮层的目标。
     */
    target: undefined,

    init: function () {
        this.target !== null && this.setPopover(Dom.find(this.target) || this.elem.previousElementSibling);
    },

    /**
     * 设置指定元素的弹出菜单。
     */
    setPopover: function (target) {
        this.target = target;
        target && Dom.hover(target, this.show.bind(this), this.hide.bind(this), this.initialDelay);
    },

    /**
     * 获取当前工具提示的位置。
     */
    getAlign: function () {
        var classList = this.elem.classList, key;
        for (key in Popover._aligners) {
            if (classList.contains(Popover._aligners[key])) {
                return key;
            }
        }
        return null;
    },

    /**
     * 设置当前工具提示的位置。
     * @param {String} align 要设置的位置。可以是 null、'left'、'top'、'bottom'、'right'。
     */
    setAlign: function (align) {
        var classList = this.elem.classList;
        classList.remove(Popover._aligners[this.getAlign()]);
        if (align) {
            classList.remove('x-arrow');
        } else {
            classList.add('x-arrow');
            classList.add(Popover._aligners[align]);
        }
        return this;
    },

    /**
     * 当被子类重写时，负责定义当前组件的显示方式。
     */
    onShow: function (e) {
        Dom.show(this.elem, 'opacity', null, this.toggleDuration);

        // 自动定位逻辑。
        if (this.autoAlign) {
            var me = this,
                align = me.getAlign();

            // 恢复默认的定位。
            if (me._align && me._align !== align) {
                me.setAlign(align = me._align);
                delete me._align;
            }

            if (align) {
                Dom.pin(me.elem, this.target, align, me.distance, me.distance, function () {
                    me._align = align;
                    me.elem.className = me.elem.className.replace(/\bx-arrow-\w+\b/, 'x-arrow-' + align);
                });
            } else if (e) {
                Dom.pin(me.elem, e, 'bl', 0, me.distance * 2);
            }

        }


    },

    /**
     * 当被子类重写时，负责定义当前组件的隐藏方式。
     */
    onHide: function (e) {
        Dom.hide(this.elem, 'opacity', null, this.toggleDuration);
    },

    /**
     * 显示当前弹出层。
     * @return this
     */
    show: function (e) {
        this.onShow(e);
        this.trigger('show', e);
        return this;
    },

    /**
     * 隐藏当前弹出层。
     * @return this
     */
    hide: function (e) {
        this.onHide(e);
        this.trigger('hide', e);
        return this;
    }

});

Popover._aligners = {
    'top': 'x-arrow-bottom',
    'bottom': 'x-arrow-top',
    'right': 'x-arrow-left',
    'left': 'x-arrow-right'
};
