// #todo

import {TradionalChineseDict} from './tradionalChineseDict';

/**
 * 将繁体中文转为简体中文。
 * @param value 要处理的中文。
 * @returns 返回转换后的中文。
 * @example toSimpleChinese("簡") // "简"
 * @see toTradionalChinese
 */
export function toSimpleChinese(value: string) {
    return TradionalChineseDict.convert(value, TradionalChineseDict.tradional, TradionalChineseDict.simple);
}
