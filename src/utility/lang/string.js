/**
 * @fileOverview 字符串扩展。
 * @author xuld
 */

// #region @String.format

/**
 * 格式化指定的字符串。
 * @param {String} format 格式字符串。具体见下文。
 * @param {Object} ... 格式化参数。
 * @returns {String} 返回格式化后的字符串。
 * @remark
 * #### 格式化语法
 * 格式字符串中，以下内容会被替换：
 * 
 * 元字符   | 意义      | 示例
 * --------|-----------|--------
 * {数字}   | 替换为参数列表 | 如 `String.format("{0}年{1}月{2}日", 2012, 12, 3)` 中，{0} 被替换成 2012，{1} 被替换成 12 ，依次类推。
 * {字符串} | 替换为参数对象 | 如 `String.format("{year}年{month} 月 ", {year: 2012, month:12})`。
 * {{      | 被替换为 { |
 * }}      | 被替换为 } |
 * 
 * @example
 * String.format("我是{0}，不是{1}", "小黑", "大白"); // "我是小黑，不是大白"
 * 
 * String.format("我是{xiaohei}，不是{dabai}", {xiaohei: "小黑", dabai: "大白"}); // "我是小黑，不是大白"
 * 
 * String.format("在字符串内使用两个{{和}}避免被转换"); //  "在字符串内使用两个{和}避免被转换"
 */
String.format = function (format) {
    typeof console === "object" && console.assert(!format || typeof format === "string", "String.format(format: 必须是字符串)");
    var args = arguments;
    return format ? format.replace(/\{\{|\{(\w+)\}|\}\}/g, function (matched, argName) {
        return argName ? (matched = +argName + 1) ? args[matched] : args[1][argName] : matched[0];
    }) : "";
};

// #endregion
