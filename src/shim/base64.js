/**
 * @fileOverview 纯 JavaScript 实现 Base64 编码/解码算法。
 * @author davidchambers
 */

// 改自 https://bitbucket.org/davidchambers/base64.js
if (!this.btoa && !this.atob) {
    (function (global) {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        function throwInvalideCharError() {
            document.createElement('$');
        }

        // encoder
        // [https://gist.github.com/999166] by [https://github.com/nignag]
        global.btoa = function (input) {
            for (
                // initialize result and counter
              var block, charCode, idx = 0, map = characters, output = '';
                // if the next input index does not exist:
                //   change the mapping table to "="
                //   check if d has no fractional digits
              input.charAt(idx | 0) || (map = '=', idx % 1) ;
                // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
              output += map.charAt(63 & block >> 8 - idx % 1 * 8)
            ) {
                charCode = input.charCodeAt(idx += 3 / 4);
                if (charCode > 0xFF) throwInvalideCharError();
                block = block << 8 | charCode;
            }
            return output;
        };

        // decoder
        // [https://gist.github.com/1020396] by [https://github.com/atk]
        global.atob = function (input) {
            input = input.replace(/=+$/, '')
            if (input.length % 4 == 1) throwInvalideCharError();
            for (
                // initialize result and counters
              var bc = 0, bs, buffer, idx = 0, output = '';
                // get next character
              buffer = input.charAt(idx++) ;
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

    })(this);
}
