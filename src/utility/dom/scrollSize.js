/**
 * @fileOverview 获取或设置外部 HTML。
 * @author xuld
 */

// #require base

/**
 * 获取指定节点的滚动区域大小。
 * @returns {Size} 返回的对象包含两个整型属性：width 和 height。
 */
Dom.prototype.scrollSize = function () {
    var elem = this[0];
    return elem && (elem.nodeType === 9 ? {
        width: Math.max(elem.documentElement.scrollWidth || 0, elem.body.scrollWidth || 0, elem.clientWidth || 0),
        height: Math.max(elem.documentElement.scrollHeight || 0, elem.body.scrollHeight || 0, elem.clientHeight || 0)
    } : {
        width: elem.scrollWidth,
        height: elem.scrollHeight
    });
};
