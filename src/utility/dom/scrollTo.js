/**
 * @fileOverview 设置滚动显示指定元素时回调。
 * @author xuld
 */

// #require base

/**
 * 渐变滚动当前元素到指定位置。
 * @param {Number} x 滚动的目标水平位置。
 * @param {Number} y 滚动的目标垂直位置。
 * @param {Number} [duration=100] 滚动的特效时间。如果为 0 则不使用渐变。
 * @param {Function} [callback] 滚动特效完成后的回调。
 */
Dom.prototype.scrollTo = function (x, y, duration, callback) {
    return duration !== 0 ? this.each(function (elem) {
        duration = duration || 100;
        elem = Dom(elem);
        var count = duration / 20,
            fps = duration / count,
            currentSceoll = elem.scroll(),
            stepX = (x - currentSceoll.left) / count,
            stepY = (y - currentSceoll.top) / count;
        function moveNext() {
            if (x != null) currentSceoll.left += stepX;
            if (y != null) currentSceoll.top += stepY;
            elem.scroll(currentSceoll);
            if (--count > 0) {
                setTimeout(moveNext, fps);
            } else {
                callback && callback.call(elem, x, y, duration);
            }
        }
        moveNext();
    }) : this.scroll({ left: x, top: y });

};
