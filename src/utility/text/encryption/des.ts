// #todo

/**
 * 计算一个字符串的 DES 值。
 * @param value 要计算的字符串。
 * @param key 加密使用的密钥。
 * @param decrypt = false 如果是 true 则表示解密，否则表示加密。
 * @param cbc = false 是否使用密码段链接（Cipher Block Chaining，CBC）模式。
 * @param iv 初始向量。
 * @param padding = 0 对齐字符数，可以是 0、1 或 2。
 * @returns 返回加密后的字符串。
 * @example des("a", "1") // "UDtçø"
 */
export function des(value: string, key: string, decrypt?: boolean, cbc?: boolean, iv?: string, padding?: number) {

    const sp1 = [0x1010400, 0, 0x10000, 0x1010404, 0x1010004, 0x10404, 0x4, 0x10000, 0x400, 0x1010400, 0x1010404, 0x400, 0x1000404, 0x1010004, 0x1000000, 0x4, 0x404, 0x1000400, 0x1000400, 0x10400, 0x10400, 0x1010000, 0x1010000, 0x1000404, 0x10004, 0x1000004, 0x1000004, 0x10004, 0, 0x404, 0x10404, 0x1000000, 0x10000, 0x1010404, 0x4, 0x1010000, 0x1010400, 0x1000000, 0x1000000, 0x400, 0x1010004, 0x10000, 0x10400, 0x1000004, 0x400, 0x4, 0x1000404, 0x10404, 0x1010404, 0x10004, 0x1010000, 0x1000404, 0x1000004, 0x404, 0x10404, 0x1010400, 0x404, 0x1000400, 0x1000400, 0, 0x10004, 0x10400, 0, 0x1010004];
    const sp2 = [-0x7fef7fe0, -0x7fff8000, 0x8000, 0x108020, 0x100000, 0x20, -0x7fefffe0, -0x7fff7fe0, -0x7fffffe0, -0x7fef7fe0, -0x7fef8000, -0x80000000, -0x7fff8000, 0x100000, 0x20, -0x7fefffe0, 0x108000, 0x100020, -0x7fff7fe0, 0, -0x80000000, 0x8000, 0x108020, -0x7ff00000, 0x100020, -0x7fffffe0, 0, 0x108000, 0x8020, -0x7fef8000, -0x7ff00000, 0x8020, 0, 0x108020, -0x7fefffe0, 0x100000, -0x7fff7fe0, -0x7ff00000, -0x7fef8000, 0x8000, -0x7ff00000, -0x7fff8000, 0x20, -0x7fef7fe0, 0x108020, 0x20, 0x8000, -0x80000000, 0x8020, -0x7fef8000, 0x100000, -0x7fffffe0, 0x100020, -0x7fff7fe0, -0x7fffffe0, 0x100020, 0x108000, 0, -0x7fff8000, 0x8020, -0x80000000, -0x7fefffe0, -0x7fef7fe0, 0x108000];
    const sp3 = [0x208, 0x8020200, 0, 0x8020008, 0x8000200, 0, 0x20208, 0x8000200, 0x20008, 0x8000008, 0x8000008, 0x20000, 0x8020208, 0x20008, 0x8020000, 0x208, 0x8000000, 0x8, 0x8020200, 0x200, 0x20200, 0x8020000, 0x8020008, 0x20208, 0x8000208, 0x20200, 0x20000, 0x8000208, 0x8, 0x8020208, 0x200, 0x8000000, 0x8020200, 0x8000000, 0x20008, 0x208, 0x20000, 0x8020200, 0x8000200, 0, 0x200, 0x20008, 0x8020208, 0x8000200, 0x8000008, 0x200, 0, 0x8020008, 0x8000208, 0x20000, 0x8000000, 0x8020208, 0x8, 0x20208, 0x20200, 0x8000008, 0x8020000, 0x8000208, 0x208, 0x8020000, 0x20208, 0x8, 0x8020008, 0x20200];
    const sp4 = [0x802001, 0x2081, 0x2081, 0x80, 0x802080, 0x800081, 0x800001, 0x2001, 0, 0x802000, 0x802000, 0x802081, 0x81, 0, 0x800080, 0x800001, 0x1, 0x2000, 0x800000, 0x802001, 0x80, 0x800000, 0x2001, 0x2080, 0x800081, 0x1, 0x2080, 0x800080, 0x2000, 0x802080, 0x802081, 0x81, 0x800080, 0x800001, 0x802000, 0x802081, 0x81, 0, 0, 0x802000, 0x2080, 0x800080, 0x800081, 0x1, 0x802001, 0x2081, 0x2081, 0x80, 0x802081, 0x81, 0x1, 0x2000, 0x800001, 0x2001, 0x802080, 0x800081, 0x2001, 0x2080, 0x800000, 0x802001, 0x80, 0x800000, 0x2000, 0x802080];
    const sp5 = [0x100, 0x2080100, 0x2080000, 0x42000100, 0x80000, 0x100, 0x40000000, 0x2080000, 0x40080100, 0x80000, 0x2000100, 0x40080100, 0x42000100, 0x42080000, 0x80100, 0x40000000, 0x2000000, 0x40080000, 0x40080000, 0, 0x40000100, 0x42080100, 0x42080100, 0x2000100, 0x42080000, 0x40000100, 0, 0x42000000, 0x2080100, 0x2000000, 0x42000000, 0x80100, 0x80000, 0x42000100, 0x100, 0x2000000, 0x40000000, 0x2080000, 0x42000100, 0x40080100, 0x2000100, 0x40000000, 0x42080000, 0x2080100, 0x40080100, 0x100, 0x2000000, 0x42080000, 0x42080100, 0x80100, 0x42000000, 0x42080100, 0x2080000, 0, 0x40080000, 0x42000000, 0x80100, 0x2000100, 0x40000100, 0x80000, 0, 0x40080000, 0x2080100, 0x40000100];
    const sp6 = [0x20000010, 0x20400000, 0x4000, 0x20404010, 0x20400000, 0x10, 0x20404010, 0x400000, 0x20004000, 0x404010, 0x400000, 0x20000010, 0x400010, 0x20004000, 0x20000000, 0x4010, 0, 0x400010, 0x20004010, 0x4000, 0x404000, 0x20004010, 0x10, 0x20400010, 0x20400010, 0, 0x404010, 0x20404000, 0x4010, 0x404000, 0x20404000, 0x20000000, 0x20004000, 0x10, 0x20400010, 0x404000, 0x20404010, 0x400000, 0x4010, 0x20000010, 0x400000, 0x20004000, 0x20000000, 0x4010, 0x20000010, 0x20404010, 0x404000, 0x20400000, 0x404010, 0x20404000, 0, 0x20400010, 0x10, 0x4000, 0x20400000, 0x404010, 0x4000, 0x400010, 0x20004010, 0, 0x20404000, 0x20000000, 0x400010, 0x20004010];
    const sp7 = [0x200000, 0x4200002, 0x4000802, 0, 0x800, 0x4000802, 0x200802, 0x4200800, 0x4200802, 0x200000, 0, 0x4000002, 0x2, 0x4000000, 0x4200002, 0x802, 0x4000800, 0x200802, 0x200002, 0x4000800, 0x4000002, 0x4200000, 0x4200800, 0x200002, 0x4200000, 0x800, 0x802, 0x4200802, 0x200800, 0x2, 0x4000000, 0x200800, 0x4000000, 0x200800, 0x200000, 0x4000802, 0x4000802, 0x4200002, 0x4200002, 0x2, 0x200002, 0x4000000, 0x4000800, 0x200000, 0x4200800, 0x802, 0x200802, 0x4200800, 0x802, 0x4000002, 0x4200802, 0x4200000, 0x200800, 0, 0x2, 0x4200802, 0, 0x200802, 0x4200000, 0x800, 0x4000002, 0x4000800, 0x800, 0x200002];
    const sp8 = [0x10001040, 0x1000, 0x40000, 0x10041040, 0x10000000, 0x10001040, 0x40, 0x10000000, 0x40040, 0x10040000, 0x10041040, 0x41000, 0x10041000, 0x41040, 0x1000, 0x40, 0x10040000, 0x10000040, 0x10001000, 0x1040, 0x41000, 0x40040, 0x10040040, 0x10041000, 0x1040, 0, 0, 0x10040040, 0x10000040, 0x10001000, 0x41040, 0x40000, 0x41040, 0x40000, 0x10041000, 0x1000, 0x40, 0x10040040, 0x1000, 0x41040, 0x10001000, 0x40, 0x10000040, 0x10040000, 0x10040040, 0x10000000, 0x40000, 0x10001040, 0, 0x10041040, 0x40040, 0x10000040, 0x10040000, 0x10001000, 0x10001040, 0, 0x10041040, 0x41000, 0x41000, 0x1040, 0x1040, 0x40040, 0x10000000, 0x10041000];

    // 转换加密键字符串为初始化向量。
    const keys = des["createKeys"](key);

    // 计算循环次数，3: 单次；9：双次。
    const count = keys.length === 32 ? 3 : 9;
    // 每次循环的向量。    const shifts = decrypt ? count == 3 ? [30, -2, -2] : [94, 62, -2, 32, 64, 2, 30, -2, -2] :
        count == 3 ? [0, 32, 2] : [0, 32, 2, 62, 30, -2, 64, 96, 2];

    let len = value.length;

    // 对齐字符串。    switch (padding) {
        case 2:
            value += " ";
            break;        case 1:
            let t = 8 - (len % 8);
            value += String.fromCharCode(t, t, t, t, t, t, t, t);
            if (t == 8) len += 8;
            break;
        //PKCS7 padding
        default:
            value += "\0\0\0\0\0\0\0\0";    }

    //store the result here
    let result = "";
    let tempresult = "";
    // CBC 支持。
    let cbcleft: number;
    let cbcleft2: number;
    let cbcright: number;
    let cbcright2: number;
    if (cbc) {
        cbcleft = iv.charCodeAt(0) << 24 | iv.charCodeAt(1) << 16 | iv.charCodeAt(2) << 8 | iv.charCodeAt(3);
        cbcright = iv.charCodeAt(4) << 24 | iv.charCodeAt(5) << 16 | iv.charCodeAt(6) << 8 | iv.charCodeAt(7);
    }

    let chunk = 0;
    for (let m = 0; m < len;) {
        let left = value.charCodeAt(m++) << 24 | value.charCodeAt(m++) << 16 | value.charCodeAt(m++) << 8 | value.charCodeAt(m++);
        let right = value.charCodeAt(m++) << 24 | value.charCodeAt(m++) << 16 | value.charCodeAt(m++) << 8 | value.charCodeAt(m++);

        // 对之前的结果做异或操作。
        if (cbc) {
            if (decrypt) {
                cbcleft2 = cbcleft;
                cbcright2 = cbcright;
                cbcleft = left;
                cbcright = right;
            } else {
                left ^= cbcleft;
                right ^= cbcright;
            }
        }

        // 计算第一步。
        let temp = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= temp; left ^= temp << 4;
        temp = ((left >>> 16) ^ right) & 0x0000ffff; right ^= temp; left ^= temp << 16;
        temp = ((right >>> 2) ^ left) & 0x33333333; left ^= temp; right ^= temp << 2;
        temp = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= temp; right ^= temp << 8;
        temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= temp << 1;

        left = left << 1 | left >>> 31;
        right = right << 1 | right >>> 31;

        // 处理每个片段。
        for (let i = 0; i < count; i += 3) {
            const endloop = shifts[i + 1];
            const loopinc = shifts[i + 2];
            //now go through and perform the encryption or decryption
            for (let j = shifts[i]; j != endloop; j += loopinc) { //for efficiency
                const right1 = right ^ keys[j];
                const right2 = ((right >>> 4) | (right << 28)) ^ keys[j + 1];
                //the result is attained by passing these bytes through the S selection functions
                temp = left;
                left = right;
                right = temp ^ (sp2[(right1 >>> 24) & 0x3f] | sp4[(right1 >>> 16) & 0x3f]
                    | sp6[(right1 >>> 8) & 0x3f] | sp8[right1 & 0x3f]
                    | sp1[(right2 >>> 24) & 0x3f] | sp3[(right2 >>> 16) & 0x3f]
                    | sp5[(right2 >>> 8) & 0x3f] | sp7[right2 & 0x3f]);
            }

            // 交换 left 和 right。
            temp = left; left = right; right = temp;
        }

        //move then each one bit to the right
        left = left >>> 1 | left << 31;
        right = right >>> 1 | right << 31;

        //now perform IP-1, which is IP in the opposite direction
        temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);
        temp = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= temp; right ^= (temp << 8);
        temp = ((right >>> 2) ^ left) & 0x33333333; left ^= temp; right ^= (temp << 2);
        temp = ((left >>> 16) ^ right) & 0x0000ffff; right ^= temp; left ^= (temp << 16);
        temp = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= temp; left ^= (temp << 4);

        //for Cipher Block Chaining mode, xor the str with the previous result
        if (cbc) {
            if (decrypt) {
                left ^= cbcleft2;
                right ^= cbcright2;
            } else {
                cbcleft = left;
                cbcright = right;
            }
        }
        tempresult += String.fromCharCode((left >>> 24), ((left >>> 16) & 0xff), ((left >>> 8) & 0xff), (left & 0xff), (right >>> 24), ((right >>> 16) & 0xff), ((right >>> 8) & 0xff), (right & 0xff));

        chunk += 8;
        if (chunk == 512) { result += tempresult; tempresult = ""; chunk = 0; }
    }

    return result + tempresult;
}

