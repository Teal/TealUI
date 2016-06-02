// #todo


/**
 * 判断指定字符串是否为 QQ 号。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isQQ("10000") // true
 */
export function isQQ(value: string) {
    return /^\d{5,12}$/.test(value);
}
