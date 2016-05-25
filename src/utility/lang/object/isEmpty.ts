
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
    isEmpty(obj: any): boolean;

}

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
Object.isEmpty = function (obj: any) {
    return !obj || obj.length === 0;
};
