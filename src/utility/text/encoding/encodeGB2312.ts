
import {Gb2312Dict} from './gb2312dict';

declare function escape(value: string): string;

/**
 * 对指定的字符串进行 GB2312 编码。
 * @param value 要转换的字符串。
 * @returns 转换后的字符串。
 * @example encodeGB2312("你") // "%C4%E3"
 */
export function encodeGB2312(value: string) {
    let result = "";
    for (let i = 0; i < value.length; i++) {
        let c = value.charCodeAt(i) - 0x4e00;
        if (c >= 0) {
            let t = Gb2312Dict[c];
            result += "%" + t.substr(0, 2) + "%" + t.substr(2);
        } else {
            let t = value.charAt(i);
            result += t === " " ? "+" : escape(t);
        }
    }
    return result;
}
