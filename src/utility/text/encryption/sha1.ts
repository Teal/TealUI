
/**
 * 计算一个字符串的 SHA-1 值。
 * @param value 要计算的字符串。
 * @returns 返回加密后的字符串。其所有字符均为小写。
 * @example sha1("abc") // "a9993e364706816aba3e25717850c26c9cd0d89d"
 */
export function sha1(value: string) {
    return sha1["binaryToString"](sha1["calc"](sha1["stringToBinary"](value)));
}

/**
 * SHA-1 算法使用的字符集。如需更改 SHA-1 返回的大小写可更改此字段。
 * @inner
 */
sha1["hexChars"] = "0123456789abcdef";

/**
 * SHA-1 算法使用的字符大小。
 * @inner
 */
sha1["charSize"] = 8;

/**
 * 转换字符串到二进制。
 * 如果字符大于 255 ， 高位被截掉。
 * @inner
 */
sha1["stringToBinary"] = function (value: string) {
    const nblk = ((value.length + 8) >> 6) * 16 + 16;
    let blks = [];
    for (let i = 0; i < nblk; i++) {
        blks[i] = 0;
    }
    for (let i = 0; i < value.length; i++) {
        blks[i >> 2] |= value.charCodeAt(i) << (24 - (i & 3) * 8);
    }
    blks[value.length >> 2] |= 0x80 << (24 - (value.length & 3) * 8);
    blks[nblk - 1] = value.length * 8;
    return blks;
};

/**
 * 转换数组到十六进的字符串。
 * @param binArray 二进制数组。
 * @returns 字符串。
 * @inner
 */
sha1["binaryToString"] = function (binArray: number[]) {
    let result = "";
    for (let i = 0; i < binArray.length * 4; i++) {
        result += sha1["hexChars"].charAt((binArray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + sha1["hexChars"].charAt((binArray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return result;
};

/**
 * 计算一个数组的 SHA-1 值。
 * @inner
 */
sha1["calc"] = function (binArray: number[]) {

    let w = Array<number>(80);
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let e = -1009589776;
    for (let i = 0; i < binArray.length; i += 16) { // 每次处理512位 16*32。
        const oldA = a;
        const oldB = b;
        const oldC = c;
        const oldD = d;
        const oldE = e;
        for (let j = 0; j < 80; j++) { // 对每个 512 位进行 80 步操作。
            w[j] = j < 16 ? binArray[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            const t = safeAdd(safeAdd(rol(a, 5), j < 20 ? b & c | ~b & d : j < 40 ? b ^ c ^ d : j < 60 ? b & c | b & d | c & d : b ^ c ^ d), safeAdd(safeAdd(e, w[j]), j < 20 ? 1518500249 : j < 40 ? 1859775393 : j < 60 ? -1894007588 : -899497514));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
        }
        a = safeAdd(a, oldA);
        b = safeAdd(b, oldB);
        c = safeAdd(c, oldC);
        d = safeAdd(d, oldD);
        e = safeAdd(e, oldE);
    }
    return [a, b, c, d, e];

    /**
     * 将32位数拆成高16位和低16位分别进行相加，从而实现 MOD 2^32 的加法。
     * @inner
     */
    function safeAdd(x: number, y: number) {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        return (x >> 16 + y >> 16 + lsw >> 16) << 16 | lsw & 0xFFFF;
    }

    /**
     * 32位二进制数循环左移。
     * @inner
     */
    function rol(num: number, cnt: number) {
        return num << cnt | num >>> (32 - cnt);
    }

};
