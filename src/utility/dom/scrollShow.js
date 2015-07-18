/**
 * @fileOverview 设置滚动显示指定元素时回调。
 * @author xuld
 */

// #require base

/**
 * 判断是否在可见内范围内。
 * @param {Element} [scrollParent=document] 滚动所在的容器。
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
 * @param {Element} [scrollParent=document] 滚动所在的容器。
 */
Dom.prototype.scrollShow = function (callback, callbackMode, scrollParent) {
    callbackMode = callbackMode == 'once' ? 0 : callbackMode == 'every' ? 2 : 1;
    scrollParent = scrollParent || document;

    return this.each(function (elem) {
        var inView = false,
            container = scrollParent.defaultView || scrollParent;

        container.addEventListener('scroll', scrollCallback, false);
        scrollCallback();

        function scrollCallback() {
            if (Dom(elem).isScrollIntoView(scrollParent)) {
                if (!inView) {
                    callback.call(elem, elem);
                }
                if (callbackMode == 1) {
                    inView = true;
                }
                if (callbackMode == 0) {
                    container.removeEventListener('scroll', scrollCallback, false);
                }
            } else {
                inView = false;
            }

        }

    });

};
