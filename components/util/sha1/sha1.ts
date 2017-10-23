/**
 * 计算字符串的 SHA-1 值。
 * @param value 要计算的字符串。
 * @return 返回 40 位的全小写 SHA-1 值。
 * @example sha1("abc") // "a9993e364706816aba3e25717850c26c9cd0d89d"
 */
export default function sha1(value: string) {
    return binaryToString(sha1Core(stringToBinary(value)));
}

/**
 * 将 ASCII 字符转为字节数组。
 * @param value 相关的文本。
 * @return 返回字节数组。
 * @desc 如果字符编码大于 255 则高位会被截断。
 * @internal
 */
export function stringToBinary(value: string) {
    const nblk = ((value.length + 8) >> 6) * 16 + 16;
    const blks: number[] = [];
    for (let i = 0; i < value.length; i++) {
        blks[i >> 2] |= value.charCodeAt(i) << (24 - (i & 3) * 8);
    }
    blks[value.length >> 2] |= 0x80 << (24 - (value.length & 3) * 8);
    blks[nblk - 1] = value.length * 8;
    return blks;
}

/**
 * 将字节数组转为 ASCII 字符。
 * @param value 相关的字节数组。
 * @return 返回字符串。
 * @desc 如果字符编码大于 255 则高位会被截断。
 * @internal
 */
export function binaryToString(value: number[]) {
    let r = "";
    for (let i = 0; i < value.length * 4; i++) {
        r += hexChars.charAt((value[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hexChars.charAt((value[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return r;
}

/**
 * 编码使用的字符集。
 * @desc 如果需要更改加密返回的字母大小写可更改此字段。
 * @internal
 */
export const hexChars = "0123456789abcdef";

/**
 * 执行 SHA-1 加密算法。
 * @param value 要计算的字节数组。
 * @return 返回已加密的字节数组。
 * @internal
 */
export function sha1Core(value: number[]) {
    const w = Array<number>(80);
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let e = -1009589776;
    for (let i = 0; i < value.length; i += 16) { // 每次处理 16 * 32 = 512 位。
        const oldA = a;
        const oldB = b;
        const oldC = c;
        const oldD = d;
        const oldE = e;
        const rol = (num: number, cnt: number) => num << cnt | num >>> (32 - cnt);
        for (let j = 0; j < 80; j++) { // 对每个 512 位进行 80 步操作。
            w[j] = j < 16 ? value[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
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
}

function safeAdd(x: number, y: number) {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    return ((x >> 16) + (y >> 16) + (lsw >> 16)) << 16 | lsw & 0xFFFF;
}
