/**
 * @fileOverview 正则(RegExp)扩展
 * @author xuld@vip.qq.com
 * @description 提供 JavaScript 内置对象 RegExp 的扩展 API。
 * @namespace RegExp
 */

/**
 * 解析字符串并创建新的正则表达式。
 * @param value 要解析的字符串。字符串的正则元字符将匹配字符本身。
 * @param flags 正则表达式标记。可以是 "gmi" 中任意字符组合。
 * @returns 返回一个新正则表达式对象。
 * @example RegExp.from("\\s") // /\s/
 */
export function from(value: string, flags?: string) {
    return new RegExp(value.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1'), flags);
}

/**
 * 判断一个对象是否是正则。
 * @param obj 要判断的对象。
 * @returns 如果 *obj* 是正则则返回 true，否则返回 false。
 * @example RegExp.isRegExp(/a/) // true
 * @example RegExp.isRegExp("a") // false
 */
export function isRegExp(obj: any) {
    return Object.prototype.toString.call(obj) === "[object RegExp]";
}

/**
 * 将一个通配符表达式转为等效正则表达式。
 * @param value 要转换的通配符表达式。
 * @returns 返回转换后的等效正则表达式。
 * @remark 通配符表达式意义：
 * 其中 * 表示匹配任意字符。
 * 其中 ? 表示匹配一个字符。
 * 如果路径以 / 开头则匹配跟目录。否则匹配任意路径部分。
 */
export function fromWildcard(value: string) {
    return new RegExp("(^|\/)" + value.replace(/([-.+^${}()|[\]\/\\])/g, '\\$1').replace(/\*/g, "(.*)").replace(/\?/g, "(.)") + "(\/|$)", "i");
}
