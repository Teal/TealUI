
// #region 字符串

/**
 * 解密指定的字符串。
 * @param value 要解密的字符串。
 * @param key 解密的密钥。
 * @returns 返回解密后的字符串。
 * @example dencryptString("abc", 123) // "cce"
 * @see encryptString
 */
export function dencryptString(value: string, key = 19901206) {
    let t = [];
    const end = value.length - 1;

    for (let i = end; i >= 0; i--) {
        t[i] = ~(value.charCodeAt(i) ^ (~(i + end)));
    }

    const rkey = ~key;
    const last = t[end];
    for (let i = end; i >= 0; i--) {
        t[i] = ((t[i] & rkey) | ((i === 0 ? last : (t[i - 1])) & key));
    }

    for (let i = end; i >= 0; i--) {
        t[i] = String.fromCharCode(t[i]);
    }

    return t.join('');
}

/**
 * 加密指定的字符串。
 * @param value 要加密的字符串。
 * @param key 加密的密钥。
 * @returns 返回加密后的字符串。
 * @example encryptString("abc", 123) // "``e"
 * @see dencryptString
 */
export function encryptString(value: string, key = 19901206) {
    let t = [];
    const length = value.length;
    const rkey = ~key;
    for (let i = 0; i <= length; i++) {
        t[i] = String.fromCharCode(~((value.charCodeAt(i) & rkey | (i === length ? value.charCodeAt(0) : value.charCodeAt(i + 1)) & key) ^ ~(i + length)));
    }
    return t.join('');
}

// #endregion

// #region DES

/**
 * 计算一个字符串的 DES 值。
 * @param value 要计算的字符串。
 * @param key 加密使用的密钥。
 * @param decrypt = false 如果是 true 则表示解密，否则表示加密。
 * @param iv 如果使用密码段链接（Cipher Block Chaining，CBC）模式，则提供初始向量；如果未提供则不适用此模式。
 * @param padding = 0 对齐字符数，可以是 0、1 或 2。
 * @returns 返回加密后的字符串。
 * @example des("a", "1")
 */
