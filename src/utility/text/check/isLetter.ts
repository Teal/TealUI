
/**
 * 判断指定字符串是否为字母。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isLetter("abc") // true
 */
export function isLetter(value: string) {
    return /^[a-zA-Z]+$/.test(value);
}
