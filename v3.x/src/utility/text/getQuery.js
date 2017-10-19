/**
 * @fileOverview 获取查询字符串。
 * @author xuld
 */

/**
 * 获取当前页面的查询参数。
 * @param {String} paramName 要获取的查询字符串名。
 * @returns {String} 返回查询参数值。如果获取不到则返回 null。
 * @example getQuery("a")
 */
function getQuery(paramName) {
    var path = /\?([^#]*)(#|$)/.exec(location.href);
    if (path) {
        path = new RegExp("(^|&)" + encodeURIComponent(paramName).replace(/([\-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^&]*)(&|$)", "i").exec(path[1]);
        if (path) return decodeURIComponent(path[2]);
    }
    return null;
}
