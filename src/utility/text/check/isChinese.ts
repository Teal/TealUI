// #todo


/**
 * 判断指定字符串是否为中文。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isChinese("你好") // true
 */
export function isChinese(value: string) {
    return /^[\u4E00-\u9FA5\uFE30-\uFFA0]+$/gi.test(value);
}
