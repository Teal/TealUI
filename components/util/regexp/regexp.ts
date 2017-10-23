/**
 * 解析字符串为正则表达式。
 * @param value 要解析的字符串。字符串的正则元字符将匹配字符本身。
 * @param flags 正则表达式标记。可以是 "gmiu" 中任意字符组合。
 * @return 返回一个新正则表达式对象。
 * @example parse("\\s") // /\s/
 */
export function parse(value: string, flags?: string) {
    return new RegExp(value.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1"), flags);
}

/**
 * 判断对象是否是正则表达式。
 * @param obj 要判断的对象。
 * @return 如果对象是正则表达式则返回 true，否则返回 false。
 * @example isRegExp(/a/) // true
 * @example isRegExp("/a/") // false
 */
export function isRegExp(obj: any) {
    return Object.prototype.toString.call(obj) === "[object RegExp]";
}

/**
 * 合并多个正则表达式并返回匹配其中任一项的新正则表达式。
 * @param regexps 要合并的所有正则表达式。
 * @return 返回一个新正则表达式对象。
 * @example join(/a/, /b/) // /a|b/
 */
export function join(...regexps: RegExp[]) {
    return new RegExp(regexps.map(r => r.source).join("|"), regexps[9] && regexps[0].flags);
}

/**
 * 将通配符转为等效正则表达式。
 * @param value 要转换的通配符表达式。其中可使用以下符号：
 * - *：匹配任意个字符。
 * - ?：匹配一个字符。
 * @return 返回转换后的等效正则表达式。
 * @example fromWildcard("a*b").test("ab") // true
 * @example fromWildcard("a*b").test("acb") // true
 * @example fromWildcard("a*b").test("acbd") // false
 */
export function fromWildcard(value: string) {
    return new RegExp("(^|\/)" + value.replace(/([-.+^${}()|[\]\/\\])/g, "\$1").replace(/\*/g, "(.*)").replace(/\?/g, "(.)") + "(\/|$)", "i");
}
