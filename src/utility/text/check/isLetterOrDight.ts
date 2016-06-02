
/**
 * 判断指定字符串是否为字母或数字。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isLetterOrDight("x09") // true
 */
export function isLetterOrDight(value: string) {
    return /^[a-zA-Z\d]+$/.test(value);
}
