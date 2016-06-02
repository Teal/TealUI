// #todo


interface ObjectConstructor {

    /**
     * 复制对象的所有属性到目标对象。
     * @param target 复制的目标对象。
     * @param sources 复制的源对象。
     * @returns 返回 *target*。
     * @example Object.assign({a: 1}, {b: 2}) // {a: 1, b: 2}
     * @example Object.assign({a: 1}, {a: 2}) // {a: 2}
     * @example Object.assign({a: 1}, {b: 2}, {b: 3}) // {a: 1, b: 3}
     * @since ES6
     */
    assign<T>(target: T, ...sources: any[]): T;

}

if (!Object.assign) {

    /**
     * 复制对象的所有属性到目标对象。
     * @param target 复制的目标对象。
     * @param sources 复制的源对象。
     * @returns 返回 *target*。
     * @example Object.assign({a: 1}, {b: 2}) // {a: 1, b: 2}
     * @example Object.assign({a: 1}, {b: 2}, {b: 3}) // {a: 1, b: 3}
     * @since ES6
     */
    Object.assign = function (target) {
        // #assert target != null
        for (let i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                target[key] = arguments[i][key];
            }
        }
        return target;
    };
}
