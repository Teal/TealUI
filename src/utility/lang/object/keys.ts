
interface ObjectConstructor {

    /**
     * 获取对象的所有值。
     * @param obj 要获取的对象。
     * @returns 返回所有值组成的数组。
     * @example Object.values({a: 3, b: 5}) // [3, 5]
     * @since ES7
     */
    values(obj: any): string[];

}

if (!Object.values) {

    /**
     * 获取对象的所有值。
     * @param obj 要获取的对象。
     * @returns 返回所有值组成的数组。
     * @example Object.values({a: 3, b: 5}) // [3, 5]
     * @since ES7
     */
    Object.values = function (obj: any) {
        var result = [];
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result.push(obj[key]);
            }
        }
        return result;
    };
}
