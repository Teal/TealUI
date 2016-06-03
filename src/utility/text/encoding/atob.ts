/**
 * @fileOverview 纯 JavaScript 实现 Base64 编码/解码算法。
 * @author davidchambers
 */

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

// #endif
