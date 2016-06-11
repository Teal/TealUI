/**
 * @fileOverview 处理查询字符串
 * @author xuld@vip.qq.com
 */

import {parseQuery, stringifyQuery} from './query';

module QueryString {
    export const parse = parseQuery;
    export const stringify = stringifyQuery;
}

export = QueryString;