/**
 * 编码键向量。
 * @inner
 */
des["createKeys"] = function (key: string) {
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

    // 计算循环次数，(des: 1, triple des: 3)
    const count = key.length > 8 ? 3 : 1;

    let result = new Array<number>(count * 32);
    let m = 0;
    let n = 0;
    for (let i = 0; i < count; i++) {
        let left = key.charCodeAt(m++) << 24 | key.charCodeAt(m++) << 16 | key.charCodeAt(m++) << 8 | key.charCodeAt(m++);
        let right = key.charCodeAt(m++) << 24 | key.charCodeAt(m++) << 16 | key.charCodeAt(m++) << 8 | key.charCodeAt(m++);
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

            //now apply PC-2, in such a way that E is easier when encrypting or decrypting
            //this conversion will look like PC-2 except only the last 6 bits of each byte are used
            //rather than 48 consecutive bits and the order of lines will be according to
            //how the S selection functions will be applied: S2, S4, S6, S8, S1, S3, S5, S7
            const lefttemp = pc2bytes0[left >>> 28] | pc2bytes1[(left >>> 24) & 0xf]
                | pc2bytes2[(left >>> 20) & 0xf] | pc2bytes3[(left >>> 16) & 0xf]
                | pc2bytes4[(left >>> 12) & 0xf] | pc2bytes5[(left >>> 8) & 0xf]
                | pc2bytes6[(left >>> 4) & 0xf];
            const righttemp = pc2bytes7[right >>> 28] | pc2bytes8[(right >>> 24) & 0xf]
                | pc2bytes9[(right >>> 20) & 0xf] | pc2bytes10[(right >>> 16) & 0xf]
                | pc2bytes11[(right >>> 12) & 0xf] | pc2bytes12[(right >>> 8) & 0xf]
                | pc2bytes13[(right >>> 4) & 0xf];

            t = (righttemp >>> 16 ^ lefttemp) & 0x0000ffff;
            result[n++] = lefttemp ^ t;
            result[n++] = righttemp ^ t << 16;
        }
    }

    return result;
};
