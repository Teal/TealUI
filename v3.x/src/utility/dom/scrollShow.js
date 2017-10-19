/**
 * @fileOverview 设置滚动显示指定元素时回调。
 * @author xuld
 */

typeof include === "function" && include("dom");

/**
 * 判断集合第一项是否刚好滚在可见内范围内。
 * @param {Dom} [scrollParent=document] 滚动所在的容器。
 * @returns {Boolean} 如果部分或全部在可见内范围内，则返回 @true，否则返回 @false。
 * @example $("#elem").isScrollIntoView()
 */
Dom.prototype.isScrollIntoView = function (scrollParent) {
    if (this[0]) {
        var containerRect = Dom(scrollParent || document).rect(),
            currentRect = this.rect(),
            deltaY = currentRect.top - containerRect.top,
            deltaX = currentRect.left - containerRect.left;
        return (deltaY < 0 ? deltaY + currentRect.height > 0 : deltaY < containerRect.height) && (deltaX < 0 ? deltaX + currentRect.width > 0 : deltaX < containerRect.width);
    }
};

/**
 * 设置滚动到当前指定节点时的回调。
 * @param {Function} callback 滚动到当前指定节点时的回调。
 * @param {String} [callbackMode] 回调方式。可以是 'every', 'each', 'once'
 * @param {Dom} [scrollParent=document] 滚动所在的容器。
 * @returns this
 * @example $("#elem").scrollShow(function(){ alert("滚动到我的位置了"); });
 */
Dom.prototype.scrollShow = function (callback, callbackMode, scrollParent) {
    callbackMode = callbackMode === "once" ? 0 : callbackMode === "every" ? 2 : 1;
    scrollParent = scrollParent || document;

    return this.each(function (elem) {
        var inView = false,
            container = scrollParent.defaultView || scrollParent;

        function scrollCallback() {
            if (Dom(elem).isScrollIntoView(scrollParent)) {
                if (!inView) {
                    callback.call(elem, elem);
                }
                if (callbackMode === 1) {
                    inView = true;
                } else if (callbackMode === 0) {
                    container.removeEventListener("scroll", scrollCallback, false);
                }
            } else {
                inView = false;
            }

        }

        container.addEventListener("scroll", scrollCallback, false);
        scrollCallback();

    });

};
