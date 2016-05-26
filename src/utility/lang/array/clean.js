/**
 * 删除数组中值为 @false 的值。
 * @returns {Array} 返回过滤后的新数组。
 * @example ["", false, 0, undefined, null, {}].clean(); // [{}]
 */
Array.prototype.clean = function () {
    return this.filter(function (obj) {
        return !obj;
    });
};
