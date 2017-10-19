/**
 * @author xuld
 */

// #region @RegExp.parseRegExp

/**
 * 解析字符串并创建新的正则表达式。
 * @param {String} str 要解析的字符串。字符串的正则元字符将匹配字符本身。
 * @param {String} [flag] 正则表达式标记。可选的值为 "gmi"
 * @returns {RegExp} 返回一个新正则表达式对象。
 * @example RegExp.parseRegExp("\\s") // /\s/
 */
RegExp.parseRegExp = function (str, flag) {
    typeof console === "object" && console.assert(typeof str === "string", "RegExp.parseRegExp(str: 必须是字符串, [flag])");
    return new RegExp(str.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1'), flag);
};

// #endregion
