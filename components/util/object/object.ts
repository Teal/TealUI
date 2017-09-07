/**
 * 复制对象的所有属性到目标对象，如果目标对象已存在对应属性则跳过。
 * @param iterable 复制的目标对象。
 * @param source 复制的源对象。
 * @example assignIf({a: 1}, {a: 2, b: 2}) // {a: 1, b: 2}
 */
export function assignIf<T, R>(iterable: T, source: R) {
    for (const key in source as any) {
        if ((iterable as any)[key] === undefined) {
            (iterable as any)[key] = (source as any)[key];
        }
    }
    return iterable as T & R;
}

/**
 * 在对象指定键之前插入一个键值对。
 * @param obj 要插入的对象。
 * @param newKey 新插入的键。
 * @param newValue 新插入的值。
 * @param refKey 插入的位置。新键值对将插入在指定的键前。如果指定键不存在则插入到末尾。
 * @example insertBefore({ a: 1 }, "b", 2, "a") // { b:2, a: 1 }
 */
export function insertBefore<T extends any>(obj: T, newKey: string, newValue: any, refKey?: keyof T) {
    let tmpObj: any;
    for (const key in obj) {
        if (key === refKey) {
            tmpObj = {};
        }
        if (tmpObj) {
            tmpObj[key] = obj[key];
            delete obj[key];
        }
    }
    obj[newKey] = newValue;
    for (const key in tmpObj) {
        obj[key] = tmpObj[key];
    }
}

/**
 * 对指定的类数组每一项执行一次 *callback*。
 * @param iterable 要遍历的类数组。
 * @param callback 对每一项执行的函数。
 * - value：当前项的值。
 * - index：当前项的索引。
 * - iterable：类数组本身。
 * - 返回：函数可以返回 false 以终止循环。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 如果循环是因为 *callback* 返回 false 而中止，则返回 false，否则返回 true。
 * @example each(["a", "b"], console.log, console); // 打印 '0  a' 和 '1  b'
 */
export function each<T>(iterable: ArrayLike<T>, callback: (value: T, index: number, iterable: ArrayLike<T>) => boolean | void, thisArg?: any): boolean;

/**
 * 对指定的对象（不支持函数）每一项执行一次 *callback*。
 * @param iterable 要遍历的对象（不支持函数）。
 * @param callback 对每一项执行的函数。
 * - value：当前项的值。
 * - key：当前项的键。
 * - iterable：对象本身。
 * - 返回：函数可以返回 false 以终止循环。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 如果循环是因为 *callback* 返回 false 而中止，则返回 false，否则返回 true。
 * @example each({a: 1, b: 2}, console.log, console); // 打印 'a  1' 和 'b  2'
 */
export function each<T>(iterable: { [key: string]: T }, callback: (value: T, key: string, iterable: { [key: string]: T }) => boolean | void, thisArg?: any): boolean;

export function each<T>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, iterable: any) => boolean | void, thisArg?: any) {
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        for (let i = 0; i < (iterable as ArrayLike<T>).length; i++) {
            if ((i in iterable) && callback.call(thisArg, (iterable as any)[i], i, iterable) === false) {
                return false;
            }
        }
    } else {
        for (const i in iterable) {
            if (callback.call(thisArg, (iterable as any)[i], i, iterable) === false) {
                return false;
            }
        }
    }
    return true;
}

/**
 * 对指定的类数组每一项执行一次 *callback*。
 * @param iterable 要遍历的类数组。
 * @param callback 对每一项执行的函数。
 * - value：当前项的值。
 * - index：当前项的索引。
 * - iterable：类数组本身。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @example forEach(["a", "b"], console.log, console) // 打印 '0  a' 和 '1  b'
 */
export function forEach<T>(iterable: ArrayLike<T>, callback: (value: T, index: number, iterable: ArrayLike<T>) => boolean | void, thisArg?: any): void;

/**
 * 对指定的对象（不支持函数）每一项执行一次 *callback*。
 * @param iterable 要遍历的对象（不支持函数）。
 * @param callback 对每一项执行的函数。
 * - value：当前项的值。
 * - key：当前项的键。
 * - iterable：对象本身。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @example forEach({a: 1, b: 2}, console.log, console) // 打印 'a  1' 和 'b  2'
 */
