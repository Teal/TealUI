// #todo


/**
 * 判断指定年月日对应的日期是否存在。
 * @param year 要判断的年。
 * @param month 要判断的月。
 * @param day 要判断的日。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isValidDate(2015, 2, 29) // false
 * @example isValidDate(2016, 2, 29) // true
 */
export function isValidDate(year: number, month: number, day: number) {
    const date = new Date(year, --month, day);
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}
