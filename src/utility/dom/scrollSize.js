/**
 * @fileOverview 获取或设置外部 HTML。
 * @author xuld
 */

// #require base

/**
 * 获取指定节点的滚动区域大小。
 * @return {Point} 返回的对象包含两个整型属性：x 和 y。
 */
Dom.prototype.scrollSize = function () {
    var elem = this[0];
    return elem && (elem.nodeType === 9 ? {
        width: Math.max(elem.documentElement.scrollWidth, elem.body.scrollWidth, elem.clientWidth),
        height: Math.max(elem.documentElement.scrollHeight, elem.body.scrollHeight, elem.clientHeight)
    } : {
        width: elem.scrollWidth,
        height: elem.scrollHeight
    });
};
