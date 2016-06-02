// #todo


/**
 * 判断指定字符串是否为数字。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isNumber("-45.35") // true
 */
export function isNumber(value: string) {
    return /^[-]?\d+(\.\d*)$/.test(value);
}
