// #todo


interface ObjectConstructor {

    /**
     * 获取对象的所有键。
     * @param obj 要获取的对象。
     * @returns 返回所有键组成的数组。
     * @example Object.keys({a: 3, b: 5}) // ["a", "b"]
     * @since ES5
     */
    keys(obj: any): string[];

}

if (!Object.keys) {

    /**
     * 获取对象的所有键。
     * @param obj 要获取的对象。
     * @returns 返回所有键组成的数组。
     * @example Object.keys({a: 3, b: 5}) // ["a", "b"]
     * @since ES5
     */
    Object.keys = function (obj) {
        var result = [];
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result.push(key);
            }
        }
        return result;
    };
}
