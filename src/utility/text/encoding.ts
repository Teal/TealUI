/**
 * @fileOverview 编码转换。
 * @description 提供字符串编码和转码功能。
 */

// #region HTML

/**
 * 编码 HTML 特殊字符。
 * @param value 要编码的字符串。
 * @returns 返回已编码的字符串。
 * @remark 此函数主要将 `& < > ' "` 分别编码成 `&amp; &lt; &gt; &#39; &quot;`。
 * @example encodeHTML("<a></a>") // &lt;a&gt;&lt;/a&gt;
 */
export function encodeHTML(value: string) {
    return value.replace(/[&<>\'\"]/g, (c: string) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '\'': '&#39;',
        '\"': '&quot;'
    })[c]);
}

/**
 * 编码 HTML 属性特殊字符。
 * @param value 要编码的字符串。
 * @returns 返回已编码的字符串。
 * @remark 此函数主要将 ' " 分别编码成 &#39; &quot; 。
 * @example encodeHTMLAttribute("'") // &amp;#39;
 */
export function encodeHTMLAttribute(value) {
    return value.replace(/[\'\"]/g, (c: string) => ({
        '\'': '&#39;',
        '\"': '&quot;'
    })[c]);
}

/**
 * 解码 HTML 特殊字符。
 * @param value 要解码的字符串。
 * @returns 返回已解码的字符串。
 * @example decodeHTML("&lt;a&gt;&lt;/a&gt;") // <a></a>
 */
export function decodeHTML(value: string) {
    return value.replace(/&(\w+);/g, (_: string, c: string) => ({
        'amp': '&',
        'lt': '<',
        'gt': '>',
        '#39': '\'',
        'quot': '\"'
    }[c] || c));
}

// #endregion

// #region Base64

/**
 * 对指定的字符串进行 Base64 编码(支持中文)。
 * @param value 要转换的字符串。
 * @returns 转换后的字符串。
 * @example encodeBase64("中文") // "5Lit5paH"
 */
export function encodeBase64(value: string) {

    // 转换 Unicode 字符为 UTF8 字符序列，确保每个字符都是 ASCII 字符。
    let t: number[] = [];
    for (let i = 0; i < value.length; i++) {
        const c = value.charCodeAt(i);
        if (c < 128) {
            t.push(c);
        } else if (c < 2048) {
            t.push(192 | c >> 6 & 31, 128 | c >> 0 & 63);
        } else {
            t.push(224 | c >> 12 & 15, 128 | c >> 6 & 63, 128 | c >> 0 & 63);
        }
    }

    // 一次编码 3 个字符，得到 4 位 Base64 编码，如果位数不够则补 '='。
    const base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const length = t.length;
    let result = "";
    for (let i = 0; i < length;) {

        const c1 = t[i++];
        result += base64EncodeChars.charAt(c1 >> 2);
        if (i === length) {
            result += base64EncodeChars.charAt((c1 & 3) << 4) + "==";
            break;
        }

        const c2 = t[i++];
        result += base64EncodeChars.charAt((c1 & 3) << 4 | (c2 & 240) >> 4);
        if (i === length) {
            result += base64EncodeChars.charAt((c2 & 15) << 2) + "=";
            break;
        }

        const c3 = t[i++];
        result += base64EncodeChars.charAt((c2 & 15) << 2 | (c3 & 192) >> 6) + base64EncodeChars.charAt(c3 & 63);

    }
    return result;
}

/**
 * 对指定的字符串进行 Base64 解码(支持中文)。
 * @param value 要转换的字符串。
 * @returns 转换后的字符串。
 * @example decodeBase64("5Lit5paH") // "中文"
 */
export function decodeBase64(value: string) {

    // 一次解码 4 个 Base64 字符，得到 3 个字符。
    const base64DecodeChars = [
        62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -2, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
    ];
    let t = [];
    for (let i = 0; i < value.length;) {

        const c1 = base64DecodeChars[value.charCodeAt(i++) - 43];
        const c2 = base64DecodeChars[value.charCodeAt(i++) - 43];
        if (!(c1 >= 0 && c2 >= 0)) continue;
        t.push(c1 << 2 | (c2 & 48) >> 4);

        const c3 = base64DecodeChars[value.charCodeAt(i++) - 43];
        if (!(c3 >= 0)) continue;
        t.push((c2 & 15) << 4 | (c3 & 60) >> 2);

        const c4 = base64DecodeChars[value.charCodeAt(i++) - 43];
        if (!(c4 >= 0)) continue;
        t.push((c3 & 3) << 6 | c4);

    }

    // 转换 ASCII 字符为 Unicode 字符。
    let result = "";
    for (let i = 0; i < t.length;) {
        const c = t[i++];
        if (c < 128) {
            result += String.fromCharCode(c);
        } else if (c > 191 && c < 224) {
            result += String.fromCharCode((c & 31) << 6 | t[i++] & 63);
        } else if (c > 223 && c < 240) {
            result += String.fromCharCode((c & 15) << 12 | (t[i++] & 63) << 6 | (t[i++] & 63) << 0);
        }
    }
    return result;
}

