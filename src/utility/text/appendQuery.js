
/**
 * 在指定的地址追加（如果存在则替换）查询字符串参数。
 * @param {String} url 要追加的地址。
 * @param {String} paramName 要追加或替换的查询参数名。
 * @param {String} paramValue 要追加或替换的查询参数值。
 * @example 
 * appendQuery("a.html", "b", "c") // "a.html?b=c"
 *
 * appendQuery("a.html?b=d", "b", "c") // "a.html?b=c"
 *
 * appendQuery("a.html?b=d, "add", "val") // "a.html?b=d&add=val"
 */
function appendQuery(url, paramName, paramValue) {
    paramName = encodeURIComponent(paramName);
    paramValue = paramName + '=' + encodeURIComponent(paramValue);
    url = /^(.*?)(\?.+?)?(#.*)?$/.exec(url);
    url[0] = '';
    url[2] = url[2] && url[2].replace(new RegExp('([?&])' + paramName.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + '(=[^&]*)?(&|$)'), function (_, q1, __, q2) {
        // 标记已解析过。
        paramName = 0;
        return q1 + paramValue + q2;
    });
    if (paramName) {
        url[2] = (url[2] ? url[2] + '&' : '?') + paramValue;
    }
    return url.join('');
}
