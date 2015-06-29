/**
 * @fileOverview 设置滚动显示指定元素时回调。
 * @author xuld
 */

// #require rect

/**
 * 渐变滚动当前元素到指定位置。
 * @param {Number} x 滚动的目标水平位置。
 * @param {Number} y 滚动的目标垂直位置。
 * @param {Number} [duration=0] 滚动的特效时间。如果为 0 则不使用渐变。
 * @param {Element} [scrollContainer=document] 滚动所在的容器。
 */
Document.prototype.scrollTo = Element.prototype.scrollTo = function (x, y, duration) {
    duration = +duration || 0;
    if (duration == 0) {
        return this.setScroll({ left: x, top: y });
    }
    var elem = this,
        count = duration / 20,
        currentSceoll = elem.getScroll(),
        stepX = (x - currentSceoll.left) / count,
        stepY = (y - currentSceoll.top) / count;
    duration /= count;
    moveNext();
    function moveNext() {
        if (x != null) currentSceoll.left += stepX;
        if (y != null) currentSceoll.top += stepY;
        elem.setScroll(currentSceoll);
        if (--count > 0) {
            setTimeout(moveNext, duration);
        }
    }
};
