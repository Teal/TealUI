/**
 * @fileOverview MD5 加密扩展
 * @author xuld@vip.qq.com
 */

import './md5';
export declare module md5 {
    const charSize: number;
    function calc(value: number[], length: number): number[];
    function stringToBinary(value: string): number[];
    function binaryToString(value: number[]): string;
}

export module md5 {

    /**
     * 使用 MD5 和 Base64 算法加密指定字符串。
     * @param value 要计算的字符串。
     * @returns 返回加密后的字符串，其中只包含小写字母。
     * @example md5.base64Md5("abc") // "kAFQmDzST7DWlj99KOF/cg"
     */
    export function base64Md5(value: string) {
        return binaryToBase64(md5.calc(md5.stringToBinary(value), value.length * md5.charSize));
    }

    /**
     * 使用 HMAC-MD5 算法加密指定字符串。
     * @param value 要计算的字符串。
     * @param key 加密的密钥。
     * @returns 返回加密后的字符串，其中只包含小写字母。
     * @example md5.hmacMd5("abc", "key") // "d2fe98063f876b03193afb49b4979591"
     */
    export function hmacMd5(value: string, key: string) {
        return md5.binaryToString(hmacMd5c(value, key));
    }

    /**
     * 使用 HMAC-MD5 和 Base64 算法加密指定字符串。
     * @param value 要计算的字符串。
     * @param key 加密的密钥。
     * @returns 返回加密后的字符串，其中只包含小写字母。
     * @example md5.base64HmacMd5("abc", "key") // "0v6YBj+HawMZOvtJtJeVkQ"
     */
    export function base64HmacMd5(value: string, key: string) {
        return binaryToBase64(hmacMd5c(value, key));
    }

    /**
     * 执行 HMAC-MD5 加密算法。
     * @param value 要计算的字符串。
     * @param key 加密的密钥。
     * @private
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
     * 将字节数组转为 Base64。
     * @param value 要解码的二进制数组。
     * @returns 返回字符串。
     * @private
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