export function forEach<T>(iterable: { [key: string]: T }, callback: (value: T, key: string, iterable: { [key: string]: T }) => boolean | void, thisArg?: any): void;

export function forEach<T>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, iterable: any) => boolean | void, thisArg?: any) {
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        for (let i = 0; i < (iterable as ArrayLike<T>).length; i++) {
            if (i in iterable) {
                callback.call(thisArg, (iterable as any)[i], i, iterable);
            }
        }
    } else {
        for (const i in iterable) {
            callback.call(thisArg, (iterable as any)[i], i, iterable);
        }
    }
}

/**
 * 筛选指定类数组中符合要求的项并组成一个新数组。
 * @param iterable 要遍历的类数组。
 * @param callback 对每一项执行的函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - index：当前项的索引。
 * - iterable：类数组本身。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 返回一个新数组。
 * @example filter([1, 2], function (item) { return item > 1; }) // [2]
 */
export function filter<T>(iterable: ArrayLike<T>, callback: (value: T, index: number, iterable: ArrayLike<T>) => boolean, thisArg?: any): { [key: string]: T };

/**
 * 筛选指定对象中符合要求的项并组成一个新对象。
 * @param iterable 要遍历的对象（不支持函数）。
 * @param callback 对每一项执行的函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - key：当前项的键。
 * - iterable：对象本身。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 返回一个新对象。
 * @example filter({a: 1, b: 2}, function (item) { return item > 1; }) // {b: 2}
 */
export function filter<T>(iterable: { [key: string]: T }, callback: (value: T, key: string, iterable: { [key: string]: T }) => boolean, thisArg?: any): { [key: string]: T };

export function filter<T>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, iterable: any) => boolean, thisArg?: any) {
    let result: T[] | { [key: string]: T };
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        result = [];
        for (let i = 0; i < (iterable as ArrayLike<T>).length; i++) {
            if ((i in iterable) && callback.call(thisArg, (iterable as any)[i], i, iterable)) {
                (result as T[]).push((iterable as any)[i]);
            }
        }
    } else {
        result = {};
        for (const i in iterable) {
            if (callback.call(thisArg, (iterable as any)[i], i, iterable)) {
                result[i] = (iterable as any)[i];
            }
        }
    }
    return result;
}

/**
 * 遍历指定类数组，并对每一项执行 *callback*，然后返回每个结果组成的新数组。
 * @param iterable 要遍历的类数组。
 * @param callback 对每一项执行的函数，用于计算每一项的返回值。
 * - value：当前项的值。
 * - index：当前项的索引。
 * - iterable：类数组本身。
 * - 返回：返回结果。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 返回一个新数组。
 * @example map(["a", "b"], function (a) { return a + a; }) // ["aa", "bb"]
 */
export function map<T, R>(iterable: ArrayLike<T>, callback: (value: T, index: number, iterable: ArrayLike<T>) => R, thisArg?: any): R[];

/**
 * 遍历指定对象（不支持函数），并对每一项执行 *callback*，然后返回每个结果组成的新对象。
 * @param iterable 要遍历的对象（不支持函数）。
 * @param callback 对每一项执行的函数，用于计算每一项的返回值。
 * - value：当前项的值。
 * - key：当前项的键。
 * - iterable：对象本身。
 * - 返回：结果。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 返回一个新对象。
 * @example map({length: 1, "0": "a"}, function (a) { return a + a; }) // ["a"]
 * @example map({a: "a", b: "b"}, function (a) { return a + a; }) // {a: "aa", b: "bb"}
 */
export function map<T, R>(iterable: { [key: string]: T }, callback: (value: T, key: string, iterable: { [key: string]: T }) => R, thisArg?: any): { [key: string]: R };

export function map<T, R>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, iterable: any) => R, thisArg?: any) {
    let result: R[] | { [key: string]: R };
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        result = [];
        for (let i = 0; i < (iterable as ArrayLike<T>).length; i++) {
            if (i in iterable) {
                result[i] = callback.call(thisArg, (iterable as any)[i], i, iterable);
            }
        }
    } else {
        result = {};
        for (const i in iterable) {
            result[i] = callback.call(thisArg, (iterable as any)[i], i, iterable);
        }
    }
    return result;
}

