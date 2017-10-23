import { md5Core, md5Binary, stringToBinary, binaryToString } from "./md5";

/**
 * 计算字符串的 MD5-Base64 值。
 * @param value 要计算的字符串。
 * @return 返回计算后的字符串。
 * @example md5Base64("abc") // "kAFQmDzST7DWlj99KOF/cg"
 */
export function md5Base64(value: string) {
    return binaryToBase64(md5Binary(value));
}

/**
 * 使用 Base64 编码字节数组。
 * @param value 要编码的字节数组。
 * @param padding 用于补齐编码的字符。
 * @return 返回编码后字符串。
 * @internal
 */
export function binaryToBase64(value: number[], padding = "") {
    let r = "";
    for (let i = 0; i < value.length * 4; i += 3) {
        const triplet = (value[i >> 2] >> i % 4 * 8 & 255) << 16 | (value[i + 1 >> 2] >> (i + 1) % 4 * 8 & 0xff) << 8 | value[i + 2 >> 2] >> (i + 2) % 4 * 8 & 0xff;
        for (let j = 0; j < 4; j++) {
            r += i * 8 + j * 6 > value.length * 32 ? padding : ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((triplet >> 6 * (3 - j)) & 0x3F));
        }
    }
    return r;
}

/**
 * 计算字符串的 HMAC-MD5 值。
 * @param value 要计算的字符串。
 * @param key 加密的密钥。
 * @return 返回计算后的字符串。
 * @example hmacMd5("abc", "key") // "d2fe98063f876b03193afb49b4979591"
 */
export function hmacMD5(value: string, key: string) {
    return binaryToString(hmacBinary(value, key));
}

/**
 * 计算字符串的 HMAC-MD5-Base64 值。
 * @param value 要计算的字符串。
 * @param key 加密的密钥。
 * @return 返回加密后的字符串，其中只包含小写字母。
 * @example hmacMD5Base64("abc", "key") // "0v6YBj+HawMZOvtJtJeVkQ"
 */
export function hmacMD5Base64(value: string, key: string) {
    return binaryToBase64(hmacBinary(value, key));
}

/**
 * 解码函数。
 */
declare function unescape(value: string): string;

/**
 * 计算字符串的 HMAC-MD5-Base64 值并返回字节数组。
 * @param value 要计算的字符串。
 * @param key 加密的密钥。
 * @return 返回字节数组。
 * @internal
 */
export function hmacBinary(value: string, key: string) {
    value = unescape(encodeURIComponent(value));
    key = unescape(encodeURIComponent(key));
    let bkey = stringToBinary(key);
    if (bkey.length > 16) bkey = md5Core(bkey, key.length * 8);

    const ipad: number[] = [];
    const opad: number[] = [];
    for (let i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    return md5Core(opad.concat(md5Core(ipad.concat(stringToBinary(value)), 512 + value.length * 8)), 512 + 128);
}
