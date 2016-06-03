/**
 * @fileOverview 纯 JavaScript 实现 Base64 编码/解码算法。
 * @author davidchambers
 */

// #if HTML4

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