/**
 * 判断指定类数组的每一项是否都满足条件。
 * @param iterable 要遍历的类数组。
 * @param callback 对每一项执行的函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - index：当前项的索引。
 * - iterable：类数组本身。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 如果所有项满足条件则返回 true，否则返回 false。
 * @example every([1, 2], function (item) { return item > 0; }) // true
 * @example every([1, 2], function (item) { return item > 1; }) // false
 * @example every([1, 2], function (item) { return item > 2; }) // false
 */
export function every<T>(iterable: ArrayLike<T>, callback: (value: T, index: number, iterable: ArrayLike<T>) => boolean, thisArg?: any): boolean;

/**
 * 判断指定对象（不支持函数）的每一项是否都满足条件。
 * @param iterable 要遍历的对象（不支持函数）。
 * @param callback 对每一项执行的函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - key：当前项的键。
 * - iterable：对象本身。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 如果所有项满足条件则返回 true，否则返回 false。
 * @example every({a: 1, b: 2}, function (item) { return item > 0; }) // true
 * @example every({a: 1, b: 2}, function (item) { return item > 1; }) // false
 * @example every({a: 1, b: 2}, function (item) { return item > 2; }) // false
 */
export function every<T>(iterable: { [key: string]: T }, callback: (value: T, key: string, iterable: { [key: string]: T }) => boolean, thisArg?: any): boolean;

export function every<T>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, iterable: any) => boolean, thisArg?: any) {
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        for (let i = 0; i < (iterable as ArrayLike<T>).length; i++) {
            if ((i in iterable) && !callback.call(thisArg, (iterable as any)[i], i, iterable)) {
                return false;
            }
        }
    } else {
        for (const i in iterable) {
            if (!callback.call(thisArg, (iterable as any)[i], i, iterable)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * 判断指定类数组是否至少存在一项满足条件。
 * @param iterable 要遍历的类数组。
 * @param callback 对每一项执行的函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - index：当前项的索引。
 * - iterable：类数组本身。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 如果至少存在一项满足条件则返回 true，否则返回 false。
 * @example some([1, 2], function (item) { return item > 0; }) // true
 * @example some([1, 2], function (item) { return item > 1; }) // true
 * @example some([1, 2], function (item) { return item > 2; }) // false
 */
export function some<T>(iterable: ArrayLike<T>, callback: (value: T, index: number, iterable: ArrayLike<T>) => boolean, thisArg?: any): boolean;

/**
 * 判断指定对象（不支持函数）是否至少存在一项满足条件。
 * @param iterable 要遍历的对象（不支持函数）。
 * @param callback 对每一项执行的函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - key：当前项的键。
 * - iterable：对象本身。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 如果至少存在一项满足条件则返回 true，否则返回 false。
 * @example some({a: 1, b: 2}, function (item) { return item > 1; }) // true
 * @example some({a: 1, b: 2}, function (item) { return item > 1; }) // true
 * @example some({a: 1, b: 2}, function (item) { return item > 2; }) // false
 */
export function some<T>(iterable: { [key: string]: T }, callback: (value: T, key: string, iterable: { [key: string]: T }) => boolean, thisArg?: any): boolean;

export function some<T>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, iterable: any) => boolean, thisArg?: any) {
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        for (let i = 0; i < (iterable as ArrayLike<T>).length; i++) {
            if ((i in iterable) && callback.call(thisArg, (iterable as any)[i], i, iterable)) {
                return true;
            }
        }
    } else {
        for (const i in iterable) {
            if (callback.call(thisArg, (iterable as any)[i], i, iterable)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * 找出指定类数组中符合条件的第一项。
 * @param iterable 要遍历的类数组。
 * @param callback 对每一项执行的函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - index：当前项的索引。
 * - iterable：类数组本身。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 返回符合条件的第一项，如果没有满足条件的项，则返回 undefined。
 * @example find([1, 2], function (item) { return item > 1; }) // 2
 */
export function find<T>(iterable: ArrayLike<T>, callback: (value: T, index: number, iterable: ArrayLike<T>) => boolean, thisArg?: any): T | undefined;

/**
 * 找出指定对象（不支持函数）中符合条件的第一项。
 * @param iterable 要遍历的对象（不支持函数）。
 * @param callback 对每一项执行的函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - key：当前项的键。
 * - iterable：对象本身。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 返回符合条件的第一项，如果没有满足条件的项，则返回 undefined。
 * @example find({a: 1, b: 2}, function (item) { return item > 1; }) // 2
 */
export function find<T>(iterable: { [key: string]: T }, callback: (value: T, key: string, iterable: { [key: string]: T }) => boolean, thisArg?: any): T | undefined;

export function find<T>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, iterable: any) => boolean, thisArg?: any) {
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        for (let i = 0; i < (iterable as ArrayLike<T>).length; i++) {
            if ((i in iterable) && callback.call(thisArg, (iterable as any)[i], i, iterable)) {
                return (iterable as any)[i] as T;
            }
        }
    } else {
        for (const i in iterable) {
            if (callback.call(thisArg, (iterable as any)[i], i, iterable)) {
                return (iterable as any)[i] as T;
            }
        }
    }
}

/**
 * 找出指定类数组中符合条件的第一项的索引。
 * @param iterable 要遍历的类数组。
 * @param callback 对每一项执行的函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - index：当前项的索引。
 * - iterable：类数组本身。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 返回符合条件的第一项的索引，如果没有满足条件的项，则返回 -1 或 undefined。
 * @example findIndex([1, 2], function (item){ return item > 1; }) // 1
 * @example findIndex([1, 2], function (item){ return item > 2; }) // -1
 */
export function findIndex<T>(iterable: ArrayLike<T>, callback: (value: T, index: number, iterable: ArrayLike<T>) => boolean, thisArg?: any): number;

/**
 * 找出指定对象（不支持函数）中符合条件的第一项的键。
 * @param iterable 要遍历的对象（不支持函数）。
 * @param callback 对每一项执行的函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - key：当前项的键。
 * - iterable：对象本身。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 返回符合条件的第一项的键，如果没有满足条件的项，则返回 -1 或 undefined。
 * @example findIndex({a: 1, b: 2}, function (item){return item > 1;}) // 'b'
 * @example findIndex({a: 1, b: 2}, function (item){return item > 2;}) // undefined
 */
export function findIndex<T>(iterable: { [key: string]: T }, callback: (value: T, key: string, iterable: { [key: string]: T }) => boolean, thisArg?: any): string | undefined;

export function findIndex<T>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, iterable: any) => boolean, thisArg?: any) {
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        for (let i = 0; i < (iterable as ArrayLike<T>).length; i++) {
            if ((i in iterable) && callback.call(thisArg, (iterable as any)[i], i, iterable)) {
                return i;
            }
        }
        return -1;
    } else {
        for (const i in iterable) {
            if (callback.call(thisArg, (iterable as any)[i], i, iterable)) {
                return i;
            }
        }
    }
}

