/**
 * @fileOverview 布尔(Boolean)扩展
 * @author xuld@vip.qq.com
 * @description 提供 JavaScript 内置对象 Boolean 的扩展 API。
 * @namespace Boolean
 */

/**
 * 解析字符串为布尔类型。
 * @param value 要解析的字符串。
 * @returns 返回结果值。如果字符串为空或 `false`/`0`/`off`/`no` 则返回 false，否则返回 true。
 * @example Boolean.from("true")
 */
export function from(value: string) {
    return !!value && !/^(false|0|off|no)$/.test(value);
}
