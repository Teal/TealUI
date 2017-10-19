/**
 * @fileOverview 设置滚动显示指定元素时回调。
 * @author xuld
 */

typeof include === "function" && include("base");

/**
 * 渐变滚动当前元素指定位置。
 * @param {Number} [x] 滚动的水平距离。如果不更新滚动值则传递 @null。
 * @param {Number} [y] 滚动的垂直距离。如果不更新滚动值则传递 @null。
 * @param {Number} [duration=100] 滚动的特效时间。如果为 0 则不使用渐变。
 * @param {Function} [callback] 滚动特效完成后的回调。函数参数为：
 * * @this {Element} 引发事件的节点。
 * * @param {Number} x 滚动的目标水平位置。
 * * @param {Number} y 滚动的目标垂直位置。
 * * @param {Number} duration 滚动的特效时间。如果为 0 则不使用渐变。
 * @returns this
 * @example $(document).scrollBy(100, 400);
 */
Dom.prototype.scrollBy = function (x, y, duration, callback) {
    return this.each(function (elem) {
        elem = Dom(elem);
        var scroll = Dom(elem).scroll();
        elem.scrollTo(x == null ? scroll.left : scroll.left + x, scroll.top == null ? scroll.top : scroll.top + y, duration, callback);
    });
};
