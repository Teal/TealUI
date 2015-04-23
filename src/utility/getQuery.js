/**
 * @fileOverview 处理查询字符串。
 */

/**
 * 获取查询字符串。
 * @param {String} name 要获取的查询字符串名。
 */
function getQuery(name) {
    var path = /\?([^#]*)(#|$)/.exec(location.href);
    if (path) {
        path = new RegExp("(^|&)" + name.replace(/([\-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^&]*)(&|$)", "i").exec(path[1]);
        if (path) {
            return decodeURIComponent(path[2]);
        }
    }
    return null;
}
