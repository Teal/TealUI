/**
 * @fileOverview 获取或设置外部 HTML。
 * @author xuld
 */

typeof include === "function" && include("base");

/**
 * 获取当前集合第一项的滚动区域大小。
 * @returns {Size} 返回一个包含两个`width` 和 `height`属性的对象。
 * @example $("#elem1").scrollSize()
 */
Dom.prototype.scrollSize = function () {
    var elem = this[0];
    if (elem) {
        return {
            width: elem.nodeType === 9 ? Math.max(elem.documentElement.scrollWidth || 0, elem.body.scrollWidth || 0, elem.clientWidth || 0) : elem.scrollWidth,
            height: elem.nodeType === 9 ? Math.max(elem.documentElement.scrollHeight || 0, elem.body.scrollHeight || 0, elem.clientHeight || 0) : elem.scrollHeight
        };
    }
};
