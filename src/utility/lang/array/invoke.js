/**
 * 调用数组每一项的成员函数。
 * @param {Number} funcName 要调用的函数名。
 * @param {Object} ... 调用的参数。
 * @returns {Array} 返回所有调用结果的返回值。
 * @example ["I", "you"].invoke("length"); // [1, 3]
 */
Array.prototype.invoke = function (funcName) {
    var result = [], args = Array.parseArray ? Array.parseArray(arguments, 1) : Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < this.length; i++) {
        var item = this[i][funcName];
        if (item && item.constructor === Function) {
            item = item.apply(this[i], args);
        }
        result.push(item);
    }
    return result;
};