/**
 * 从左往右依次合并类数组中的每一项并最终返回一个值。
 * @param iterable 要遍历的类数组。
 * @param callback 对每一项执行的函数，每次合并两项为一项。
 * - previousValue：要合并的前一项。
 * - currentValue：要合并的当前项。
 * - index：当前项的索引。
 * - iterable：类数组本身。
 * - 返回：合并的结果。
 * @param initialValue 用于合并第一项的初始值。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 返回合并后的最终结果值。
 * @example reduce([1, 2], function (x, y) { return x + y; }) // 3
 * @example reduce([1, 2], function (x, y) { return x + y; }, 10) // 13
 */
export function reduce<T, R>(iterable: ArrayLike<T>, callback: (previousValue: R, currentValue: T, index: number, iterable: ArrayLike<T>) => R, initialValue?: R, thisArg?: any): R | undefined;

/**
 * 从左往右依次合并对象（不支持函数）中的每一项并最终返回一个值。
 * @param iterable 要遍历的对象（不支持函数）。
 * @param callback 对每一项执行的函数，每次合并两项为一项。
 * - previousValue：要合并的前一项。
 * - currentValue：要合并的当前项。
 * - key：当前项的键。
 * - iterable：对象本身。
 * - 返回：合并的结果。
 * @param initialValue 用于合并第一项的初始值。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 返回合并后的最终结果值。
 * @example reduce({a: 1, b: 2}, function (x, y) { return x + y; }) // 3
 * @example reduce({a: 1, b: 2}, function (x, y) { return x + y; }, 10) // 13
 */
