/**
 * @fileOverview 数字扩展。
 * @author xuld
 */

// #region @Number.isNumber

/**
 * 判断一个变量是否是数字。
 * @param {Object} obj 要判断的变量。
 * @returns {Boolean} 如果是字符串，返回 true， 否则返回 false。
 */
Number.isNumber = function (obj) {
    return typeof obj === 'number' && !isNaN(obj);
}

// #endregion

// #region @Number.limit

/**
 * 确保指定数字在指定区间内。
 * @param {Number} num 当前值。
 * @param {Number} min 最小值。
 * @param {Number} max 最大值。
 * @returns {Number} 返回结果值。
 */
Number.limit = function (num, min, max) {
    return Math.min(max, Math.max(min, num));
};

// #endregion

// #region @Number.random

/**
 * 返回在指定范围的随机值。
 * @param {Number} min 最小值。
 * @param {Number} max 最大值。
 * @returns {Number} 返回结果值。
 */
Number.random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// #endregion
