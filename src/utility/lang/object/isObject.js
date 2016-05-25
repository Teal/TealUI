/**
 * 判断一个对象是否是引用对象。
 * @param obj 要判断的对象。
 * @returns 如果 *obj* 是引用变量，则返回 true，否则返回 false。
 * @remark 此函数等效于 `obj !== null && typeof obj === "object"`
 * @example Object.isObject({}) // true
 * @example Object.isObject(null) // false
 */
Object.isObject = function (obj) {
    return obj !== null && typeof obj === "object";
};
