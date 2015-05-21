/**
 * @author xuld
 */

// #require dom/base.js
// #require dom/pin.js
// #require ui/core/base.js
// #require fx/animate.js

var Popover = Control.extend({

    /**
     * 工具提示显示之前经过的时间。
     * @type Integer
     */
    initialDelay: 100,

    /**
     * 当前工具提示和目标文本的距离。
     */
    distance: 10,

    init: function(options) {
        this.setPopover(Dom.find(options.target) || this.elem.previousElementSibling);
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
        var arrowDom = Dom.find('.x-arrow', this.elem);
        if (arrowDom) {
            for (var key in Popover._aligners) {
                if (arrowDom.classList.contains(Popover._aligners[key])) {
                    return key;
                }
            }
        }
        return null;
    },

    /**
     * 设置当前工具提示的位置。
     * @param {String} align 要设置的位置。可以是 null, 'top', 'bottom', 'center', 'right'。
     */
    setAlign: function (align) {
        var arrowDom = Dom.find('.x-arrow', this.elem);
        if (align) {
            (arrowDom || Dom.prepend(this.elem, '<i></i>')).className = 'x-arrow ' + Popover._aligners[align];
        } else {
            arrowDom && Dom.remove(arrowDom);
        }
        return this;
    },

    /**
     * 当被子类重写时，负责定义当前组件的显示方式。
     */
    onShow: function (e) {
        Dom.fadeIn(this.elem);

        var popoverRect = Dom.getRect(this.elem),
            targetRect = Dom.getRect(this.target),
            docRect = Dom.getRect(Dom.getDocument(this.elem)),
            align = this.getAlign();
        
        // 更新默认位置。
        if (this._align && this._align !== align) {
            this.setAlign(align = this._align);
            delete this._align;
        }

        // 重新更新位置。
        function doAlign(topOrLeft, widthOrHeight, heightOrWidth, leftOrTop, rightOrBottom, me, disallowReset) {

            var atRightOrBottom = align === rightOrBottom;

            // y 坐标直接居中即可。
            popoverRect[topOrLeft] = targetRect[topOrLeft] + targetRect[heightOrWidth] / 2 - popoverRect[heightOrWidth] / 2;

            // x 坐标在左边或右边。
            popoverRect[leftOrTop] = atRightOrBottom ? targetRect[leftOrTop] + targetRect[widthOrHeight] + me.distance : targetRect[leftOrTop] - popoverRect[widthOrHeight] - me.distance;
            
            // 如果超过屏幕则反转到另一半。
            if (!disallowReset && (atRightOrBottom ? popoverRect[leftOrTop] + popoverRect[widthOrHeight] > docRect[leftOrTop] + docRect[widthOrHeight] : popoverRect[leftOrTop] < docRect[leftOrTop])) {
                me._align = align;
                me.setAlign(align = atRightOrBottom ? leftOrTop : rightOrBottom);
                popoverRect = Dom.getRect(me.elem);
                doAlign(topOrLeft, widthOrHeight, heightOrWidth, leftOrTop, rightOrBottom, me, true);
            }

        }

        switch (align) {
            case null:
                if (e) {
                    popoverRect.left = e.pageX;
                    popoverRect.top = e.pageY + this.distance;
                    // 保证 left 介于屏幕左右之间。
                    popoverRect.left = Math.max(docRect.left, Math.min(popoverRect.left, docRect.right - popoverRect.width));
                    if (popoverRect.top > docRect.bottom - popoverRect.height) {
                        popoverRect.top = e.pageY - this.distance;
                    }
                }
                break;
            case 'top':
            case 'bottom':
                doAlign('left', 'height', 'width', 'top', 'bottom', this);
                break;
            case 'left':
            case 'right':
                doAlign('top', 'width', 'height', 'left', 'right', this);
                break;

        }

        popoverRect.width = popoverRect.height = null;
        Dom.setRect(this.elem, popoverRect);

    },

    /**
     * 当被子类重写时，负责定义当前组件的隐藏方式。
     */
    onHide: function (e) {
        Dom.fadeOut(this.elem);
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
