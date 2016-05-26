
/**
 * 将指定对象解析为日期对象。
 * @param {String/Date} value 要解析的对象。
 * @param {String} [format] 解析的格式。
 * 如果未指定，则支持标准的几种时间格式。
 * 如果指定了格式，则按照格式指定的方式解析。具体见下文。
 * @returns {Date} 返回分析出的日期对象。
 * @example
 * Date.parseDate("2014-1-1")
 * 
 * Date.parseDate("20140101")
 * 
 * Date.parseDate("2013年12月1日", "yyyy年MM月dd日")
 * @remark
 * #### 格式化语法
 * 格式化字符串中，以下元字符会被反向替换为对应的值。
 * 
 * 元字符 | 意义 | 实例
 * ------|-----|------
 * y     | 年  | 2014
 * M     | 月  | 9
 * d     | 日  | 9
 * H     | 小时 | 9
 * y     | 分钟 | 6
 * y     | 秒  | 6
 * 
 * > #### !注意
 * > 元字符区分大小写。
 */
Date.from = function (value, format) {
    if (value && !(value instanceof Date)) {
        if (format) {
            var groups = [0],
                obj = {},
                match = new RegExp(format.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1').replace(/([yMdHms])\1*/g, function (all, w) {
                    groups.push(w);
                    return "\\s*(\\d+)?\\s*";
                })).exec(value);
            if (match) {
                for (var i = 1; i < match.length; i++) {
                    obj[groups[i]] = +match[i];
                }
            }
            value = new Date(obj.y || new Date().getFullYear(), obj.M ? obj.M - 1 : new Date().getMonth(), obj.d || 1, obj.H || 0, obj.m || 0, obj.s || 0);
        } else {
            value = new Date(value) || new Date(String(value).replace(/(\d{4})\D*(\d\d?)\D*(\d\d?)/, '$1/$2/$3'));
        }

    }
    return value;
};
