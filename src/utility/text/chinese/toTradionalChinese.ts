
import {TradionalChineseDict} from './tradionalChineseDict';

/**
 * 将简体中文转为繁体中文。
 * @param value 要处理的中文。
 * @returns 返回转换后的中文。
 * @example toTradionalChinese("简") // "簡"
 * @see toSimpleChinese
 */
export function toTradionalChinese(value: string) {
    return TradionalChineseDict.convert(value, TradionalChineseDict.simple, TradionalChineseDict.tradional);
}
