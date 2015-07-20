/**
 * @author xuld
 */

// #region @RegExp.parseRegExp

/**
 * 从字符串创建正则式。
 * @param {Object} regexp 字符串。
 * @param {String} [flag] 标记。
 * @returns {RegExp} 返回一个正则表达式对象。
 */
RegExp.parseRegExp = function (value, flag) {
    return new RegExp(value.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1'), flag);
};

// #endregion
