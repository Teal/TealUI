/**
 * 计算字符串的 MD5 值。
 * @param value 要计算的字符串。
 * @return 返回 32 位全小写 MD5 值。
 * @example md5("a") // "0cc175b9c0f1b6a831c399e269772661"
 */
export default function md5(value: string) {
    return binaryToString(md5Binary(value));
}

/**
 * 计算字符串的 MD5 值并返回字节数组。
 * @param value 要加密的字符串。
 * @return 返回加密后的字节数组。
 * @internal
 */
export function md5Binary(value: string) {
    value = unescape(encodeURIComponent(value));
    return md5Core(stringToBinary(value), value.length * 8);
}

declare function unescape(value: string): string;

/**
 * 将 ASCII 字符转为字节数组。
 * @param value 相关的文本。
 * @return 返回字节数组。
 * @desc 如果字符编码大于 255 则高位会被截断。
 * @internal
 */
export function stringToBinary(value: string) {
    const len = value.length * 8;
    const r: number[] = [];
    for (let i = 0; i < len; i += 8) {
        r[i >> 5] |= (value.charCodeAt(i / 8) & 0xff) << (i % 32);
    }
    return r;
}

/**
 * 将字节数组转为 ASCII 字符。
 * @param value 相关的字节数组。
 * @return 返回字符串。
 * @desc 如果字符编码大于 255 则高位会被截断。
 * @internal
 */
export function binaryToString(value: number[]) {
    const len = value.length * 32;
    let r = "";
    for (let i = 0; i < len; i += 8) {
        const t = (value[i >> 5] >>> (i % 32)) & 0xFF;
        r += hexChars[(t >>> 4) & 0x0F] + hexChars[t & 0x0F];
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
 * 执行 MD5 加密算法。
 * @param value 要计算的字节数组。
 * @param length 总位数。
 * @return 返回已加密的字节数组。
 * @internal
 */
export function md5Core(value: number[], count: number) {
    const fns = [
        (b: number, c: number, d: number) => b & c | ~b & d,
        (b: number, c: number, d: number) => b & d | c & ~d,
        (b: number, c: number, d: number) => b ^ c ^ d,
        (b: number, c: number, d: number) => c ^ (b | ~d)
    ];
    const pss = [
        [7, 12, 17, 22],
        [5, 9, 14, 20],
        [4, 11, 16, 23],
        [6, 10, 15, 21],
    ];
    // 对齐字符串。
    value[count >> 5] |= 0x80 << (count % 32);
    value[(((count + 64) >>> 9) << 4) + 14] = count;
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let procIndex = 0;
    for (let i = 0; i < value.length; i += 16) {
        const oldA = a;
        const oldB = b;
        const oldC = c;
        const oldD = d;
        const proc = (j0: number, j1: number, j2: number, j3: number, ts0: number, ts1: number, ts2: number, ts3: number) => {
            const fn = fns[procIndex];
            const ps = pss[procIndex];
            a = combine(fn(b, c, d), a, b, value[i + j0], ps[0], ts0);
            d = combine(fn(a, b, c), d, a, value[i + j1], ps[1], ts1);
            c = combine(fn(d, a, b), c, d, value[i + j2], ps[2], ts2);
            b = combine(fn(c, d, a), b, c, value[i + j3], ps[3], ts3);
        };

        procIndex = 0;
        proc(0, 1, 2, 3, -680876936, -389564586, 606105819, -1044525330);
        proc(4, 5, 6, 7, -176418897, 1200080426, -1473231341, -45705983);
        proc(8, 9, 10, 11, 1770035416, -1958414417, -42063, -1990404162);
        proc(12, 13, 14, 15, 1804603682, -40341101, -1502002290, 1236535329);

        procIndex = 1;
        proc(1, 6, 11, 0, -165796510, -1069501632, 643717713, -373897302);
        proc(5, 10, 15, 4, -701558691, 38016083, -660478335, -405537848);
        proc(9, 14, 3, 8, 568446438, -1019803690, -187363961, 1163531501);
        proc(13, 2, 7, 12, -1444681467, -51403784, 1735328473, -1926607734);

        procIndex = 2;
        proc(5, 8, 11, 14, -378558, -2022574463, 1839030562, -35309556);
        proc(1, 4, 7, 10, -1530992060, 1272893353, -155497632, -1094730640);
        proc(13, 0, 3, 6, 681279174, -358537222, -722521979, 76029189);
        proc(9, 12, 15, 2, -640364487, -421815835, 530742520, -995338651);

        procIndex = 3;
        proc(0, 7, 14, 5, -198630844, 1126891415, -1416354905, -57434055);
        proc(12, 3, 10, 1, 1700485571, -1894986606, -1051523, -2054922799);
        proc(8, 15, 6, 13, 1873313359, -30611744, -1560198380, 1309151649);
        proc(4, 11, 2, 9, -145523070, -1120210379, 718787259, -343485551);

        a = safeAdd(a, oldA);
        b = safeAdd(b, oldB);
        c = safeAdd(c, oldC);
        d = safeAdd(d, oldD);
    }
    return [a, b, c, d];
}

function safeAdd(x: number, y: number) {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    return ((x >> 16) + (y >> 16) + (lsw >> 16)) << 16 | lsw & 0xFFFF;
}

function combine(q: number, a: number, b: number, x: number, str: number, t: number) {
    const num = safeAdd(safeAdd(a, q), safeAdd(x, t));
    return safeAdd((num << str) | (num >>> (32 - str)), b);
}
