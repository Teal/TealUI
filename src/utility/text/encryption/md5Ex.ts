/**
 * @author xuld@vip.qq.com
 */

import {md5} from './md5';

/**
 * 计算一个字符串的 HMAC-MD5 值。
 * @param value 要计算的字符串。
 * @param key 加密的密钥。
 * @returns 返回加密后的字符串。其所有字符均为大写。
 * @example md5.hmacMd5("abc", "key") // "d2fe98063f876b03193afb49b4979591"
 */
md5["hmacMd5"] = function (value: string, key: string) {
    return md5["binaryToString"](md5["hmacMd5c"](value, key));
};

/**
 * 计算 HMAC-MD5 。
 * @inner
 */
md5["hmacMd5c"] = function (value: string, key: string) {
    let bkey = md5["stringToBinary"](key);
    if (bkey.length > 16) bkey = md5["calc"](bkey, key.length * md5["charSize"]);

    let ipad = [];
    let opad = [];
    for (let i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    return md5["calc"](opad.concat(md5["calc"](ipad.concat(md5["stringToBinary"](value)), 512 + value.length * md5["charSize"])), 512 + 128);
};

/**
 * 计算一个字符串的 Base64-MD5 值。
 * @param value 要计算的字符串。
 * @returns 返回加密后的字符串。其所有字符均为大写。
 * @example md5.base64Md5("abc") // "kAFQmDzST7DWlj99KOF/cg"
 */
md5["base64Md5"] = function (value: string) {
    return md5["binaryToBase64"](md5["calc"](md5["stringToBinary"](value), value.length * md5["charSize"]));
};

/**
 * 转换数组到 base-64 的字符串。
 * @inner
 */
md5["binaryToBase64"] = function (binArray: number[], base64Pad: string) {
    base64Pad = base64Pad || "";

    let result = "";
    for (let i = 0; i < binArray.length * 4; i += 3) {
        const triplet = (((binArray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) | (((binArray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) | ((binArray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
        for (let j = 0; j < 4; j++) {
            result += i * 8 + j * 6 > binArray.length * 32 ? base64Pad : ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((triplet >> 6 * (3 - j)) & 0x3F));
        }
    }
    return result;
};

/**
 * 计算一个字符串的 Base64-MD5 值。
 * @param value 要计算的字符串。
 * @param key 加密的密钥。
 * @returns 返回加密后的字符串。其所有字符均为大写。
 * @example md5.base64HmacMd5("abc", "key") // "0v6YBj+HawMZOvtJtJeVkQ"
 */
md5["base64HmacMd5"] = function (value: string, key: string) {
    return md5["binaryToBase64"](md5["hmacMd5c"](value, key));
};
