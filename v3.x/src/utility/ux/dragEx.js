/**
 * @author xuld
 */

typeof include === "function" && include("drag");
typeof include === "function" && include("../dom/scrollIntoView");

/**
 * 自动滚动屏幕。
 * @param {Event} e 滚动的事件。
 * @param {Dom} [scrollParent=document] 滚动所在的容器。
 */
Draggable.prototype.autoScroll = function (e, scrollParent) {
    var me = this;
    me.dom.scrollIntoViewIfNeeded(false, scrollParent);
    me.endX = e.pageX;
    me.endY = e.pageY;
};

/**
 * 恢复节点位置。
 */
Draggable.prototype.revert = function () {
    var me = this;
    me.handle.off('mousedown', me.handlerMouseDown);
    me.dom.animate({
        left: me.startOffset.left + 'px',
        top: me.startOffset.top + 'px',
    }, function () {
        me.handle.on('mousedown', me.handlerMouseDown, me);
    });
};

/**
 * 设置当前拖动的步长。
 * @param {Number} value 拖动的步长。
 */
Draggable.prototype.setStep = function (value) {
    var me = this;
    me.endOffset.left = me.startOffset.left + parseInt((me.endOffset.left - me.startOffset.left) / value) * value;
    me.endOffset.top = me.startOffset.top + parseInt((me.endOffset.top - me.startOffset.top) / value) * value;
};

/**
 * 将当前值改在指定范围内。
 * @param {Rectangle} rect 限制的范围。
 */
Draggable.prototype.limit = function (rect) {
    var me = this,
        currentRect,
        delta;

    // 计算最新的位置。
    me.dom[0].style.left = me.endOffset.left + 'px';
    me.dom[0].style.top = me.endOffset.top + 'px';
    currentRect = me.dom.rect();

    if ((delta = currentRect.left - rect.left) < 0 || (delta = currentRect.left + currentRect.width - rect.left - rect.width) > 0) {
        me.endOffset.left -= delta;
    }

    if ((delta = currentRect.top - rect.top) < 0 || (delta = currentRect.top + currentRect.height - rect.top - rect.height) > 0) {
        me.endOffset.top -= delta;
    }

};
