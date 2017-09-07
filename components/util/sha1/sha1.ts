/**
 * 使用 SHA-1 算法加密指定字符串。
 * @param value 要加密的字符串。
 * @return 返回加密后的字符串，其中只包含小写字母。
 * @example sha1("abc") // "a9993e364706816aba3e25717850c26c9cd0d89d"
 */
export default function sha1(value: string) {
    return binaryToString(calc(stringToBinary(value)));
}

/**
 * 编码使用的字符集。如果需要更改加密返回的大小写可更改此字段。
 */
export const hexChars = "0123456789abcdef";

/**
 * 将文本转为字节数组。
 * @param value 要编码的文本。
 * @return 返回二进制字节数组。
 * @desc 只支持处理 ASCII 字符，如果字符编码大于 255，则会将高位截断。
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
 * 将字节数组转为文本。
 * @param value 要解码的二进制数组。
 * @return 返回字符串。
 * @desc 只支持处理 ASCII 字符，如果字符编码大于 255，则会将高位截断。
 */
export function binaryToString(value: number[]) {
    let result = "";
    for (let i = 0; i < value.length * 4; i++) {
        result += hexChars.charAt((value[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hexChars.charAt((value[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return result;
}

/**
 * 执行 SHA-1 加密算法。
 * @param value 要计算的字节数组。
 * @return 返回已加密的字节数组。
 */
export function calc(value: number[]) {
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
        const safeAdd = (x: number, y: number) => {
            const lsw = (x & 0xFFFF) + (y & 0xFFFF);
            return ((x >> 16) + (y >> 16) + (lsw >> 16)) << 16 | lsw & 0xFFFF;
        };
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
