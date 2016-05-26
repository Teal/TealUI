/**
 * 将数组中的值和指定的键表组合为对象。
 * @param {Array} keys 要匹配的键名。
 * @returns {Object} 返回数组和指定键组成的键值对。
 * @example [1, 2].associate(["a", "b"]) // {a: 1, b: 2}
 */
Array.prototype.associate = function (keys) {
    typeof console === "object" && console.assert(keys && typeof keys.length === "number", "array.associate(keys: 必须是数组)");
    var result = {};
    for (var i = 0, length = Math.min(this.length, keys.length); i < length; i++) {
        result[keys[i]] = this[i];
    }
    return result;
};
