/**
 * Base64 编码。
 * @param value 要转换的文本。
 * @return 转换后的文本。
 * @example atob("abcefg")
 * @since ES4
 */
atob = this.atob || function (value) {
    let r = "";
    value = value.replace(/=+$/, "");
    if (value.length % 4 === 1) throw new Error("Invalid Char");
    for (
        // initialize r and counters
        let bc = 0, bs, buffer, idx = 0;
        // get next character
        (buffer = value.charAt(idx++));
        // character found in table? initialize bit storage and add its ascii value;
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            // and if not first of each 4 characters,
            // convert the first 8 bits to one ascii character
            bc++ % 4) ? r += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
        // try to find character in table (0-63, not found => -1)
        buffer = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(buffer);
    }
    return r;
};

/**
 * Base64 解码。
 * @param value 要转换的文本。
 * @return 转换后的文本。
 * @example btoa("abcefg")
 * @since ES4
 */
btoa = this.btoa || function (value) {
    let r = "";
    for (
        // initialize r and counter
        let block,
        charCode,
        idx = 0,
        map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        // if the next str index does not exist:
        //   change the mapping table to "="
        //   check if d has no fractional digits
        value.charAt(idx | 0) || (map = "=", idx % 1);
        // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
        r += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
        charCode = value.charCodeAt(idx += 3 / 4);
        if (charCode > 0xFF) throw new Error("Invalid Char");
        block = block << 8 | charCode;
    }
    return r;
};