export function des(value: string, key: string, decrypt?: boolean, iv?: string, padding?: number) {

    const sp1 = [16843776, 0, 0x10000, 0x1010404, 0x1010004, 0x10404, 0x4, 0x10000, 0x400, 0x1010400, 0x1010404, 0x400, 0x1000404, 0x1010004, 0x1000000, 0x4, 0x404, 0x1000400, 0x1000400, 0x10400, 0x10400, 0x1010000, 0x1010000, 0x1000404, 0x10004, 0x1000004, 0x1000004, 0x10004, 0, 0x404, 0x10404, 0x1000000, 0x10000, 0x1010404, 0x4, 0x1010000, 0x1010400, 0x1000000, 0x1000000, 0x400, 0x1010004, 0x10000, 0x10400, 0x1000004, 0x400, 0x4, 0x1000404, 0x10404, 0x1010404, 0x10004, 0x1010000, 0x1000404, 0x1000004, 0x404, 0x10404, 0x1010400, 0x404, 0x1000400, 0x1000400, 0, 0x10004, 0x10400, 0, 0x1010004];
    const sp2 = [-0x7fef7fe0, -0x7fff8000, 0x8000, 0x108020, 0x100000, 0x20, -0x7fefffe0, -0x7fff7fe0, -0x7fffffe0, -0x7fef7fe0, -0x7fef8000, -0x80000000, -0x7fff8000, 0x100000, 0x20, -0x7fefffe0, 0x108000, 0x100020, -0x7fff7fe0, 0, -0x80000000, 0x8000, 0x108020, -0x7ff00000, 0x100020, -0x7fffffe0, 0, 0x108000, 0x8020, -0x7fef8000, -0x7ff00000, 0x8020, 0, 0x108020, -0x7fefffe0, 0x100000, -0x7fff7fe0, -0x7ff00000, -0x7fef8000, 0x8000, -0x7ff00000, -0x7fff8000, 0x20, -0x7fef7fe0, 0x108020, 0x20, 0x8000, -0x80000000, 0x8020, -0x7fef8000, 0x100000, -0x7fffffe0, 0x100020, -0x7fff7fe0, -0x7fffffe0, 0x100020, 0x108000, 0, -0x7fff8000, 0x8020, -0x80000000, -0x7fefffe0, -0x7fef7fe0, 0x108000];
    const sp3 = [0x208, 0x8020200, 0, 0x8020008, 0x8000200, 0, 0x20208, 0x8000200, 0x20008, 0x8000008, 0x8000008, 0x20000, 0x8020208, 0x20008, 0x8020000, 0x208, 0x8000000, 0x8, 0x8020200, 0x200, 0x20200, 0x8020000, 0x8020008, 0x20208, 0x8000208, 0x20200, 0x20000, 0x8000208, 0x8, 0x8020208, 0x200, 0x8000000, 0x8020200, 0x8000000, 0x20008, 0x208, 0x20000, 0x8020200, 0x8000200, 0, 0x200, 0x20008, 0x8020208, 0x8000200, 0x8000008, 0x200, 0, 0x8020008, 0x8000208, 0x20000, 0x8000000, 0x8020208, 0x8, 0x20208, 0x20200, 0x8000008, 0x8020000, 0x8000208, 0x208, 0x8020000, 0x20208, 0x8, 0x8020008, 0x20200];
    const sp4 = [0x802001, 0x2081, 0x2081, 0x80, 0x802080, 0x800081, 0x800001, 0x2001, 0, 0x802000, 0x802000, 0x802081, 0x81, 0, 0x800080, 0x800001, 0x1, 0x2000, 0x800000, 0x802001, 0x80, 0x800000, 0x2001, 0x2080, 0x800081, 0x1, 0x2080, 0x800080, 0x2000, 0x802080, 0x802081, 0x81, 0x800080, 0x800001, 0x802000, 0x802081, 0x81, 0, 0, 0x802000, 0x2080, 0x800080, 0x800081, 0x1, 0x802001, 0x2081, 0x2081, 0x80, 0x802081, 0x81, 0x1, 0x2000, 0x800001, 0x2001, 0x802080, 0x800081, 0x2001, 0x2080, 0x800000, 0x802001, 0x80, 0x800000, 0x2000, 0x802080];
    const sp5 = [0x100, 0x2080100, 0x2080000, 0x42000100, 0x80000, 0x100, 0x40000000, 0x2080000, 0x40080100, 0x80000, 0x2000100, 0x40080100, 0x42000100, 0x42080000, 0x80100, 0x40000000, 0x2000000, 0x40080000, 0x40080000, 0, 0x40000100, 0x42080100, 0x42080100, 0x2000100, 0x42080000, 0x40000100, 0, 0x42000000, 0x2080100, 0x2000000, 0x42000000, 0x80100, 0x80000, 0x42000100, 0x100, 0x2000000, 0x40000000, 0x2080000, 0x42000100, 0x40080100, 0x2000100, 0x40000000, 0x42080000, 0x2080100, 0x40080100, 0x100, 0x2000000, 0x42080000, 0x42080100, 0x80100, 0x42000000, 0x42080100, 0x2080000, 0, 0x40080000, 0x42000000, 0x80100, 0x2000100, 0x40000100, 0x80000, 0, 0x40080000, 0x2080100, 0x40000100];
    const sp6 = [0x20000010, 0x20400000, 0x4000, 0x20404010, 0x20400000, 0x10, 0x20404010, 0x400000, 0x20004000, 0x404010, 0x400000, 0x20000010, 0x400010, 0x20004000, 0x20000000, 0x4010, 0, 0x400010, 0x20004010, 0x4000, 0x404000, 0x20004010, 0x10, 0x20400010, 0x20400010, 0, 0x404010, 0x20404000, 0x4010, 0x404000, 0x20404000, 0x20000000, 0x20004000, 0x10, 0x20400010, 0x404000, 0x20404010, 0x400000, 0x4010, 0x20000010, 0x400000, 0x20004000, 0x20000000, 0x4010, 0x20000010, 0x20404010, 0x404000, 0x20400000, 0x404010, 0x20404000, 0, 0x20400010, 0x10, 0x4000, 0x20400000, 0x404010, 0x4000, 0x400010, 0x20004010, 0, 0x20404000, 0x20000000, 0x400010, 0x20004010];
    const sp7 = [0x200000, 0x4200002, 0x4000802, 0, 0x800, 0x4000802, 0x200802, 0x4200800, 0x4200802, 0x200000, 0, 0x4000002, 0x2, 0x4000000, 0x4200002, 0x802, 0x4000800, 0x200802, 0x200002, 0x4000800, 0x4000002, 0x4200000, 0x4200800, 0x200002, 0x4200000, 0x800, 0x802, 0x4200802, 0x200800, 0x2, 0x4000000, 0x200800, 0x4000000, 0x200800, 0x200000, 0x4000802, 0x4000802, 0x4200002, 0x4200002, 0x2, 0x200002, 0x4000000, 0x4000800, 0x200000, 0x4200800, 0x802, 0x200802, 0x4200800, 0x802, 0x4000002, 0x4200802, 0x4200000, 0x200800, 0, 0x2, 0x4200802, 0, 0x200802, 0x4200000, 0x800, 0x4000002, 0x4000800, 0x800, 0x200002];
    const sp8 = [0x10001040, 0x1000, 0x40000, 0x10041040, 0x10000000, 0x10001040, 0x40, 0x10000000, 0x40040, 0x10040000, 0x10041040, 0x41000, 0x10041000, 0x41040, 0x1000, 0x40, 0x10040000, 0x10000040, 0x10001000, 0x1040, 0x41000, 0x40040, 0x10040040, 0x10041000, 0x1040, 0, 0, 0x10040040, 0x10000040, 0x10001000, 0x41040, 0x40000, 0x41040, 0x40000, 0x10041000, 0x1000, 0x40, 0x10040040, 0x1000, 0x41040, 0x10001000, 0x40, 0x10000040, 0x10040000, 0x10040040, 0x10000000, 0x40000, 0x10001040, 0, 0x10041040, 0x40040, 0x10000040, 0x10040000, 0x10001000, 0x10001040, 0, 0x10041040, 0x41000, 0x41000, 0x1040, 0x1040, 0x40040, 0x10000000, 0x10041000];

    // 转换加密键字符串为初始化向量。
    const keys = des.createKeys(key);

    // 计算循环次数(单次 = 3, 双次 = 9)。
    const count = keys.length === 32 ? 3 : 9;

    // 每次循环的向量。
    const loops = decrypt ? count == 3 ? [30, -2, -2] : [94, 62, -2, 32, 64, 2, 30, -2, -2] :
        count == 3 ? [0, 32, 2] : [0, 32, 2, 62, 30, -2, 64, 96, 2];

    let len = value.length;

    // 对齐字符串。
    switch (padding) {
        case 2:
            value += " ";
            break;
        case 1:
            let t = 8 - (len % 8);
            value += String.fromCharCode(t, t, t, t, t, t, t, t);
            if (t == 8) len += 8;
            break;
        //PKCS7 padding
        default:
            value += "\0\0\0\0\0\0\0\0";
    }

    //store the result here
    let result = "";
    let current = "";

    // CBC 支持。
    let cbcLeft: number;
    let cbcRight: number;
    if (iv) {
        cbcLeft = iv.charCodeAt(0) << 24 | iv.charCodeAt(1) << 16 | iv.charCodeAt(2) << 8 | iv.charCodeAt(3);
        cbcRight = iv.charCodeAt(4) << 24 | iv.charCodeAt(5) << 16 | iv.charCodeAt(6) << 8 | iv.charCodeAt(7);
    }

    let chunk = 0;
    for (let p = 0; p < len;) {

        let left: number;
        let right: number;
        if (decrypt) {
            left = value.charCodeAt(p++) << 24 | value.charCodeAt(p++) << 16 | value.charCodeAt(p++) << 8 | value.charCodeAt(p++);
            right = value.charCodeAt(p++) << 24 | value.charCodeAt(p++) << 16 | value.charCodeAt(p++) << 8 | value.charCodeAt(p++);
        } else {
            left = value.charCodeAt(p++) << 16 | value.charCodeAt(p++);
            right = value.charCodeAt(p++) << 16 | value.charCodeAt(p++);
        }

        // 对之前的结果做异或操作。
        let oldCbcLeft: number;
        let oldCbcRight: number;
        if (iv) {
            if (decrypt) {
                oldCbcLeft = cbcLeft;
                oldCbcRight = cbcRight;
                cbcLeft = left;
                cbcRight = right;
            } else {
                left ^= cbcLeft;
                right ^= cbcRight;
            }
        }

        let t;
        t = (left >>> 4 ^ right) & 0x0f0f0f0f; right ^= t; left ^= t << 4;
        t = (left >>> 16 ^ right) & 0x0000ffff; right ^= t; left ^= t << 16;
        t = (right >>> 2 ^ left) & 0x33333333; left ^= t; right ^= t << 2;
        t = (right >>> 8 ^ left) & 0x00ff00ff; left ^= t; right ^= t << 8;
        t = (left >>> 1 ^ right) & 0x55555555; right ^= t; left ^= t << 1;

        left = left << 1 | left >>> 31;
        right = right << 1 | right >>> 31;

        // 处理每个片段。
        for (let i = 0; i < count; i += 3) {
            const end = loops[i + 1];
            const step = loops[i + 2];

            // 执行加密算法。
            for (let j = loops[i]; j != end; j += step) {
                const r1 = right ^ keys[j];
                const r2 = (right >>> 4 | right << 28) ^ keys[j + 1];

                t = left;
                left = right;
                right = t ^ (sp2[r1 >>> 24 & 0x3f] | sp4[r1 >>> 16 & 0x3f]
                    | sp6[r1 >>> 8 & 0x3f] | sp8[r1 & 0x3f]
                    | sp1[r2 >>> 24 & 0x3f] | sp3[r2 >>> 16 & 0x3f]
                    | sp5[r2 >>> 8 & 0x3f] | sp7[r2 & 0x3f]);
            }

            // 交换 left 和 right。
            t = left; left = right; right = t;
        }

        // 继续处理后 32 位。
        left = left >>> 1 | left << 31;
        right = right >>> 1 | right << 31;

        t = ((left >>> 1) ^ right) & 0x55555555; right ^= t; left ^= (t << 1);
        t = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= t; right ^= (t << 8);
        t = ((right >>> 2) ^ left) & 0x33333333; left ^= t; right ^= (t << 2);
        t = ((left >>> 16) ^ right) & 0x0000ffff; right ^= t; left ^= (t << 16);
        t = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= t; left ^= (t << 4);

        if (iv) {
            if (decrypt) {
                left ^= oldCbcLeft;
                right ^= oldCbcRight;
            } else {
                cbcLeft = left;
                cbcRight = right;
            }
        }

        if (decrypt) {
            current += String.fromCharCode(left >>> 16 & 0xffff, left & 0xffff, right >>> 24, right >>> 16 & 0xffff, right & 0xffff);
            chunk += 8;
        } else {
            current += String.fromCharCode(left >>> 24, left >>> 16 & 0xff, left >>> 8 & 0xff, left & 0xff, right >>> 24, right >>> 16 & 0xff, right >>> 8 & 0xff, right & 0xff);
            chunk += 16;
        }

        if (chunk == 512) { result += current; current = ""; chunk = 0; }
    }

    return result + current;
}

