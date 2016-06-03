
/**
 * 将指定对象格式化为查询参数字符串。
 * @param obj 要格式化的对象。
 * @returns 返回格式化后的字符串。
 * @example stringifyQuery({ a: "2", c: "4" }) // "a=2&c=4"
 */
export function stringifyQuery(obj: any, name?: string) {
    if (obj && typeof obj === 'object') {
        let t = [];
        for (const key in obj) {
            t.push(QueryString.stringify(obj[key], name || key));
        }
        obj = t.join('&');
    } else if (name) {
        obj = encodeURIComponent(name) + "=" + encodeURIComponent(obj);
    }
    return obj;
}
