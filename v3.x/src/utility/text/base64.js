/**
 * @fileOverview 纯 JavaScript 实现 Base64 编码/解码算法。
 * @author davidchambers
 */

// 改自 https://bitbucket.org/davidchambers/base64.js
if (!this.btoa && !this.atob) {
    (function () {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        function throwInvalideCharError() {
            document.createElement('$');
        }

        /**
         * Base64 解码。
         * @param {String} str 要转换的文本。
         * @returns {String} 转换后的文本。
         * @see https://gist.github.com/999166
         * @author https://github.com/nignag
         * @example btoa("abcefg")
         * @since ES4
         */
        btoa = function (str) {
            typeof console === "object" && console.assert(typeof str === "string", "btoa(str: 必须是字符串)");
            for (
                // initialize result and counter
              var block, charCode, idx = 0, map = characters, output = '';
                // if the next str index does not exist:
                //   change the mapping table to "="
                //   check if d has no fractional digits
              str.charAt(idx | 0) || (map = '=', idx % 1) ;
                // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
              output += map.charAt(63 & block >> 8 - idx % 1 * 8)
            ) {
                charCode = str.charCodeAt(idx += 3 / 4);
                if (charCode > 0xFF) throwInvalideCharError();
                block = block << 8 | charCode;
            }
            return output;
        };

        /**
         * Base64 编码。
         * @param {String} str 要转换的文本。
         * @returns {String} 转换后的文本。
         * @see https://gist.github.com/1020396
         * @author https://github.com/atk
         * @example atob("abcefg")
         * @since ES4
         */
        atob = function (str) {
            typeof console === "object" && console.assert(typeof str === "string", "btoa(str: 必须是字符串)");
            str = str.replace(/=+$/, '')
            if (str.length % 4 == 1) throwInvalideCharError();
            for (
                // initialize result and counters
              var bc = 0, bs, buffer, idx = 0, output = '';
                // get next character
              buffer = str.charAt(idx++) ;
                // character found in table? initialize bit storage and add its ascii value;
              ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                // and if not first of each 4 characters,
                // convert the first 8 bits to one ascii character
                bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
            ) {
                // try to find character in table (0-63, not found => -1)
                buffer = characters.indexOf(buffer);
            }
            return output;
        };

    })();
}
