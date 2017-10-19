/**
 * @fileOverview 布尔扩展。
 * @author xuld
 */

// #region @Boolean.parseBoolean

/**
 * 解析字符串为布尔类型。
 * @param {String} str 要解析的字符串。
 * @returns {Boolean} 返回结果值。如果字符串为空或 `false/0/off/no` 则返回 @false，否则返回 @true。
 * @example Boolean.parseBoolean("true")
 */
Boolean.parseBoolean = function (str) {
    return !!str && !/^(false|0|off|no)$/.test(str);
};

// #endregion
