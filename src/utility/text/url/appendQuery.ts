/**
 * @fileOverview 追加查询参数。
 * @author xuld@vip.qq.com
 */

/**
 * 在指定的地址追加（如果存在则替换）查询字符串参数。
 * @param url 要追加的地址。
 * @param name 要追加或替换的查询参数名。
 * @param value 要追加或替换的查询参数值。
 * @example appendQuery("a.html", "b", "c") // "a.html?b=c"
 * @example appendQuery("a.html?b=d", "b", "c") // "a.html?b=c"
 * @example appendQuery("a.html?b=d, "add", "val") // "a.html?b=d&add=val"
 */
export default function appendQuery(url: string, name: string, value: string) {
    name = encodeURIComponent(name);
    value = name + '=' + encodeURIComponent(value);
    let match = /^(.*?)(\?.+?)?(#.*)?$/.exec(url);
    match[0] = '';
    match[2] = match[2] && match[2].replace(new RegExp('([?&])' + name.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + '(=[^&]*)?(&|$)'), (_: string, q1: string, __: string, q2: string) => {
        // 标记已解析过。
        name = "";
        return q1 + value + q2;
    });
    if (name) match[2] = (match[2] ? match[2] + '&' : '?') + value;
    return match.join('');
}
