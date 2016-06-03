/**
 * @fileOverview 获取 URL 查询参数（如 ?a=b&c=d）。
 * @author xuld@vip.qq.com
 */

/**
 * 获取当前页面或指定地址的查询参数。
 * @param name 要获取的查询字符串名。
 * @param url 要获取的地址，默认为当前页面地址。
 * @returns 返回查询参数值。如果获取不到则返回 undefined。
 * @example getQuery("a", "?a=b") // "b"
 */
function getQuery(name: string, url = location.href) {
    let match = /\?([^#]*)(#|$)/.exec(url);
    if (match && (match = new RegExp("(^|&)" + encodeURIComponent(name).replace(/([\-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^&]*)(&|$)", "i").exec(match[1]))) {
        try {
            match[2] = decodeURIComponent(match[2]);
        } catch (e) { }
        return match[2];
    }
}
