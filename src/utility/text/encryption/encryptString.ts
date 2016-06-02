
/**
 * 加密指定的字符串。
 * @param value 要加密的字符串。
 * @param key 加密的密钥。
 * @returns 返回加密后的字符串。
 * @example encryptString("abc", 123) // "``e"
 * @see dencryptString
 */
function encryptString(value: string, key = 19901206) {
    let t = [];

    const length = value.length;
    const rkey = ~key;
    for (var i = 0; i <= length; i++) {
        t[i] = String.fromCharCode(~(((value.charCodeAt(i) & rkey) | ((i === length ? value.charCodeAt(0) : value.charCodeAt(i + 1)) & key)) ^ (~(i + length))));
    }

    return t.join('');
}
