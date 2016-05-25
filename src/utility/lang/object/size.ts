
interface ObjectConstructor {

    /**
     * 判断一个对象是否为空。
     * @param obj 要判断的对象。
     * @returns 如果 *obj* 是 null、undefined、false、空字符串或空数组，则返回 true，否则返回 false。
     * @example Object.isEmpty(null) // true
     * @example Object.isEmpty(undefined) // true
     * @example Object.isEmpty("") // true
     * @example Object.isEmpty(" ") // false
     * @example Object.isEmpty([]) // true
     * @example Object.isEmpty({}) // false
     */
    size(obj: any): number;

}

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