export function reduce<T, R>(iterable: { [key: string]: T }, callback: (previousValue: R, currentValue: T, key: string, iterable: { [key: string]: T }) => R, initialValue?: R, thisArg?: any): R | undefined;

export function reduce<T, R>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (previousValue: R, currentValue: T, key: any, iterable: any) => R, initialValue?: R, thisArg?: any) {
    let result: R | undefined;
    let first = true;
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        for (let i = 0; i < (iterable as ArrayLike<T>).length; i++) {
            if (i in iterable) {
                if (first) {
                    first = false;
                    result = initialValue === undefined ? (iterable as any)[i] : callback.call(thisArg, initialValue, (iterable as any)[i], i, iterable);
                } else {
                    result = callback.call(thisArg, result, (iterable as any)[i], i, iterable);
                }
            }
        }
    } else {
        for (const i in iterable) {
            if (first) {
                first = false;
                result = initialValue === undefined ? (iterable as any)[i] : callback.call(thisArg, initialValue, (iterable as any)[i], i, iterable);
            } else {
                result = callback.call(thisArg, result, (iterable as any)[i], i, iterable);
            }
        }
    }
    return result;
}

/**
 * 从左往右依次合并类数组中的每一项并最终返回一个值。
 * @param iterable 要遍历的类数组。
 * @param callback 对每一项执行的函数，每次合并两项为一项。
 * - previousValue：要合并的前一项。
 * - currentValue：要合并的当前项。
 * - index：当前项的索引。
 * - iterable：类数组本身。
 * - 返回：合并的结果。
 * @param initialValue 用于合并第一项的初始值。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 返回合并后的最终结果值。
 * @example reduceRight([1, 2], function (x, y) { return x + y; }) // 3
 * @example reduceRight([1, 2], function (x, y) { return x + y; }, 10) // 13
 */
export function reduceRight<T, R>(iterable: ArrayLike<T>, callback: (previousValue: R, currentValue: T, index: number, iterable: ArrayLike<T>) => R, initialValue?: R, thisArg?: any): R | undefined;

/**
 * 从左往右依次合并对象（不支持函数）中的每一项并最终返回一个值。
 * @param iterable 要遍历的对象（不支持函数）。
 * @param callback 对每一项执行的函数，每次合并两项为一项。
 * - previousValue：要合并的前一项。
 * - currentValue：要合并的当前项。
 * - key：当前项的键。
 * - iterable：对象本身。
 * - 返回：合并的结果。
 * @param initialValue 用于合并第一项的初始值。
 * @param thisArg 执行 *callback* 时 this 的值。
 * @return 返回合并后的最终结果值。
 * @example reduceRight({a: 1, b: 2}, function (x, y) { return x + y; }) // 3
 * @example reduceRight({a: 1, b: 2}, function (x, y) { return x + y; }, 10) // 13
 */
export function reduceRight<T, R>(iterable: { [key: string]: T }, callback: (previousValue: R, currentValue: T, key: string, iterable: { [key: string]: T }) => R, initialValue?: R, thisArg?: any): R | undefined;

export function reduceRight<T, R>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (previousValue: R, currentValue: T, key: any, iterable: any) => R, initialValue?: R, thisArg?: any) {
    let result: R | undefined;
    let first = true;
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        for (let i = (iterable as ArrayLike<T>).length; --i >= 0;) {
            if (i in iterable) {
                if (first) {
                    first = false;
                    result = initialValue === undefined ? (iterable as any)[i] : callback.call(thisArg, initialValue, (iterable as any)[i], i, iterable);
                } else {
                    result = callback.call(thisArg, result, (iterable as any)[i], i, iterable);
                }
            }
        }
    } else {
        const key: string[] = [];
        for (const i in iterable) {
            key.push(i);
        }
        for (let i = key.length; --i >= 0;) {
            if (first) {
                first = false;
                result = initialValue === undefined ? (iterable as any)[key[i]] : callback.call(thisArg, initialValue, (iterable as any)[key[i]], key[i], iterable);
            } else {
                result = callback.call(thisArg, result, (iterable as any)[key[i]], key[i], iterable);
            }
        }
    }
    return result;
}

/**
 * 获取对象指定键列表的子集。
 * @param obj 要处理的对象。
 * @param keys 要获取的键列表。
 * @return 返回新对象。
 * @example subset({a: 1, b: 2}, ['a']) // {a: 1}
 */
