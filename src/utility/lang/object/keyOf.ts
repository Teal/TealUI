
interface ObjectConstructor {

    /**
     * 返回对象中指定值对应的第一个键。
     * @param obj 要搜索的对象。
     * @param value 要查找的值。
     * @returns 返回匹配的第一个键，如果不存在匹配的值则返回 null。
     * @example Object.keyOf({a:1, b:1}, 1) // "a"
     */
    keyOf(obj: any, value: any): string;

}

/**
 * 返回对象中指定值对应的第一个键。
 * @param obj 要搜索的对象。
 * @param value 要查找的值。
 * @returns 返回匹配的第一个键，如果不存在匹配的值则返回 null。
 * @example Object.keyOf({a:1, b:1}, 1) // "a"
 */
Object.keyOf = function (obj: any, value: any) {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] === value) {
            return key;
        }
    }
    return null;
};
