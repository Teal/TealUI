
/**
 * 判断指定字符串是否为日期。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isDate("2014/1/1") // true
 */
export default function isDate(value: string) {
    let match = /(\d{4})\D*(\d\d?)\D*(\d\d?)/.exec(value);
    let year = +match[1];
    let month = +match[2] - 1;
    let day = +match[3];
    let date = new Date(year, month, day);
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}