export module des {

    /**
     * 编码键向量。
     * @param key 字符串。
     * @internal
     */
    export function createKeys(key: string) {
        const pc2bytes0 = [0, 0x4, 0x20000000, 0x20000004, 0x10000, 0x10004, 0x20010000, 0x20010004, 0x200, 0x204, 0x20000200, 0x20000204, 0x10200, 0x10204, 0x20010200, 0x20010204];
        const pc2bytes1 = [0, 0x1, 0x100000, 0x100001, 0x4000000, 0x4000001, 0x4100000, 0x4100001, 0x100, 0x101, 0x100100, 0x100101, 0x4000100, 0x4000101, 0x4100100, 0x4100101];
        const pc2bytes2 = [0, 0x8, 0x800, 0x808, 0x1000000, 0x1000008, 0x1000800, 0x1000808, 0, 0x8, 0x800, 0x808, 0x1000000, 0x1000008, 0x1000800, 0x1000808];
        const pc2bytes3 = [0, 0x200000, 0x8000000, 0x8200000, 0x2000, 0x202000, 0x8002000, 0x8202000, 0x20000, 0x220000, 0x8020000, 0x8220000, 0x22000, 0x222000, 0x8022000, 0x8222000];
        const pc2bytes4 = [0, 0x40000, 0x10, 0x40010, 0, 0x40000, 0x10, 0x40010, 0x1000, 0x41000, 0x1010, 0x41010, 0x1000, 0x41000, 0x1010, 0x41010];
        const pc2bytes5 = [0, 0x400, 0x20, 0x420, 0, 0x400, 0x20, 0x420, 0x2000000, 0x2000400, 0x2000020, 0x2000420, 0x2000000, 0x2000400, 0x2000020, 0x2000420];
        const pc2bytes6 = [0, 0x10000000, 0x80000, 0x10080000, 0x2, 0x10000002, 0x80002, 0x10080002, 0, 0x10000000, 0x80000, 0x10080000, 0x2, 0x10000002, 0x80002, 0x10080002];
        const pc2bytes7 = [0, 0x10000, 0x800, 0x10800, 0x20000000, 0x20010000, 0x20000800, 0x20010800, 0x20000, 0x30000, 0x20800, 0x30800, 0x20020000, 0x20030000, 0x20020800, 0x20030800];
        const pc2bytes8 = [0, 0x40000, 0, 0x40000, 0x2, 0x40002, 0x2, 0x40002, 0x2000000, 0x2040000, 0x2000000, 0x2040000, 0x2000002, 0x2040002, 0x2000002, 0x2040002];
        const pc2bytes9 = [0, 0x10000000, 0x8, 0x10000008, 0, 0x10000000, 0x8, 0x10000008, 0x400, 0x10000400, 0x408, 0x10000408, 0x400, 0x10000400, 0x408, 0x10000408];
        const pc2bytes10 = [0, 0x20, 0, 0x20, 0x100000, 0x100020, 0x100000, 0x100020, 0x2000, 0x2020, 0x2000, 0x2020, 0x102000, 0x102020, 0x102000, 0x102020];
        const pc2bytes11 = [0, 0x1000000, 0x200, 0x1000200, 0x200000, 0x1200000, 0x200200, 0x1200200, 0x4000000, 0x5000000, 0x4000200, 0x5000200, 0x4200000, 0x5200000, 0x4200200, 0x5200200];
        const pc2bytes12 = [0, 0x1000, 0x8000000, 0x8001000, 0x80000, 0x81000, 0x8080000, 0x8081000, 0x10, 0x1010, 0x8000010, 0x8001010, 0x80010, 0x81010, 0x8080010, 0x8081010];
        const pc2bytes13 = [0, 0x4, 0x100, 0x104, 0, 0x4, 0x100, 0x104, 0x1, 0x5, 0x101, 0x105, 0x1, 0x5, 0x101, 0x105];

        const shifts = [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0];

        // 计算循环次数(单次 = 1, 双次 = 3)。
        const count = key.length > 8 ? 3 : 1;

        let result = new Array<number>(count * 32);
        let p = 0;
        let ri = 0;
        for (let i = 0; i < count; i++) {
            let left = key.charCodeAt(p++) << 24 | key.charCodeAt(p++) << 16 | key.charCodeAt(p++) << 8 | key.charCodeAt(p++);
            let right = key.charCodeAt(p++) << 24 | key.charCodeAt(p++) << 16 | key.charCodeAt(p++) << 8 | key.charCodeAt(p++);

            let t;
            t = (left >>> 4 ^ right) & 0x0f0f0f0f; right ^= t; left ^= t << 4;
            t = (right >>> -16 ^ left) & 0x0000ffff; left ^= t; right ^= t << -16;
            t = (left >>> 2 ^ right) & 0x33333333; right ^= t; left ^= t << 2;
            t = (right >>> -16 ^ left) & 0x0000ffff; left ^= t; right ^= t << -16;
            t = (left >>> 1 ^ right) & 0x55555555; right ^= t; left ^= t << 1;
            t = (right >>> 8 ^ left) & 0x00ff00ff; left ^= t; right ^= t << 8;
            t = (left >>> 1 ^ right) & 0x55555555; right ^= t; left ^= t << 1;

            // 最后的数据从开头获取。
            t = left << 8 | right >>> 20 & 0x000000f0;
            left = right << 24 | right << 8 & 0xff0000 | right >>> 8 & 0xff00 | right >>> 24 & 0xf0;
            right = t;

            // 计算每个键。
            for (let k = 0; k < shifts.length; k++) {
                if (shifts[k]) {
                    left = (left << 2) | (left >>> 26);
                    right = (right << 2) | (right >>> 26);
                } else {
                    left = (left << 1) | (left >>> 27);
                    right = (right << 1) | (right >>> 27);
                }
                left &= -0xf;
                right &= -0xf;

                // S2, S4, S6, S8, S1, S3, S5, S7
                const tl = pc2bytes0[left >>> 28] | pc2bytes1[(left >>> 24) & 0xf]
                    | pc2bytes2[(left >>> 20) & 0xf] | pc2bytes3[(left >>> 16) & 0xf]
                    | pc2bytes4[(left >>> 12) & 0xf] | pc2bytes5[(left >>> 8) & 0xf]
                    | pc2bytes6[(left >>> 4) & 0xf];
                const tr = pc2bytes7[right >>> 28] | pc2bytes8[(right >>> 24) & 0xf]
                    | pc2bytes9[(right >>> 20) & 0xf] | pc2bytes10[(right >>> 16) & 0xf]
                    | pc2bytes11[(right >>> 12) & 0xf] | pc2bytes12[(right >>> 8) & 0xf]
                    | pc2bytes13[(right >>> 4) & 0xf];

                t = (tr >>> 16 ^ tl) & 0x0000ffff;
                result[ri++] = tl ^ t;
                result[ri++] = tr ^ t << 16;
            }
        }

        return result;
    }

}

