
import {Gb2312Dict} from './gb2312dict';

declare function unescape(value: string): string;

/**
 * 对指定的字符串进行 GB2312 解码。
 * @param value 要转换的字符串。
 * @returns 转换后的字符串。
 * @example decodeGB2312("%C4%E3") // "你"
 */
export function decodeGB2312(value: string) {
    return value.replace(/%([\da-f][\da-f])(%([\da-f][\da-f]))?/ig, (all: string, x: string, __, y: string) => {
        if (!y) return String.fromCharCode(parseInt(x, 16));
        var p = Gb2312Dict.indexOf((x + y).toUpperCase());
        return p >= 0 ? String.fromCharCode(0x4e00 + p) : unescape(all);
    });
}
