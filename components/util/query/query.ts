/**
 * 解析一个查询字符串为对象。
 * @param value 要解析的查询字符串。
 * @param joinChar 使用的连接符。
 * @param equalChar 使用的等号。
 * @return 返回解析后的对象。
 * @example parseQuery("foo=1&goo=2&goo=3") // { foo: "1", goo: ["2", "3"] }
 */
export function parseQuery(value: string, joinChar = "&", equalChar = "=") {
    const result: { [key: string]: any } = {};
    for (const pair of value.split(joinChar)) {
        const kv = pair.split(equalChar, 2);
        const key = decodeURIComponent(kv[0]);
        const value = decodeURIComponent(kv[1]);
        const exist = result[key];
        if (Array.isArray(exist)) {
            exist.push(value);
        } else if (typeof exist === "string") {
            result[key] = [exist, value];
        } else {
            result[key] = value;
        }
    }
    return result;
}

/**
 * 将指定对象格式化为查询字符串。
 * @param obj 要格式化的对象。
 * @param joinChar 使用的连接符。
 * @param equalChar 使用的等号。
 * @return 返回格式化后的字符串。
 * @example formatQuery({ a: "2", c: "4" }) // "a=2&c=4"
 * @example formatQuery({ a: [2, 4] }) // "a=2&a=4"
 */
export function formatQuery(obj: any, joinChar = "&", equalChar = "=") {
    const parts: string[] = [];
    for (const key in obj) {
        const value = obj[key];
        if (Array.isArray(value)) {
            for (const item of value) {
                parts.push(`${key}${equalChar}${encodeURIComponent(item)}`);
            }
        } else {
            parts.push(`${key}${equalChar}${encodeURIComponent(value)}`);
        }
    }
    return parts.join(joinChar);
}

/**
 * 获取指定地址的查询参数值。
 * @param name 要获取的查询参数名。
 * @param url 要处理的地址，默认为当前页面的地址。
 * @return 返回查询参数值。如果获取不到则返回 null。
 * @example getQuery("foo", "?foo=1") // "1"
 * @example getQuery("goo", "?foo=1") // null
 */
export function getQuery(name: string, url = location.href) {
    const match = /\?([^#]*)/.exec(url);
    if (match) {
        const match2 = new RegExp("(?:^|&)" + encodeURIComponent(name).replace(/([\-.*+?^${}()|[\]\/\\])/g, "\\$1") + "=([^&]*)(?:&|$)", "i").exec(match[1]);
        if (match2) {
            return decodeURIComponent(match2[1]);
        }
    }
    return null;
}

/**
 * 设置指定的地址的查询参数值。
 * @param name 要设置的查询参数名。
 * @param value 要设置的查询参数值。如果设为 null 则删除。
 * @param url 要处理的地址，默认为当前页面的地址。
 * @return 返回更新后的地址。
 * @example setQuery("foo", "1", "page.html") // "page.html?foo=1"
 * @example setQuery("foo", "2", "page.html?foo=1") // "page.html?foo=2"
 * @example setQuery("foo", null, "page.html") // "page.html"
 */
export function setQuery(name: string, value: string | null, url = location.href) {
    const match = /^(.*?)(\?.*?)?(#.*)?$/.exec(url)!;
    match[0] = "";
    if (value != null) {
        value = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    }
    if (match[2]) {
        match[2] = match[2].replace(new RegExp("([?&])" + name.replace(/([-.*+?^${}()|[\]\/\\])/g, "\$1") + "(=[^&]*)?(&|$)"), (source: string, left: string, oldValue: string, right: string) => {
            source = value == null ? right && left : left + value + right;
            // 标记已解析过。
            value = null;
            return source;
        });
    }
    if (value != null) {
        match[2] = (match[2] ? match[2] === "?" ? "?" : match[2] + "&" : "?") + value;
    }
    return match.join("");
}
