/**
 * @fileOverview 简单加解密
 * @author xuld@vip.qq.com
 */

/**
 * 解密指定的字符串。
 * @param value 要解密的字符串。
 * @param key 解密的密钥。
 * @returns 返回解密后的字符串。
 * @example dencryptString("abc", 123) // "cce"
 * @see encryptString
 */
export function decryptSimple(value: string, key = 19901206) {
    let t = [];
    const end = value.length - 1;

    for (let i = end; i >= 0; i--) {
        t[i] = ~(value.charCodeAt(i) ^ (~(i + end)));
    }

    const rkey = ~key;
    const last = t[end];
    for (let i = end; i >= 0; i--) {
        t[i] = ((t[i] & rkey) | ((i === 0 ? last : (t[i - 1])) & key));
    }

    for (let i = end; i >= 0; i--) {
        t[i] = String.fromCharCode(t[i]);
    }

    return t.join('');
}

/**
 * 加密指定的字符串。
 * @param value 要加密的字符串。
 * @param key 加密的密钥。
 * @returns 返回加密后的字符串。
 * @example encryptString("abc", 123) // "``e"
 * @see dencryptString
 */
export function encryptSimple(value: string, key = 19901206) {
    let t = [];
    const length = value.length;
    const rkey = ~key;
    for (let i = 0; i <= length; i++) {
        t[i] = String.fromCharCode(~((value.charCodeAt(i) & rkey | (i === length ? value.charCodeAt(0) : value.charCodeAt(i + 1)) & key) ^ ~(i + length)));
    }
    return t.join('');
}