export function subset<T>(obj: { [key: number]: T } | { [key: string]: T }, keys: (string | number)[]) {
    const result: { [key: string]: T } = {};
    for (const key of keys) {
        if (key in obj) {
            result[key] = (obj as any)[key];
        }
    }
    return result;
}

/**
 * 判断一个对象是否是引用对象。
 * @param obj 要判断的对象。
 * @return 如果 *obj* 是引用变量，则返回 true，否则返回 false。
 * @desc 此函数等效于 `obj !== null && typeof obj === "object"`
 * @example isObject({}) // true
 * @example isObject(null) // false
 */
export function isObject(obj: any): obj is object {
    return obj !== null && typeof obj === "object";
}

/**
 * 缓存所有类型转为字符串的值。
 */
let types: { [key: string]: "string" | "number" | "boolean" | "undefined" | "null" | "array" | "function" | "date" | "regexp" | "error" | "object"; };

/**
 * 获取指定对象的类型。
 * @param obj 要判断的对象。
 * @return 返回类型字符串。
 * @example type(null) // "null"
 * @example type(undefined) // "undefined"
 * @example type(new Function) // "function"
 * @example type(+'a') // "number"
 * @example type(/a/) // "regexp"
 * @example type([]) // "array"
 */
export function type(obj: any) {
    if (!types) {
        types = { __proto__: null! };
        "Boolean Number String Function Array Date RegExp Object Error".replace(/\w+/g, typeName => types["[object " + typeName + "]"] = typeName.toLowerCase() as any);
    }
    return obj == null ? String(obj) as "null" | "undefined" : types[Object.prototype.toString.call(obj)] || "object";
}

/**
 * 计算对象的属性数。
 * @param obj 要处理的对象。
 * @return 返回对象自身的属性数，不包含原型属性。
 * @example size({a: 1, b: 2}) // 2
 * @example size([0, 1]) // 2
 */
export function size(obj: any) {
    let result = 0;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result++;
        }
    }
    return result;
}

/**
 * 判断一个对象是否为空。
 * @param obj 要判断的对象。
 * @return 如果 *obj* 是 null、undefined、false、空字符串、空数组或空对象，则返回 true，否则返回 false。
 * @example isEmpty(null) // true
 * @example isEmpty(undefined) // true
 * @example isEmpty("") // true
 * @example isEmpty(" ") // false
 * @example isEmpty([]) // true
 * @example isEmpty({}) // true
 */
export function isEmpty(obj: any): obj is null {
    if (!obj || obj.length === 0) {
        return true;
    }
    for (const key in obj) {
        return false;
    }
    return true;
}

/**
 * 浅拷贝一个对象并返回和原对象无引用关系的副本。
 * @param obj 要复制的对象。
 * @return 返回拷贝的新对象，更新新对象不会影响原对象。
 * @desc 出于性能考虑，本函数不会拷贝函数和正则表达式。
 * @example clone({a: 3, b: [5]}) // {a: 3, b: [5]}
 */
export function clone<T>(obj: T) {
    if (obj && typeof obj === "object") {
        return { ...obj as any };
    }
    return obj;
}

/**
 * 深拷贝一个对象并返回和原对象无引用关系的副本。
 * @param obj 要复制的对象。
 * @param depth 最多拷贝的深度。
 * @return 返回拷贝的新对象，更新新对象不会影响原对象。
 * @desc 出于性能考虑，本函数不会深拷贝函数和正则表达式。
 * @example deepClone({a: 3, b: [5]}) // {a: 3, b: [5]}
 */
export function deepClone<T>(obj: T, depth = Infinity) {
    if (obj && typeof obj === "object" && depth-- === 0) {
        if (obj instanceof Array) {
            const newObj: any = [];
            for (let i = 0; i < obj.length; i++) {
                newObj[i] = deepClone(obj[i]);
            }
            obj = newObj;
        } else if (obj instanceof Date) {
            obj = new Date(+obj) as any;
        } else if (!(obj instanceof RegExp)) {
            const newObj: any = { __proto__: (obj as any).__proto__ };
            for (const i in obj) {
                newObj[i] = deepClone(obj[i]);
            }
            obj = newObj;
        }
    }
    return obj;
}

