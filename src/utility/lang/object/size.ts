// #todo


interface ObjectConstructor {

    /**
     * 计算对象的属性数。
     * @param obj 要处理的对象。
     * @returns 返回对象自身的属性数，不包含原型属性。
     * @example Object.size({a: 1, b: 2}) // 2
     * @example Object.size([0, 1]) // 2
     */
    size(obj: any): number;

}

/**
 * 计算对象的属性数。
 * @param obj 要处理的对象。
 * @returns 返回对象自身的属性数，不包含原型属性。
 * @example Object.size({a: 1, b: 2}) // 2
 * @example Object.size([0, 1]) // 2
 */
Object.size = function (obj: any) {
    let result = 0;
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result++;
        }
    }
    return result;
};
