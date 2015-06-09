/**
 * @fileOverview 获取或设置外部 HTML。
 * @author xuld
 */

/**
 * 获取文档的滚动位置。
 * @return {Point} 返回的对象包含两个整型属性：left 和 top。
 */
Document.prototype.getScrollSize = function() {
    var elem = this;
    return {
        width: Math.max(elem.documentElement.scrollWidth, elem.body.scrollWidth, elem.clientWidth),
        height: Math.max(elem.documentElement.scrollHeight, elem.body.scrollHeight, elem.clientHeight)
    };
};

/**
 * 获取指定节点的滚动区域大小。
 * @return {Point} 返回的对象包含两个整型属性：x 和 y。
 * @remark
 * getScrollSize 获取的值总是大于或的关于 getSize 的值。
 * 此方法对可见和隐藏元素均有效。
 */
Element.prototype.getScrollSize = function() {
    return {
        width: elem.scrollWidth,
        height: elem.scrollHeight
    };
};
