/**
 * @fileOverview 设置滚动显示指定元素时回调。
 * @author xuld
 */

// #require scrollTo

Element.prototype._scrollIntoViewIfNeeded = Element.prototype.scrollIntoViewIfNeeded;

/**
 * 设置滚动到当前指定节点时的回调。
 * @param {Boolean} [align=true] 指示是否顶部对齐。
 * @param {Number} [duration=0] 滚动的特效时间。如果为 0 则不使用渐变。
 * @param {Element} [scrollParent=document] 滚动所在的容器。
 */
Element.prototype.scrollIntoViewIfNeeded = function (alignCenter, duration, scrollParent) {

    // 直接调用原生 API。
    if (this._scrollIntoViewIfNeeded && !duration && !scrollParent) {
        return this._scrollIntoViewIfNeeded(alignCenter);
    }

    var elem = this,
        containerRect = (scrollParent = scrollParent || document).getRect(),
        currentRect = elem.getRect(),
        deltaY = currentRect.top - containerRect.top,
        deltaX = currentRect.left - containerRect.left,
        currentScroll = scrollParent.getScroll(),
        offsetY = alignCenter !== false ? (containerRect.height - currentRect.height) / 2 : 0,
        offsetX = alignCenter !== false ? (containerRect.width - currentRect.width) / 2 : 0;

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
    (currentScroll.top != null || currentScroll.left != null) && scrollParent.scrollTo(currentScroll.left, currentScroll.top, duration);

};
