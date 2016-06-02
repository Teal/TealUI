// #todo


/**
 * 判断指定字符串是否为身份证号。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isId("152500198909267865") // true
 */
export function isChineseId(value: string) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
}
