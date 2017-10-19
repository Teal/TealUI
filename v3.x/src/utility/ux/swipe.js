/**
 * @author xuld
 */

typeof include === "function" && include("base.js");

/**
 * 创建一个新的可滑动区域。
 * @param {Element} elem 要拖动的元素。
 * @param {Object} options 用户覆盖可拖动对象的配置。
 */
function Swippable(elem, options) {

    var me = this;

    me.elem = elem;

    // 使用用户自定义配置覆盖默认配置。
    for (var key in options) {
        me[key] = options[key];
    }

    me.elem.on('mousedown', me.handlerMouseDown, me);

}

Swippable.prototype = {
    constructor: Swippable,

    /**
     * 设置当前拖动的节点。
     */
    elem: null,

    /**
     * 当前滑动的状态。0：未滑动；1：水平滑动；2：垂直滑动。
     */
    state: 0,

    /**
     * 产生滑动事件的最少步长。
     */
    step: 10,

    /**
     * 区分垂直滑动或水平滑动的角度。
     */
    ratio: .5,

    longTapTimeout: 1000,

    /**
     * 处理 mousedown 事件。
     * 初始化拖动，当单击时，执行这个函数，但不触发 dragStart。
     * 只有鼠标移动时才会继续触发 dragStart。
     * @param {Event} e 事件参数。
     */
    handlerMouseDown: function (e) {

        // 只处理左键拖动。
        if (e.which === 1) {

            var me = this;

            me.state = 0;
            me.startX = e.pageX;
            me.startY = e.pageY;

            // 绑定拖动和停止拖动事件。
            var doc = me.elem.ownerDocument;
            doc.on('mouseup', me.handlerMouseUp, me);
            doc.on('mousemove', me.handlerMouseMove, me);

            // 开始监听长时间按住时间。
            if (me.onLongTap || me.onShortTap) {
                me.longTapTimer = setTimeout(function () {
                    if (me.state === 0) {
                        me.handlerMouseUp(e);
                        me.onLongTap && me.onLongTap(e);
                        me.longTapTimer = 0;
                    }
                }, me.longTapTimeout);
            }

        }

    },

    /**
     * 处理 mousemove 事件。
     * @param {Event} e 事件参数。
     */
    handlerMouseMove: function (e) {

        var me = this;

        me.endX = e.pageX;
        me.endY = e.pageY;

        if (me.state === 0) {

            var deltaX = me.endX - me.startX,
                deltaY = me.endY - me.startY;

            // 滑动范围太小，忽略滑动。
            if (deltaX * deltaX + deltaY * deltaY < me.step * me.step) {
                return;
            }

            // 开始进入滑动状态。
            me.state = Math.abs(deltaY / deltaX) < me.ratio ? 1 : 2;

            // 开始滑动事件。
            me.onSwipeStart && me.onSwipeStart(e);

        } else {
            me.onSwipeMove && me.onSwipeMove(e);
        }

    },

    /**
     * 处理 mouseup 事件。
     * @param {Event} e 事件参数。
     * 这个函数调用 onDragEnd 和 afterDrag
     */
    handlerMouseUp: function (e) {

        // 只有鼠标左键松开， 才认为是停止拖动。
        if (e.which === 1) {

            var me = this;

            // 绑定拖动和停止拖动事件。
            var doc = me.elem.ownerDocument;
            doc.off('mousemove', me.handlerMouseMove);
            doc.off('mouseup', me.handlerMouseUp);

            if (me.state === 0) {
                if (me.longTapTimer) {
                    clearTimeout(me.longTapTimer);
                    me.longTapTimer = 0;
                    me.onShortTap && me.onShortTap(e);
                }
                me.onTap && me.onTap(e);
            } else {
                me.onSwipeEnd && me.onSwipeEnd(e);
            }

        }

    }

};

/**
 * 滑动元素事件。
 * @param {Element} elem 滑动的元素。
 * @param {Options} options 各个方向滑动的处理函数。
 */
Element.prototype.setSwippable = function (options) {
    var data = Element.getData(this);
    return data.swippable || (data.swippable = new Swippable(this, options));
};
