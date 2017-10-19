/**
 * @fileOverview 设置滚动显示指定元素时回调。
 * @author xuld
 */

typeof include === "function" && include("scrollTo");

/**
 * 设置滚动到当前指定节点时的回调。
 * @param {Boolean} [alignCenter=true] 如果设为 @true，则对齐到滚动区域两端，否则对齐到滚动区域中间。
 * @param {Number} [duration=0] 滚动的特效时间。如果为 0 则不使用渐变。
 * @param {Dom} [scrollParent=document] 滚动所在的容器。
 * @param {Function} [callback] 滚动特效完成后的回调。函数参数为：
 * * @this {Element} 引发事件的节点。
 * * @param {Number} x 滚动的目标水平位置。
 * * @param {Number} y 滚动的目标垂直位置。
 * * @param {Number} duration 滚动的特效时间。如果为 0 则不使用渐变。
 * @returns this
 * @example $("#elem1").scrollIntoViewIfNeeded();
 */
Dom.prototype.scrollIntoViewIfNeeded = function (alignCenter, duration, scrollParent, callback) {
    alignCenter = alignCenter !== false;
    scrollParent = Dom(scrollParent || document);
    return this.each(function (elem) {
        var containerRect = scrollParent.rect(),
            currentRect = Dom(elem).rect(),
            deltaY = currentRect.top - containerRect.top,
            deltaX = currentRect.left - containerRect.left,
            currentScroll = scrollParent.scroll(),
            offsetY = alignCenter ? (containerRect.height - currentRect.height) / 2 : 0,
            offsetX = alignCenter ? (containerRect.width - currentRect.width) / 2 : 0;

        // 如果当前左边在屏幕下面，则移动位置。
        if (deltaY < 0) {
            currentScroll.top += deltaY - offsetY;
        } else if (deltaY > containerRect.height - currentRect.height) {
            currentScroll.top += deltaY - containerRect.height + currentRect.height + offsetY;
        } else {
            currentScroll.top = null;
        }

        // 如果当前左边在屏幕下面，则移动位置。
        if (deltaX < 0) {
            currentScroll.left += deltaX - offsetX;
        } else if (deltaX > containerRect.width - currentRect.width) {
            currentScroll.left += deltaX - containerRect.width + currentRect.width + offsetX;
        } else {
            currentScroll.left = null;
        }

        // 更新并移动位置。
        (currentScroll.top != null || currentScroll.left != null) && scrollParent.scrollTo(currentScroll.left, currentScroll.top, duration, callback);

    });

};
