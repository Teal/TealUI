
/**
 * 判断指定字符串是否为手机号。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isPhone("+8613211111111") // true
 */
export function isPhone(value: string) {
    return /^(\+\d\d)?1\d{10}$/.test(value);
}
