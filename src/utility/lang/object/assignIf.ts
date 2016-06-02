// #todo


interface ObjectConstructor {

    /**
     * 复制对象的所有新属性到目标对象。
     * @param target 复制的目标对象。
     * @param sources 复制的源对象。
     * @returns 返回 *target*。
     * @example Object.assignIf({a: 1}, {b: 2}) // {a: 1, b: 2}
     * @example Object.assignIf({a: 1}, {b: 2}, {b: 3}) // {a: 1, b: 2}
     */
    assignIf<T>(target: T, ...sources: any[]): T;

}

/**
 * 复制对象的所有新属性到目标对象。
 * @param target 复制的目标对象。
 * @param sources 复制的源对象。
 * @returns 返回 *target*。
 * @example Object.assignIf({a: 1}, {b: 2}) // {a: 1, b: 2}
 * @example Object.assignIf({a: 1}, {b: 2}, {b: 3}) // {a: 1, b: 2}
 */
Object.assignIf = function (target) {
    // #assert target != null
    for (let i = 1; i < arguments.length; i++) {
        for (var key in arguments[i]) {
            if (target[key] === undefined) {
                target[key] = arguments[i][key];
            }
        }
    }
    return target;
};
