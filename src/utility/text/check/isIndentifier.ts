// #todo


/**
 * 判断指定字符串是否为 JavaScript 标识符。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isIndentifier("x09") // true
 */
export function isIndentifier(value: string) {
    return /^[\u4E00-\u9FA5\uFE30-\uFFA0a-zA-Z_$][\u4E00-\u9FA5\uFE30-\uFFA0\w$]+$/.test(value);
}
