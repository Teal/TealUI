/**
 * @fileOverview 设置滚动显示指定元素时回调。
 * @author xuld
 */

// #require rect

/**
 * 获取指定元素的滚动父级元素。
 * @returns {Element} 返回上级滚动元素。
 */
Element.prototype.getScrollParent = function () {
    var parent = this.parentNode;
    parent = parent.nodeType == 9 || parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth ? parent : parent.getScrollParent();
    if (parent == parent.ownerDocument.body) {
        parent = parent.ownerDocument;
    }
    return parent;
};

/**
 * 判断当前元素是否在可见内范围内。
 * @param {Element} [scrollParent=document] 滚动所在的容器。
 */
Element.prototype.isScrollIntoView = function (scrollParent) {
    scrollParent = scrollParent || this.getScrollParent();
    var elem = this,
        containerRect = scrollParent.getRect(),
        currentRect = elem.getRect(),
        deltaY = currentRect.top - containerRect.top,
        deltaX = currentRect.left - containerRect.left;
    return deltaY > 0 && deltaY < containerRect.height && deltaX > 0 && deltaX < containerRect.width;
};
