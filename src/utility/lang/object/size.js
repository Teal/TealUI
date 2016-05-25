/**
 * 计算对象的属性数。
 * @param {Object} obj 要处理的对象。
 * @returns {Number} 返回属性数。只返回对象自身的属性数，不含原型属性。
 * @example Object.size({v: 3, g: 5}) // 2
 */
Object.size = function (obj) {
    var result = 0;
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result++;
        }
    }
    return result;
};
