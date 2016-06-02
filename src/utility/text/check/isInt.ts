
/**
 * 判断指定字符串是否为整数。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isInt("-45") // true
 */
export function isInt(value: string) {
    return /^[-]?\d+$/.test(value);
}
