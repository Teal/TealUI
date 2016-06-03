/**
 * @fileOverview 解析查询字符串。
 * @author xuld@vip.qq.com
 */

import {parseQuery} from './parseQuery';
import {stringifyQuery} from './stringifyQuery';

/**
 * 提供处理查询字符串的方法。
 */
export var QueryString = {

    /**
     * 解析查询字符串为对象。
     * @param value 要解析的字符串。
     * @returns 返回解析后的对象。
     * @example QueryString.parse("a=1&b=3") // {a: 1, b:3}
     */
    parse: parseQuery,

    /**
     * 将指定对象格式化为查询参数字符串。
     * @param obj 要格式化的对象。
     * @returns 返回格式化后的字符串。
     * @example QueryString.stringify({ a: "2", c: "4" }) // "a=2&c=4"
     */
    stringify: stringifyQuery

};