// #endregion

// #region BToA

// #if HTML4

if (typeof atob !== "function") {

    /**
     * Base64 编码。
     * @param value 要转换的文本。
     * @returns 转换后的文本。
     * @see https://gist.github.com/1020396
     * @see https://bitbucket.org/davidchambers/base64.js
     * @author https://github.com/atk
     * @example atob("abcefg")
     * @since ES4
     */
    const atob = function (value: string) {
        let result = '';
        value = value.replace(/=+$/, '');
        if (value.length % 4 === 1) throw new Error("Invalid Char");
        for (
            // initialize result and counters
            let bc = 0, bs, buffer, idx = 0;
            // get next character
            (buffer = value.charAt(idx++));
            // character found in table? initialize bit storage and add its ascii value;
            ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                // and if not first of each 4 characters,
                // convert the first 8 bits to one ascii character
                bc++ % 4) ? result += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
        ) {
            // try to find character in table (0-63, not found => -1)
            buffer = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(buffer);
        }
        return result;
    };

}

if (typeof btoa !== "function") {

    /**
     * Base64 解码。
     * @param {String} value 要转换的文本。
     * @returns {String} 转换后的文本。
     * @see https://gist.github.com/999166
     * @see https://bitbucket.org/davidchambers/base64.js
     * @author https://github.com/nignag
     * @example btoa("abcefg")
     * @since ES4
     */
    const btoa = function (value: string) {
        let result = '';
        for (
            // initialize result and counter
            let block,
            charCode,
            idx = 0,
            map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            // if the next str index does not exist:
            //   change the mapping table to "="
            //   check if d has no fractional digits
            value.charAt(idx | 0) || (map = '=', idx % 1);
            // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
            result += map.charAt(63 & block >> 8 - idx % 1 * 8)
        ) {
            charCode = value.charCodeAt(idx += 3 / 4);
            if (charCode > 0xFF) throw new Error("Invalid Char");
            block = block << 8 | charCode;
        }
        return result;
    };

}

// #endif

// #endregion

// #region UTF8

/**
 * 对指定的字符串进行 UTF-8 编码。
 * @param value 要转换的字符串。
 * @returns 转换后的字符串。
 * @example encodeUTF8("你") // "\\u4f60"
 */
export function encodeUTF8(value) {
    let result = "";
    for (let i = 0; i < value.length; i++) {
        const t = value.charCodeAt(i).toString(16);
        result += "\\u" + new Array(5 - t.length).join("0") + t;
    }
    return result;
}

/**
 * 对指定的字符串进行 UTF-8 解码。
 * @param value 要转换的字符串。
 * @returns 转换后的字符串。
 * @example decodeUTF8("\\u4f60") // "你"
 */
export function decodeUTF8(value: string) {
    return value.replace(/\\u(\w{4}|\w{2})/gi, (_: string, unicode: string) => String.fromCharCode(parseInt(unicode, 16)));
}

// #endregion

// #region GB2312

import {Gb2312Dict} from './gb2312dict';

declare function escape(value: string): string;

/**
 * 对指定的字符串进行 GB2312 编码。
 * @param value 要转换的字符串。
 * @returns 转换后的字符串。
 * @example encodeGB2312("你") // "%C4%E3"
 */
export function encodeGB2312(value: string) {
    let result = "";
    for (let i = 0; i < value.length; i++) {
        let c = value.charCodeAt(i) - 0x4e00;
        if (c >= 0) {
            let t = Gb2312Dict[c];
            result += "%" + t.substr(0, 2) + "%" + t.substr(2);
        } else {
            let t = value.charAt(i);
            result += t === " " ? "+" : escape(t);
        }
    }
    return result;
}

declare function unescape(value: string): string;

/**
 * 对指定的字符串进行 GB2312 解码。
 * @param value 要转换的字符串。
 * @returns 转换后的字符串。
 * @example decodeGB2312("%C4%E3") // "你"
 */
export function decodeGB2312(value: string) {
    return value.replace(/%([\da-f][\da-f])(%([\da-f][\da-f]))?/ig, (all: string, x: string, __, y: string) => {
        if (!y) return String.fromCharCode(parseInt(x, 16));
        var p = Gb2312Dict.indexOf((x + y).toUpperCase());
        return p >= 0 ? String.fromCharCode(0x4e00 + p) : unescape(all);
    });
}

// #endregion
