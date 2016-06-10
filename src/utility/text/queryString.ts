/**
 * @fileOverview 提供处理查询字符串的方法。
 * @author xuld@vip.qq.com
 */

/**
 * 解析查询字符串为对象。
 * @param value 要解析的字符串。
 * @returns 返回解析后的对象。
 * @example QueryString.parse("a=1&b=3") // {a: 1, b:3}
 */
export function parse(value: string) {
    let result: { [key: string]: any } = {};
    if (value) {
        let arr = value.replace(/^\?/, "").replace(/\+/g, '%20').split('&');
        for (let i = 0; i < arr.length; i++) {
            let t = arr[i].indexOf('=');
            let key = t >= 0 ? arr[i].substr(0, t) : arr[i];
            let value = arr[i].substr(key.length + 1);

            try {
                key = decodeURIComponent(key);
            } catch (e) { }

            try {
                value = decodeURIComponent(value);
            } catch (e) { }

            if (result.hasOwnProperty(key)) {
                if (result[key].constructor === String) {
                    result[key] = [result[key], value];
                } else {
                    result[key].push(value);
                }
            } else {
                result[key] = value;
            }
        }
    }
    return result;
}

/**
 * 将指定对象格式化为查询参数字符串。
 * @param obj 要格式化的对象。
 * @returns 返回格式化后的字符串。
 * @example QueryString.stringify({ a: "2", c: "4" }) // "a=2&c=4"
 */
export function stringify(obj: any, name?: string) {
    if (obj && typeof obj === 'object') {
        let t = [];
        for (const key in obj) {
            t.push(stringify(obj[key], name || key));
        }
        obj = t.join('&');
    } else {
        obj = (name ? encodeURIComponent(name) + "=" : "") + encodeURIComponent(obj);
    }
    return obj as string;
}

/**
 * 在当前页面的地址追加（如果存在则替换）查询字符串参数。
 * @param name 要追加或替换的查询参数名。
 * @param value 要追加或替换的查询参数值。
 * @example set("b", "c") // "a.html?b=c"
 */
export function set(name: string, value: string): string;

/**
 * 在指定的地址追加（如果存在则替换）查询字符串参数。
 * @param url 要追加的地址。
 * @param name 要追加或替换的查询参数名。
 * @param value 要追加或替换的查询参数值。
 * @example set("b", "c", "a.html") // "a.html?b=c"
 * @example set("b", "c", "a.html?b=d") // "a.html?b=c"
 * @example set("add", "val", "a.html?b=d) // "a.html?b=d&add=val"
 */
export function set(url: string, name: string, value: string): string;

/**
 * 在当前页面或指定的地址追加（如果存在则替换）查询字符串参数。
 * @param url 要追加的地址，默认为当前页面的地址。
 * @param name 要追加或替换的查询参数名。
 * @param value 要追加或替换的查询参数值。
 * @example set("b", "c", "a.html") // "a.html?b=c"
 * @example set("b", "c", "a.html?b=d") // "a.html?b=c"
 * @example set("add", "val", "a.html?b=d) // "a.html?b=d&add=val"
 */
export function set(url: string, name: string, value?: string) {
    if (arguments.length < 3) {
        value = name;
        name = url;
        url = location.href
    }
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

/**
 * 获取当前页面的查询参数。
 * @param name 要获取的查询字符串名。
 * @returns 返回查询参数值。如果获取不到则返回 undefined。
 * @example getQuery("a") // "b"
 */
export function get(name: string): string;

/**
 * 获取指定地址的查询参数。
 * @param url 要获取的地址。
 * @param name 要获取的查询字符串名。
 * @returns 返回查询参数值。如果获取不到则返回 undefined。
 * @example getQuery("a", "?a=b") // "b"
 */
export function get(url: string, name: string): string;

/**
 * 获取当前页面或指定地址的查询参数。
 * @param url 要获取的地址，默认为当前页面的地址。
 * @param name 要获取的查询字符串名。
 * @returns 返回查询参数值。如果获取不到则返回 undefined。
 * @example getQuery("a", "?a=b") // "b"
 */
export function get(url: string, name?: string) {
    if (arguments.length < 2) {
        name = url;
        url = location.href
    }
    let match = /\?([^#]*)(#|$)/.exec(url);
    if (match && (match = new RegExp("(^|&)" + encodeURIComponent(name).replace(/([\-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^&]*)(&|$)", "i").exec(match[1]))) {
        try {
            match[2] = decodeURIComponent(match[2]);
        } catch (e) { }
        return match[2];
    }
}
