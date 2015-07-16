/**
 * @fileOverview 字符串扩展。
 * @author xuld
 */

// #region @String.format

/**
 * 格式化指定的字符串。
 * @param {String} formatString 要格式化的字符串。格式化的方式见备注。
 * @param {Object} ... 格式化参数。
 * @return {String} 格式化后的字符串。
 * @remark 
 * 
 * 格式化字符串中，使用 {0} {1} ... 等元字符来表示传递给 String.format 用于格式化的参数。
 * 如 String.format("{0} 年 {1} 月 {2} 日", 2012, 12, 32) 中， {0} 被替换成 2012，
 * {1} 被替换成 12 ，依次类推。
 * 
 * String.format 也支持使用一个 JSON来作为格式化参数。
 * 如 String.format("{year} 年 {month} 月 ", { year: 2012, month:12});
 * 若要使用这个功能，请确保 String.format 函数有且仅有 2个参数，且第二个参数是一个 Object。
 *
 * 格式化的字符串{}不允许包含空格。
 * 
 * 如果需要在格式化字符串中出现 { 和 }，请分别使用 {{ 和 }} 替代。
 * 不要出现{{{ 和 }}} 这样将获得不可预知的结果。
 * @memberOf String
 * @example <pre>
 * String.format("{0}转换", 1); //  "1转换"
 * String.format("{1}翻译",0,1); // "1翻译"
 * String.format("{a}翻译",{a:"也可以"}); // 也可以翻译
 * String.format("{{0}}不转换, {0}转换", 1); //  "{0}不转换1转换"
 * </pre>
 */
String.format = function (formatString) {
    var args = arguments;
    return formatString ? formatString.replace(/\{\{|\{(\w+)\}|\}\}/g, function (matched, argName) {
        return argName ? (matched = +argName + 1) ? args[matched] : args[1][argName] : matched[0];
    }) : "";
};

// #endregion