/**
 * 深拷贝一个对象并返回和原对象无引用关系的副本。此函数可以处理循环引用。
 * @param obj 要复制的对象。
 * @param depth 最多拷贝的深度。
 * @return 返回拷贝的新对象，更新新对象不会影响原对象。
 * @desc 出于性能考虑，本函数不会深拷贝函数和正则表达式。
 * @example deepCloneSafe({a: 3, b: [5]}) // {a: 3, b: [5]}
 */
export function deepCloneSafe<T>(obj: T, cloned: any[] = [], clonedResult: any[] = []) {
    if (obj && typeof obj === "object") {
        const index = cloned.indexOf(obj);
        if (index >= 0) {
            return clonedResult[index];
        }
        if (obj instanceof Array) {
            const newObj: any = [];
            cloned.push(obj);
            clonedResult.push(newObj);
            for (let i = 0; i < obj.length; i++) {
                newObj[i] = deepCloneSafe(obj[i], cloned, clonedResult);
            }
            obj = newObj;
        } else if (obj instanceof Date) {
            obj = new Date(+obj) as any;
        } else if (!(obj instanceof RegExp)) {
            const newObj: any = { __proto__: (obj as any).__proto__ };
            cloned.push(obj);
            clonedResult.push(newObj);
            for (const i in obj) {
                newObj[i] = deepCloneSafe(obj[i], cloned, clonedResult);
            }
            obj = newObj;
        }
    }
    return obj;
}

/**
 * 比较两个引用对象的内容是否相同。
 * @param x 要比较的第一个对象。
 * @param y 要比较的第二个对象。
 * @return 如果比较的对象相同则返回 true，否则返回 false。
 * @example deepEqual([], []) // true
 */
export function deepEqual(x: any, y: any) {
    if (x && y && typeof x === "object" && typeof y === "object") {
        if (Array.isArray(x) !== Array.isArray(y)) {
            return false;
        }
        for (const key in x) {
            if (!deepEqual(x[key], y[key])) {
                return false;
            }
        }
        for (const key in y) {
            if (!deepEqual(x[key], y[key])) {
                return false;
            }
        }
        return true;
    }
    return x === y;
}

/**
 * 深度比较两个对象的差异。
 * @param x 要比较的第一个对象。
 * @param y 要比较的第二个对象。
 * @return 返回一个新对象。
 * @example diff({ a:1, c: 1 }, { b: 1, c: 2 }) // { left: ["a"], right: ["b"], both: ["c"] }
 */
export function diff(x: any, y: any) {
    const result = {

        /**
         * 获取仅在左值存在的字段。
         */
        left: [] as string[],

        /**
         * 获取仅在右值存在的字段。
         */
        right: [] as string[],

        /**
         * 获取在左右同时存在但其值不同的字段。
         */
        both: [] as string[],

    };
    for (const key in x) {
        if (!(key in y)) {
            result.left.push(key);
        } else if (x[key] !== y[key]) {
            result.both.push(key);
        }
    }
    for (const key in y) {
        if (!(key in x)) {
            result.right.push(key);
        }
    }
    return result;
}

/**
 * 深度比较两个对象的差异。
 * @param objX 要比较的第一个对象。
 * @param objY 要比较的第二个对象。
 * @param depth 最多比较的深度。
 * @return 返回一个新对象。
 * @example deepDiff({ a:1, c: 1 }, { b: 1, c: 2 }) // {left: ["a"], right: ["b"], both: ["c"]}
 */
export function deepDiff(x: any, y: any, depth = Infinity) {
    const result = {

        /**
         * 获取仅在左值存在的字段。
         */
        left: [] as string[],

        /**
         * 获取仅在右值存在的字段。
         */
        right: [] as string[],

        /**
         * 获取在左右同时存在但其值不同的字段。
         */
        both: [] as string[],

    };
    diff(x, y, "", depth);
    return result;
    function diff(x: any, y: any, prefix: string, depth: number) {
        if (depth-- === 0) {
            return;
        }
        for (const key in x) {
            if (!(key in y)) {
                result.left.push(prefix + key);
            } else if (x[key] !== y[key]) {
                if (typeof x[key] !== "object" || typeof y[key] !== "object") {
                    result.both.push(prefix + key);
                } else {
                    diff(x[key], y[key], prefix + key + ".", depth);
                }
            }
        }
        for (const key in y) {
            if (!(key in x)) {
                result.right.push(prefix + key);
            }
        }
    }
}

