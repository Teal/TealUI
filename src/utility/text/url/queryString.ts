/**
 * @fileOverview 处理查询字符串
 * @author xuld@vip.qq.com
 */

import {parseQuery, stringifyQuery} from './query';

/**
 * 提供查询字符串相关的函数。
 */
module QueryString {
    export const parse = parseQuery;
    export const stringify = stringifyQuery;
}

export = QueryString;
