
/**
 * 判断指定字符串是否为日期。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isDate("2014/1/1") // true
 */
export function isDate(value: string) {
    return !!+new Date(value.replace(/(\d{4})\D*(\d\d?)\D*(\d\d?)/, "$1/$2/$3"));
}
