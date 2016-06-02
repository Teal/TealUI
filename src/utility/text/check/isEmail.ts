
/**
 * 判断指定字符串是否为合法的邮箱地址。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true；否则返回 false。
 * @example isEmail("work&#64;xuld.net") // true
 */
export function isEmail(value: string) {
    return /^[\u4E00-\u9FA5\uFE30-\uFFA0\w][\u4E00-\u9FA5\uFE30-\uFFA0\w-+\.]*@[\u4E00-\u9FA5\uFE30-\uFFA0\w]+(\.[\u4E00-\u9FA5\uFE30-\uFFA0\w]+)+$/.test(value);
}
