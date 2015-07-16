/**
 * @fileOverview 数字扩展。
 * @author xuld
 */

// #region @Boolean.parse

/**
 * 解析字符串为布尔类型。
 * @returns {Boolean} 返回结果值。
 */
Boolean.from = function (str) {
    return str ? !/^(false|0|off|no)$/.test(str) : false;
};

// #endregion
