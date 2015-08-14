/**
 * @fileOverview 获取查询字符串。
 * @author xuld
 */

/**
 * 获取当前页面的查询参数。
 * @param {String} paramName 要获取的查询字符串名。
 * @param {String} [url=location.href] 指定处理的地址。
 * @returns {String} 返回查询参数值。如果获取不到则返回 null。
 * @example getQuery("a") // 返回 ?a=b 中的 b
 */
function getQuery(paramName, url) {
    var path = /\?([^#]*)(#|$)/.exec(url || location.href);
    if (path) {
        path = new RegExp("(^|&)" + encodeURIComponent(paramName).replace(/([\-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^&]*)(&|$)", "i").exec(path[1]);
        if ((path = path[2])) {
            try {
                path = decodeURIComponent(path);
            } catch (e) {

            }
            return path;
        }
    }
    return null;
}
