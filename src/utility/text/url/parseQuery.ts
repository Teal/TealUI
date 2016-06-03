
/**
 * 解析查询字符串为对象。
 * @param value 要解析的字符串。
 * @returns 返回解析后的对象。
 * @example QueryString.parse("a=1&b=3") // {a: 1, b:3}
 */
export function parseQuery(value: string) {
    let result = {};
    if (value) {
        let arr = value.replace(/^\?/, "").replace(/\+/g, '%20').split('&');
        for (let i = 0; i < arr.length; i++) {
            let t = arr[i].indexOf('=');
            let key = t >= 0 ? arr[i].substr(0, t) : arr[i];
            val = arr[i].substr(key.length + 1);

            try {
                key = decodeURIComponent(key);
            } catch (e) {
            }

            try {
                val = decodeURIComponent(val);
            } catch (e) {
            }

            if (result.hasOwnProperty(key)) {
                if (result[key].constructor === String) {
                    result[key] = [result[key], val];
                } else {
                    result[key].push(val);
                }
            } else {
                result[key] = val;
            }
        }
    }
    return result;
},
