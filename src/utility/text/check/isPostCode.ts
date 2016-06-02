
/**
 * 判断指定字符串是否为邮编号码。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isPostCode("310000") // true
 */
export function isPostCode(value: string) {
    return /^\d{6}$/.test(value);
}
