
/**
 * 在指定的地址追加查询字符串参数。
 */
function appendQuery(url, paramName, paramValue) {
    paramValue = paramName + '=' + encodeURIComponent(paramValue);
    url = /^(.*?)(\?.+?)?(#.*)?$/.exec(url);
    url[0] = '';
    url[2] = url[2] && url[2].replace(new RegExp('([?&])' + paramName + '\\b([^&]*)?(&|$)'), function (_, q1, __, q2) {
        // 标记已解析过。
        paramName = 0;
        return q1 + paramValue + q2;
    });
    if (paramName) {
        url[2] = (url[2] ? url[2] + '&' : '?') + paramValue;
    }
    return url.join('');
}