/**
 * @fileOverview 解析查询字符串。
 * @author xuld@vip.qq.com
 */

/**
 * 提供处理查询字符串的方法。
 */
export module QueryString {

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
     * @example stringifyQuery({ a: "2", c: "4" }) // "a=2&c=4"
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

}