// #endregion

// #region MD5

/**
 * 计算一个字符串的 MD5 值。
 * @param value 要计算的字符串。
 * @returns 返回加密后的字符串。其所有字符均为小写。
 * @example md5("a") // "0cc175b9c0f1b6a831c399e269772661"
 */
export function md5(value: string) {
    return md5.binaryToString(md5.calc(md5.stringToBinary(value), value.length * md5.charSize));
}

export namespace md5 {

    /**
     * MD5 算法使用的字符集。如需更改 MD5 返回的大小写可更改此字段。
     * @internal
     */
    export const hexChars = "0123456789abcdef";

    /**
     * MD5 算法使用的字符大小。
     * @internal
     */
    export const charSize = 8;

    /**
     * 转换字符串到二进制。
     * 如果字符大于 255 ， 高位被截掉。
     * @internal
     */
    export function stringToBinary(value: string) {
        let result = [];
        for (let i = 0, len = value.length * md5.charSize, mask = (1 << md5.charSize) - 1; i < len; i += md5.charSize) {
            result[i >> 5] |= (value.charCodeAt(i / md5.charSize) & mask) << (i % 32);
        }
        return result;
    };

    /**
     * 转换数组到十六进的字符串。
     * @param 二进制数组。
     * @returns 字符串。
     * @internal
     */
    export function binaryToString(binArray: number[]) {
        let result = "";
        for (let i = 0; i < binArray.length * 4; i++) {
            result += md5.hexChars.charAt((binArray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + md5.hexChars.charAt((binArray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return result;
    };

    /**
     * 计算一个数组的 MD5 值。
     * @internal
     */
    export function calc(binArray: number[], length: number) {

        const fns = [
            function (b, c, d) { return (b & c) | ((~b) & d); },
            function (b, c, d) { return (b & d) | (c & (~d)); },
            function (b, c, d) { return b ^ c ^ d; },
            function (b, c, d) { return c ^ (b | (~d)); }
        ];

        const pss = [
            [7, 12, 17, 22],
            [5, 9, 14, 20],
            [4, 11, 16, 23],
            [6, 10, 15, 21],
        ];

        // 靠齐字符串
        binArray[length >> 5] |= 0x80 << ((length) % 32);
        binArray[(((length + 64) >>> 9) << 4) + 14] = length;

        let a = 1732584193;
        let b = -271733879;
        let c = -1732584194;
        let d = 271733878;
        let procIndex = 0;

        for (let i = 0; i < binArray.length; i += 16) {

            const oldA = a;
            const oldB = b;
            const oldC = c;
            const oldD = d;

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

            function proc(j0, j1, j2, j3, ts0, ts1, ts2, ts3) {
                const fn = fns[procIndex];
                const ps = pss[procIndex];
                a = combine(fn(b, c, d), a, b, binArray[i + j0], ps[0], ts0);
                d = combine(fn(a, b, c), d, a, binArray[i + j1], ps[1], ts1);
                c = combine(fn(d, a, b), c, d, binArray[i + j2], ps[2], ts2);
                b = combine(fn(c, d, a), b, c, binArray[i + j3], ps[3], ts3);
            }

        }

        return [a, b, c, d];

        function combine(q: number, a: number, b: number, x: number, str: number, t: number) {
            const num = safeAdd(safeAdd(a, q), safeAdd(x, t));
            return safeAdd((num << str) | (num >>> (32 - str)), b);
        }

        /**
         * 将32位数拆成高16位和低16位分别进行相加，从而实现 MOD 2^32 的加法。
         */
        function safeAdd(x: number, y: number) {
            const lsw = (x & 0xFFFF) + (y & 0xFFFF);
            return (x >> 16 + y >> 16 + lsw >> 16) << 16 | lsw & 0xFFFF;
        }

    };

}

// #endregion

// #region MD5 扩展

/**
 * MD5 扩展。
 */
export module md5 {

    /**
     * 计算一个字符串的 Base64-MD5 值。
     * @param value 要计算的字符串。
     * @returns 返回加密后的字符串。其所有字符均为大写。
     * @example md5.base64Md5("abc") // "kAFQmDzST7DWlj99KOF/cg"
     */
    export function base64Md5(value: string) {
        return binaryToBase64(md5.calc(md5.stringToBinary(value), value.length * md5.charSize));
    }

    /**
     * 计算一个字符串的 HMAC-MD5 值。
     * @param value 要计算的字符串。
     * @param key 加密的密钥。
     * @returns 返回加密后的字符串。其所有字符均为大写。
     * @example md5.hmacMd5("abc", "key") // "d2fe98063f876b03193afb49b4979591"
     */
    export function hmacMd5(value: string, key: string) {
        return md5.binaryToString(hmacMd5c(value, key));
    }

    /**
     * 计算一个字符串的 Base64-MD5 值。
     * @param value 要计算的字符串。
     * @param key 加密的密钥。
     * @returns 返回加密后的字符串。其所有字符均为大写。
     * @example md5.base64HmacMd5("abc", "key") // "0v6YBj+HawMZOvtJtJeVkQ"
     */
    export function base64HmacMd5(value: string, key: string) {
        return binaryToBase64(hmacMd5c(value, key));
    }

    /**
     * 计算 HMAC-MD5 。
     * @inner
     */
    export function hmacMd5c(value: string, key: string) {
        let bkey = md5.stringToBinary(key);
        if (bkey.length > 16) bkey = md5.calc(bkey, key.length * md5.charSize);

        let ipad = [];
        let opad = [];
        for (let i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        return md5.calc(opad.concat(md5.calc(ipad.concat(md5.stringToBinary(value)), 512 + value.length * md5.charSize)), 512 + 128);
    }

    /**
     * 转换数组到 base-64 的字符串。
     * @inner
     */
    export function binaryToBase64(binArray: number[], base64Pad?: string) {
        base64Pad = base64Pad || "";

        let result = "";
        for (let i = 0; i < binArray.length * 4; i += 3) {
            const triplet = (((binArray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) | (((binArray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) | ((binArray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
            for (let j = 0; j < 4; j++) {
                result += i * 8 + j * 6 > binArray.length * 32 ? base64Pad : ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((triplet >> 6 * (3 - j)) & 0x3F));
            }
        }
        return result;
    }

}

// #endregion

// #region SHA

/**
 * 计算一个字符串的 SHA-1 值。
 * @param value 要计算的字符串。
 * @returns 返回加密后的字符串。其所有字符均为小写。
 * @example sha1("abc") // "a9993e364706816aba3e25717850c26c9cd0d89d"
 */
export function sha1(value: string) {
    return sha1.binaryToString(sha1.calc(sha1.stringToBinary(value)));
}

export namespace sha1 {

    /**
     * SHA-1 算法使用的字符集。如需更改 SHA-1 返回的大小写可更改此字段。
     * @inner
     */
    export const hexChars = "0123456789abcdef";

    /**
     * SHA-1 算法使用的字符大小。
     * @inner
     */
    export const charSize = 8;

    /**
     * 转换字符串到二进制。
     * 如果字符大于 255 ， 高位被截掉。
     * @internal
     */
    export function stringToBinary(value: string) {
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
     * @internal
     */
    export function binaryToString(binArray: number[]) {
        let result = "";
        for (let i = 0; i < binArray.length * 4; i++) {
            result += sha1.hexChars.charAt((binArray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + sha1.hexChars.charAt((binArray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
        }
        return result;
    };

    /**
     * 计算一个数组的 SHA-1 值。
     * @inner
     */
    export function calc(binArray: number[]) {

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

}

// #endregion