/**
 * 返回第一个不为空的值。
 * @param values 要检测的对象。
 * @return 返回第一个不为空的值。如果都为空则返回 undefined。
 * @example pick(undefined, null, 1) // 1
 */
export function pick(...values: any[]) {
    for (const value of values) {
        if (value != undefined) {
            return value;
        }
    }
}

/**
 * 返回对象中指定值对应的第一个键。
 * @param obj 要搜索的对象。
 * @param value 要查找的值。
 * @return 返回匹配的第一个键，如果不存在匹配的值则返回 null。
 * @example keyOf({a:1, b:1}, 1) // "a"
 */
export function keyOf(obj: any, value: any) {
    for (const key in obj) {
        if (obj[key] === value) {
            return key;
        }
    }
    return null;
}

/**
 * 获取对象指定属性的值。
 * @param obj 要获取的对象。
 * @param prop 要获取的属性表达式。如 `a.b[0]`。
 * @return 返回属性值。如果属性不存在则返回 undefined。
 * @example get({a: {b: 1}}, "a.b") // 1
 */
export function get(obj: any, prop: string) {
    prop.replace(/\.?\s*([^\.\[]+)|\[\s*([^\]]*)\s*\]/g, ((_: string, propName: string, indexer: string) => {
        if (obj) {
            obj = obj[propName || indexer];
        }
    }) as any);
    return obj;
}

/**
 * 设置对象指定属性的值。
 * @param obj 要设置的对象。
 * @param prop 要设置的属性表达式。如 `a.b[0]`。
 * @param value 要设置的值。
 * @example set({}, "a[1].b", 2) // { a: [undefined, { b: 2 }]}
 */
export function set(obj: any, prop: string, value: any) {
    let prevObject: any;
    let prevKey: string;
    prop.replace(/\.?\s*([^\.\[]+)|\[\s*([^\]]*)\s*\]/g, ((source: string, propName: string | undefined, indexer: string | undefined, index: number) => {
        let currentObject = prevKey ? prevObject[prevKey] : obj;
        if (currentObject == null) {
            currentObject = indexer ? [] : {};
            if (prevKey) {
                prevObject[prevKey] = currentObject;
            } else {
                prevObject = obj = currentObject;
            }
        }
        prevObject = currentObject;
        prevKey = propName || indexer!;
        if (index + source.length === prop.length) {
            currentObject[prevKey] = value;
        }
    }) as any);
    return obj;
}

/**
 * 设置一个对象的属性值。
 * @param obj 要修改的对象。
 * @param key 要设置的属性名。
 * @param value 要设置的属性值。
 * @return 返回已修改的对象。
 * @example setProperty({myKey: "oldValue"}, "myKey", "newValue")
 */
export function setProperty(obj: any, key: string, value: any) {
    return Object.defineProperty(obj, key, {
        value: value,
        writable: true,
        enumerable: true,
        configurable: true
    });
}

/**
 * 添加调用指定成员函数后的回调函数。
 * @param obj 相关的对象。
 * @param key 相关的属性名。
 * @param callback 要添加的函数。
 * @example
 * var obj = { func: function() { console.log(1); } };
 * addCallback(obj, "func", function() { console.log(2); } )
 * obj.func(); // 输出 1, 2
 */
export function addCallback<T extends any>(obj: T, key: keyof T, callback: Function) {
    const oldFunc = obj[key] as Function;
    obj[key] = oldFunc ? function (this: any) {
        const oldResult = oldFunc.apply(this, arguments);
        const newResult = callback.apply(this, arguments);
        return oldResult !== undefined ? oldResult : newResult;
    } : callback;
}

/**
 * 添加设置指定属性后的回调函数。
 * @param obj 相关的对象。
 * @param key 相关的属性名。
 * @param callback 要添加的函数。
 */
export function addSetter<T extends any>(obj: T, key: keyof T, callback: Function) {
    let originalData: any;
    Object.defineProperty(obj, key, {
        get() {
            return originalData;
        },
        set(value) {
            originalData = value;
            callback();
        }
    })
}
