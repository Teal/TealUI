/**
 * @fileOverview 设置滚动显示指定元素时回调。
 * @author xuld
 */

// #require rect

/**
 * 判断当前元素是否在可见内范围内。
 * @param {Element} [scrollParent=document] 滚动所在的容器。
 */
Element.prototype.isScrollIntoView = function (scrollParent) {
    scrollParent = scrollParent || document;
    var elem = this,
        containerRect = scrollParent.getRect(),
        currentRect = elem.getRect(),
        deltaY = currentRect.top - containerRect.top,
        deltaX = currentRect.left - containerRect.left;
    return deltaY > 0 && deltaY < containerRect.height && deltaX > 0 && deltaX < containerRect.width;
};

/**
 * 设置滚动到当前指定节点时的回调。
 * @param {Function} callback 滚动到当前指定节点时的回调。
 * @param {Object} [scope] 设置回调函数中 this 的指向。
 * @param {String} [callbackMode] 回调方式。可以是 'every', 'each', 'once'
 * @param {Element} [scrollParent=document] 滚动所在的容器。
 */
Element.prototype.scrollShow = function (callback, scope, callbackMode, scrollParent) {
    var elem = this,
        inView = false,
        container;

    callbackMode = callbackMode == 'once' ? 0 : callbackMode == 'every' ? 2 : 1;
    scrollParent = scrollParent || document;
    container = scrollParent.defaultView || scrollParent;

    container.addEventListener('scroll', scrollCallback, false);
    scrollCallback();

    function scrollCallback() {
        if (elem.isScrollIntoView(scrollParent)) {
            if (!inView) {
                callback.call(scope || elem);
            }
            if (callbackMode == 1) {
                inView = true;
            }
            if (callbackMode == 0) {
                container.removeEventListener('scoll', scrollCallback, false);
            }
        } else {
            inView = false;
        }

    }

};
