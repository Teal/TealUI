/**
 * 复制源对象的所有可枚举属性到目标对象，如果目标对象中对应的属性值不是 undefined 则跳过。
 * @param target 目标对象。
 * @param source 源对象。源对象可以是 null 或 undefined。
 * @return 返回目标对象。
 * @example assignIf({a: 1}, {a: 2, b: 2}) // {a: 1, b: 2}
 */
export function assignIf<T, R>(target: T, source: R) {
    for (const key in source as any) {
        if ((target as any)[key] === undefined) {
            (target as any)[key] = (source as any)[key];
        }
    }
    return target as T & R;
}

/**
 * 获取对象自身或原型上的属性描述符。
 * @param obj 对象。
 * @param key 要获取的属性名。
 * @return 返回对象描述器。如果找不到则返回 undefined。
 */
export function getPropertyDescriptor(obj: any, key: string) {
    let desc: PropertyDescriptor | undefined;
    while (obj && !(desc = Object.getOwnPropertyDescriptor(obj, key))) {
        obj = obj.__proto__ || Object.getPrototypeOf(obj);
    }
    return desc;
}

/**
 * 在对象指定的键之前插入一个键值对。
 * @param obj 对象。
 * @param newKey 要插入的键。
 * @param newValue 要插入的值。
 * @param refKey 指示插入位置的键，将在该键前插入。如果指定为 null 则插入到末尾。
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
 * 对类数组的每一项执行一次回调函数。
 * @param obj 类数组。
 * @param callback 回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - index：当前项的索引。
 * - target：类数组本身。
 *
 * 函数可以返回 false 以终止循环。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 如果循环是因为回调函数返回 false 而中止，则返回 false，否则返回 true。
 * @example each(["a", "b"], console.log, console); // 打印“0  a”和“1  b”
 */
export function each<T>(obj: ArrayLike<T>, callback: (value: T, index: number, target: ArrayLike<T>) => boolean | void, thisArg?: any): boolean;

/**
 * 对对象（函数除外）的每一项执行一次回调函数。
 * @param obj 对象。
 * @param callback 回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - key：当前项的键。
 * - target：对象本身。
 *
 * 函数可以返回 false 以终止循环。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 如果循环是因为回调函数返回 false 而中止，则返回 false，否则返回 true。
 * @example each({a: 1, b: 2}, console.log, console); // 打印“a  1”和“b  2”
 */
export function each<T>(obj: { [key: string]: T }, callback: (value: T, key: string, obj: { [key: string]: T }) => boolean | void, thisArg?: any): boolean;

export function each<T>(obj: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, obj: any) => boolean | void, thisArg?: any) {
    if (obj && typeof (obj as ArrayLike<T>).length === "number") {
        for (let i = 0; i < (obj as ArrayLike<T>).length; i++) {
            if ((i in obj) && callback.call(thisArg, (obj as any)[i], i, obj) === false) {
                return false;
            }
        }
    } else {
        for (const i in obj) {
            if (callback.call(thisArg, (obj as any)[i], i, obj) === false) {
                return false;
            }
        }
    }
    return true;
}

/**
 * 对类数组的每一项执行一次回调函数。
 * @param obj 类数组。
 * @param callback 回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - index：当前项的索引。
 * - target：类数组本身。
 * @param thisArg 执行回调函数时 this 的值。
 * @example forEach(["a", "b"], console.log, console) // 打印“0  a”和“1  b”
 */
export function forEach<T>(obj: ArrayLike<T>, callback: (value: T, index: number, target: ArrayLike<T>) => boolean | void, thisArg?: any): void;

/**
 * 对对象（函数除外）的每一项执行一次回调函数。
 * @param obj 对象。
 * @param callback 回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - key：当前项的键。
 * - target：对象本身。
 * @param thisArg 执行回调函数时 this 的值。
 * @example forEach({a: 1, b: 2}, console.log, console) // 打印“a  1”和“b  2”
 */
export function forEach<T>(obj: { [key: string]: T }, callback: (value: T, key: string, obj: { [key: string]: T }) => boolean | void, thisArg?: any): void;

export function forEach<T>(obj: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, obj: any) => boolean | void, thisArg?: any) {
    if (obj && typeof (obj as ArrayLike<T>).length === "number") {
        for (let i = 0; i < (obj as ArrayLike<T>).length; i++) {
            if (i in obj) {
                callback.call(thisArg, (obj as any)[i], i, obj);
            }
        }
    } else {
        for (const i in obj) {
            callback.call(thisArg, (obj as any)[i], i, obj);
        }
    }
}

/**
 * 筛选类数组中符合条件的项并组成一个新数组。
 * @param obj 类数组。
 * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - index：当前项的索引。
 * - target：类数组本身。
 *
 * 如果当前项符合条件应返回 true，否则返回 false。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 返回一个新数组。
 * @example filter([1, 2], function (item) { return item > 1; }) // [2]
 */
export function filter<T>(obj: ArrayLike<T>, callback: (value: T, index: number, target: ArrayLike<T>) => boolean, thisArg?: any): { [key: string]: T };

/**
 * 筛选对象（函数除外）中符合条件的项并组成一个新对象。
 * @param obj 对象。
 * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - key：当前项的键。
 * - target：对象本身。
 *
 * 如果当前项符合条件应返回 true，否则返回 false。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 返回一个新对象。
 * @example filter({a: 1, b: 2}, function (item) { return item > 1; }) // {b: 2}
 */
export function filter<T>(obj: { [key: string]: T }, callback: (value: T, key: string, obj: { [key: string]: T }) => boolean, thisArg?: any): { [key: string]: T };

export function filter<T>(obj: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, obj: any) => boolean, thisArg?: any) {
    let r: T[] | { [key: string]: T };
    if (obj && typeof (obj as ArrayLike<T>).length === "number") {
        r = [];
        for (let i = 0; i < (obj as ArrayLike<T>).length; i++) {
            if ((i in obj) && callback.call(thisArg, (obj as any)[i], i, obj)) {
                r.push((obj as any)[i]);
            }
        }
    } else {
        r = {};
        for (const i in obj) {
            if (callback.call(thisArg, (obj as any)[i], i, obj)) {
                r[i] = (obj as any)[i];
            }
        }
    }
    return r;
}

/**
 * 对类数组的每一项执行一次回调函数，然后将每个结果组成新数组。
 * @param obj 类数组。
 * @param callback 回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - index：当前项的索引。
 * - target：类数组本身。
 *
 * 函数应返回新的结果。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 返回一个新数组。
 * @example map(["a", "b"], function (a) { return a + a; }) // ["aa", "bb"]
 */
export function map<T, R>(obj: ArrayLike<T>, callback: (value: T, index: number, target: ArrayLike<T>) => R, thisArg?: any): R[];

/**
 * 对对象（函数除外）的每一项执行一次回调函数，然后将每个结果组成新数组。
 * @param obj 对象。
 * @param callback 回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - key：当前项的键。
 * - target：对象本身。
 *
 * 函数应返回新的结果。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 返回一个新对象。
 * @example map({length: 1, "0": "a"}, function (a) { return a + a; }) // ["a"]
 * @example map({a: "a", b: "b"}, function (a) { return a + a; }) // {a: "aa", b: "bb"}
 */
export function map<T, R>(obj: { [key: string]: T }, callback: (value: T, key: string, obj: { [key: string]: T }) => R, thisArg?: any): { [key: string]: R };

export function map<T, R>(obj: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, obj: any) => R, thisArg?: any) {
    let r: R[] | { [key: string]: R };
    if (obj && typeof (obj as ArrayLike<T>).length === "number") {
        r = [];
        for (let i = 0; i < (obj as ArrayLike<T>).length; i++) {
            if (i in obj) {
                r[i] = callback.call(thisArg, (obj as any)[i], i, obj);
            }
        }
    } else {
        r = {};
        for (const i in obj) {
            r[i] = callback.call(thisArg, (obj as any)[i], i, obj);
        }
    }
    return r;
}

/**
 * 判断类数组的每一项是否都符合条件。
 * @param obj 类数组。
 * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - index：当前项的索引。
 * - target：类数组本身。
 *
 * 如果当前项符合条件应返回 true，否则返回 false。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 如果所有项满足条件则返回 true，否则返回 false。
 * @example every([1, 2], function (item) { return item > 0; }) // true
 * @example every([1, 2], function (item) { return item > 1; }) // false
 * @example every([1, 2], function (item) { return item > 2; }) // false
 */
export function every<T>(obj: ArrayLike<T>, callback: (value: T, index: number, target: ArrayLike<T>) => boolean, thisArg?: any): boolean;

/**
 * 判断对象（函数除外）的每一项是否都符合条件。
 * @param obj 对象。
 * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - key：当前项的键。
 * - target：对象本身。
 *
 * 如果当前项符合条件应返回 true，否则返回 false。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 如果所有项满足条件则返回 true，否则返回 false。
 * @example every({a: 1, b: 2}, function (item) { return item > 0; }) // true
 * @example every({a: 1, b: 2}, function (item) { return item > 1; }) // false
 * @example every({a: 1, b: 2}, function (item) { return item > 2; }) // false
 */
export function every<T>(obj: { [key: string]: T }, callback: (value: T, key: string, obj: { [key: string]: T }) => boolean, thisArg?: any): boolean;

export function every<T>(obj: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, obj: any) => boolean, thisArg?: any) {
    if (obj && typeof (obj as ArrayLike<T>).length === "number") {
        for (let i = 0; i < (obj as ArrayLike<T>).length; i++) {
            if ((i in obj) && !callback.call(thisArg, (obj as any)[i], i, obj)) {
                return false;
            }
        }
    } else {
        for (const i in obj) {
            if (!callback.call(thisArg, (obj as any)[i], i, obj)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * 判断类数组中是否存在一项或多项符合条件。
 * @param obj 类数组。
 * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - index：当前项的索引。
 * - target：类数组本身。
 *
 * 如果当前项符合条件应返回 true，否则返回 false。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 如果至少存在一项满足条件则返回 true，否则返回 false。
 * @example some([1, 2], function (item) { return item > 0; }) // true
 * @example some([1, 2], function (item) { return item > 1; }) // true
 * @example some([1, 2], function (item) { return item > 2; }) // false
 */
export function some<T>(obj: ArrayLike<T>, callback: (value: T, index: number, target: ArrayLike<T>) => boolean, thisArg?: any): boolean;

/**
 * 判断对象（函数除外）中是否存在一项或多项符合条件。
 * @param obj 对象。
 * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - key：当前项的键。
 * - target：对象本身。
 *
 * 如果当前项符合条件应返回 true，否则返回 false。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 如果至少存在一项满足条件则返回 true，否则返回 false。
 * @example some({a: 1, b: 2}, function (item) { return item > 1; }) // true
 * @example some({a: 1, b: 2}, function (item) { return item > 1; }) // true
 * @example some({a: 1, b: 2}, function (item) { return item > 2; }) // false
 */
export function some<T>(obj: { [key: string]: T }, callback: (value: T, key: string, obj: { [key: string]: T }) => boolean, thisArg?: any): boolean;

export function some<T>(obj: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, obj: any) => boolean, thisArg?: any) {
    if (obj && typeof (obj as ArrayLike<T>).length === "number") {
        for (let i = 0; i < (obj as ArrayLike<T>).length; i++) {
            if ((i in obj) && callback.call(thisArg, (obj as ArrayLike<T>)[i], i, obj)) {
                return true;
            }
        }
    } else {
        for (const i in obj) {
            if (callback.call(thisArg, (obj as { [key: string]: T })[i], i, obj)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * 找出类数组中符合条件的第一项。
 * @param obj 类数组。
 * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - index：当前项的索引。
 * - target：类数组本身。
 *
 * 如果当前项符合条件应返回 true，否则返回 false。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 返回符合条件的第一项，如果找不到则返回 undefined。
 * @example find([1, 2], function (item) { return item > 1; }) // 2
 */
export function find<T>(obj: ArrayLike<T>, callback: (value: T, index: number, target: ArrayLike<T>) => boolean, thisArg?: any): T | undefined;

/**
 * 找出对象（函数除外）中符合条件的第一项。
 * @param obj 对象。
 * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - key：当前项的键。
 * - target：对象本身。
 *
 * 如果当前项符合条件应返回 true，否则返回 false。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 返回符合条件的第一项，如果找不到则返回 undefined。
 * @example find({a: 1, b: 2}, function (item) { return item > 1; }) // 2
 */
export function find<T>(obj: { [key: string]: T }, callback: (value: T, key: string, obj: { [key: string]: T }) => boolean, thisArg?: any): T | undefined;

export function find<T>(obj: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, obj: any) => boolean, thisArg?: any) {
    if (obj && typeof (obj as ArrayLike<T>).length === "number") {
        for (let i = 0; i < (obj as ArrayLike<T>).length; i++) {
            if ((i in obj) && callback.call(thisArg, (obj as ArrayLike<T>)[i], i, obj)) {
                return (obj as any)[i] as T;
            }
        }
    } else {
        for (const i in obj) {
            if (callback.call(thisArg, (obj as { [key: string]: T })[i], i, obj)) {
                return (obj as { [key: string]: T })[i];
            }
        }
    }
}

/**
 * 找出类数组中符合条件的第一项的索引。
 * @param obj 类数组。
 * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - index：当前项的索引。
 * - target：类数组本身。
 *
 * 如果当前项符合条件应返回 true，否则返回 false。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 返回符合条件的第一项的索引，如果找不到则返回 -1。
 * @example findIndex([1, 2], function (item){ return item > 1; }) // 1
 * @example findIndex([1, 2], function (item){ return item > 2; }) // -1
 */
export function findIndex<T>(obj: ArrayLike<T>, callback: (value: T, index: number, target: ArrayLike<T>) => boolean, thisArg?: any): number;

/**
 * 找出指定对象（函数除外）中符合条件的第一项的键。
 * @param obj 对象。
 * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
 * - value：当前项的值。
 * - key：当前项的键。
 * - target：对象本身。
 *
 * 如果当前项符合条件应返回 true，否则返回 false。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 返回符合条件的第一项的键，如果找不到则返回 null。
 * @example findIndex({a: 1, b: 2}, function (item){return item > 1;}) // 'b'
 * @example findIndex({a: 1, b: 2}, function (item){return item > 2;}) // undefined
 */
export function findIndex<T>(obj: { [key: string]: T }, callback: (value: T, key: string, obj: { [key: string]: T }) => boolean, thisArg?: any): string | null;

export function findIndex<T>(obj: ArrayLike<T> | { [key: string]: T }, callback: (value: T, key: any, obj: any) => boolean, thisArg?: any) {
    if (obj && typeof (obj as ArrayLike<T>).length === "number") {
        for (let i = 0; i < (obj as ArrayLike<T>).length; i++) {
            if ((i in obj) && callback.call(thisArg, (obj as ArrayLike<T>)[i], i, obj)) {
                return i;
            }
        }
        return -1;
    } else {
        for (const i in obj) {
            if (callback.call(thisArg, (obj as { [key: string]: T })[i], i, obj)) {
                return i;
            }
        }
        return null;
    }
}

/**
 * 从左往右依次合并类数组中的每一项并最终返回一个值。
 * @param obj 类数组。
 * @param callback 用于合并两个项的回调函数。函数接收以下参数：
 * - previousValue：要合并的前一项。
 * - currentValue：要合并的当前项。
 * - index：当前项的索引。
 * - target：类数组本身。
 *
 * 函数应合并的结果。
 * @param initialValue 用于合并第一项的初始值。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 返回合并后的最终结果值。
 * @example reduce([1, 2], function (x, y) { return x + y; }) // 3
 * @example reduce([1, 2], function (x, y) { return x + y; }, 10) // 13
 */
export function reduce<T, R>(obj: ArrayLike<T>, callback: (previousValue: R, currentValue: T, index: number, target: ArrayLike<T>) => R, initialValue?: R, thisArg?: any): R | undefined;

/**
 * 从左往右依次合并对象（函数除外）中的每一项并最终返回一个值。
 * @param obj 对象。
 * @param callback 用于合并两个项的回调函数。函数接收以下参数：
 * - previousValue：要合并的前一项。
 * - currentValue：要合并的当前项。
 * - key：当前项的键。
 * - target：对象本身。
 *
 * 函数应合并的结果。
 * @param initialValue 用于合并第一项的初始值。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 返回合并后的最终结果值。
 * @example reduce({a: 1, b: 2}, function (x, y) { return x + y; }) // 3
 * @example reduce({a: 1, b: 2}, function (x, y) { return x + y; }, 10) // 13
 */
export function reduce<T, R>(obj: { [key: string]: T }, callback: (previousValue: R, currentValue: T, key: string, obj: { [key: string]: T }) => R, initialValue?: R, thisArg?: any): R | undefined;

export function reduce<T, R>(obj: ArrayLike<T> | { [key: string]: T }, callback: (previousValue: R, currentValue: T, key: any, obj: any) => R, initialValue?: R, thisArg?: any) {
    let r: R | undefined;
    let first = true;
    if (obj && typeof (obj as ArrayLike<T>).length === "number") {
        for (let i = 0; i < (obj as ArrayLike<T>).length; i++) {
            if (i in obj) {
                if (first) {
                    first = false;
                    r = initialValue === undefined ? (obj as any)[i] : callback.call(thisArg, initialValue, (obj as any)[i], i, obj);
                } else {
                    r = callback.call(thisArg, r, (obj as any)[i], i, obj);
                }
            }
        }
    } else {
        for (const i in obj) {
            if (first) {
                first = false;
                r = initialValue === undefined ? (obj as any)[i] : callback.call(thisArg, initialValue, (obj as any)[i], i, obj);
            } else {
                r = callback.call(thisArg, r, (obj as any)[i], i, obj);
            }
        }
    }
    return r;
}

/**
 * 从右往左依次合并类数组中的每一项并最终返回一个值。
 * @param obj 类数组。
 * @param callback 用于合并两个项的回调函数。函数接收以下参数：
 * - previousValue：要合并的前一项。
 * - currentValue：要合并的当前项。
 * - index：当前项的索引。
 * - target：类数组本身。
 *
 * 函数应合并的结果。
 * @param initialValue 用于合并第一项的初始值。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 返回合并后的最终结果值。
 * @example reduceRight([1, 2], function (x, y) { return x + y; }) // 3
 * @example reduceRight([1, 2], function (x, y) { return x + y; }, 10) // 13
 */
export function reduceRight<T, R>(obj: ArrayLike<T>, callback: (previousValue: R, currentValue: T, index: number, target: ArrayLike<T>) => R, initialValue?: R, thisArg?: any): R | undefined;

/**
 * 从右往左依次合并对象（函数除外）中的每一项并最终返回一个值。
 * @param obj 对象。
 * @param callback 用于合并两个项的回调函数。函数接收以下参数：
 * - previousValue：要合并的前一项。
 * - currentValue：要合并的当前项。
 * - key：当前项的键。
 * - target：对象本身。
 *
 * 函数应合并的结果。
 * @param initialValue 用于合并第一项的初始值。
 * @param thisArg 执行回调函数时 this 的值。
 * @return 返回合并后的最终结果值。
 * @example reduceRight({a: 1, b: 2}, function (x, y) { return x + y; }) // 3
 * @example reduceRight({a: 1, b: 2}, function (x, y) { return x + y; }, 10) // 13
 */
export function reduceRight<T, R>(obj: { [key: string]: T }, callback: (previousValue: R, currentValue: T, key: string, obj: { [key: string]: T }) => R, initialValue?: R, thisArg?: any): R | undefined;

export function reduceRight<T, R>(obj: ArrayLike<T> | { [key: string]: T }, callback: (previousValue: R, currentValue: T, key: any, obj: any) => R, initialValue?: R, thisArg?: any) {
    let r: R | undefined;
    let first = true;
    if (obj && typeof (obj as ArrayLike<T>).length === "number") {
        for (let i = (obj as ArrayLike<T>).length; --i >= 0;) {
            if (i in obj) {
                if (first) {
                    first = false;
                    r = initialValue === undefined ? (obj as any)[i] : callback.call(thisArg, initialValue, (obj as any)[i], i, obj);
                } else {
                    r = callback.call(thisArg, r, (obj as any)[i], i, obj);
                }
            }
        }
    } else {
        const key: string[] = [];
        for (const i in obj) {
            key.push(i);
        }
        for (let i = key.length; --i >= 0;) {
            if (first) {
                first = false;
                r = initialValue === undefined ? (obj as any)[key[i]] : callback.call(thisArg, initialValue, (obj as any)[key[i]], key[i], obj);
            } else {
                r = callback.call(thisArg, r, (obj as any)[key[i]], key[i], obj);
            }
        }
    }
    return r;
}

/**
 * 判断类数组中是否包含指定的项。
 * @param obj 类数组。
 * @param value 项。
 * @param start 开始查找的索引。
 * @return 如果找到匹配的项则返回 true，否则返回 false。
 * @example contains([1, 2, 3], 3) // true
 * @example contains([1, 2, 3], 4) // false
 */
export function contains<T>(obj: ArrayLike<T>, value: T, start?: number): boolean;

/**
 * 判断对象（函数除外）中是否包含指定的项。
 * @param obj 对象。
 * @param value 项。
 * @param start 开始查找的索引。
 * @return 如果找到匹配的项则返回 true，否则返回 false。
 * @example contains({a: 1, b: 2, c: 3}, 3) // true
 * @example contains({a: 1, b: 2, c: 3}, 4) // false
 */
export function contains<T>(obj: { [key: string]: T }, value: T, start?: string): boolean;

export function contains<T>(obj: ArrayLike<T> | { [key: string]: T }, value: T, start?: number | string) {
    if (obj && typeof (obj as ArrayLike<T>).length === "number") {
        for (let i = start as number || 0; i < (obj as ArrayLike<T>).length; i++) {
            if ((obj as ArrayLike<T>)[i] === value) {
                return true;
            }
        }
    } else {
        let skip = start !== undefined;
        for (const i in obj) {
            if (skip) {
                if (i !== start) {
                    continue;
                }
                skip = false;
            }
            if ((obj as { [key: string]: T })[i] === value) {
                return true;
            }
        }
    }
    return false;
}

/**
 * 获取对象包含指定键的子对象。
 * @param obj 对象。
 * @param keys 键列表。
 * @return 返回新对象。
 * @example subset({a: 1, b: 2}, ["a"]) // {a: 1}
 */
export function subset<T>(obj: { [key: number]: T } | { [key: string]: T }, keys: (string | number)[]) {
    const r: { [key: string]: T } = {};
    for (const key of keys) {
        if (key in obj) {
            r[key] = (obj as any)[key];
        }
    }
    return r;
}

/**
 * 将对象的键和值对换组成新对象。
 * @param obj 对象。
 * @return 返回新对象。
 * @example invert({a: 1, b: 2, c: 3}) // { 1: "a", 2: "b", 3: "c" }
 */
export function invert(obj: { [key: string]: any }) {
    const r: { [key: string]: any } = {};
    for (const key in obj) {
        r[obj[key]] = key;
    }
    return r;
}

/**
 * 判断一个对象是否是引用对象。
 * @param obj 对象。
 * @return 如果对象是引用对象则返回 true，否则返回 false。
 * @desc 此函数等效于 `obj !== null && typeof obj === "object"`
 * @example isObject({}) // true
 * @example isObject(null) // false
 */
export function isObject(obj: any): obj is object {
    return obj !== null && typeof obj === "object";
}

/**
 * 存储所有内置类型转为字符串的值。
 */
let types: { [key: string]: "string" | "number" | "boolean" | "undefined" | "null" | "array" | "function" | "date" | "regexp" | "error" | "object"; };

/**
 * 获取对象的类型名。
 * @param obj 对象。
 * @return 返回类型名。
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
 * 计算对象自身的可枚举属性数。
 * @param obj 对象。
 * @return 返回对象自身的可枚举属性数，原型上的属性会被忽略。
 * @example size({a: 1, b: 2}) // 2
 * @example size([0, 1]) // 2
 */
export function count(obj: any) {
    let r = 0;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            r++;
        }
    }
    return r;
}

/**
 * 判断对象是否为 null、undefined、空字符串、空数组或空对象。
 * @param obj 对象。
 * @return 如果对象是 null、undefined、false、空字符串、空数组或空对象，则返回 true，否则返回 false。
 * @example isEmpty(null) // true
 * @example isEmpty(undefined) // true
 * @example isEmpty("") // true
 * @example isEmpty(" ") // false
 * @example isEmpty([]) // true
 * @example isEmpty({}) // true
 */
export function isEmpty(obj: any): obj is null | undefined {
    if (!obj) {
        return true;
    }
    if (typeof obj !== "object") {
        return false;
    }
    if (obj.length === 0) {
        return true;
    }
    for (const key in obj) {
        return false;
    }
    return true;
}

/**
 * 浅拷贝指定的对象。
 * @param obj 对象。
 * @return 返回拷贝得到的新对象，该对象和原对象无引用关系。
 * @desc 出于性能考虑，此函数不会拷贝函数和正则表达式。
 * @example clone({a: 3, b: [5]}) // {a: 3, b: [5]}
 */
export function clone<T>(obj: T) {
    if (obj && typeof obj === "object") {
        return { ...obj as any };
    }
    return obj;
}

/**
 * 深拷贝一个对象。
 * @param obj 对象。
 * @param replacer 用于拷贝自定义对象的函数。函数接收一个参数为要拷贝的值，函数应返回拷贝后的新值。
 * @return 返回拷贝得到的新对象，该对象的每个层级和原对象都无引用关系。
 * @desc 出于性能考虑，此函数不会拷贝函数和正则表达式。
 * @example deepCloneSafe({a: 3, b: [5]}) // {a: 3, b: [5]}
 */
export function deepClone<T>(obj: T, replacer?: (obj: any) => any, cloned: any[] = [], clonedResult: any[] = []) {
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
                newObj[i] = deepClone(obj[i], replacer, cloned, clonedResult);
            }
            obj = newObj;
        } else if (obj instanceof Date) {
            obj = new Date(+obj) as any;
        } else if (!(obj instanceof RegExp)) {
            if (replacer) {
                obj = replacer(obj);
            } else {
                const newObj: any = { __proto__: (obj as any).__proto__ };
                cloned.push(obj);
                clonedResult.push(newObj);
                for (const i in obj) {
                    newObj[i] = deepClone(obj[i], replacer, cloned, clonedResult);
                }
                obj = newObj;
            }
        }
    }
    return obj;
}

/**
 * 深拷贝一个对象。不支持存在循环引用的对象。
 * @param obj 对象。
 * @param depth 拷贝的最大深度，超过此深度后将直接使用原值。
 * @param replacer 用于拷贝自定义对象的函数。函数接收一个参数为要拷贝的值，函数应返回拷贝后的新值。
 * @return 返回拷贝得到的新对象，该对象的每个层级和原对象都无引用关系。
 * @desc 出于性能考虑，此函数不会拷贝函数和正则表达式。
 * @example deepClone({a: 3, b: [5]}) // {a: 3, b: [5]}
 */
export function deepCloneFast<T>(obj: T, replacer?: (obj: any) => any, depth = Infinity) {
    if (obj && typeof obj === "object" && depth-- > 0) {
        if (obj instanceof Array) {
            const newObj: any = [];
            for (let i = 0; i < obj.length; i++) {
                newObj[i] = deepCloneFast(obj[i], replacer, depth);
            }
            obj = newObj;
        } else if (obj instanceof Date) {
            obj = new Date(+obj) as any;
        } else if (!(obj instanceof RegExp)) {
            if (replacer) {
                obj = replacer(obj);
            } else {
                const newObj: any = { __proto__: (obj as any).__proto__ };
                for (const i in obj) {
                    newObj[i] = deepCloneFast(obj[i], replacer, depth);
                }
                obj = newObj;
            }
        }
    }
    return obj;
}

/**
 * 比较两个引用对象的内容是否相同。
 * @param obj1 要比较的第一个对象。
 * @param obj2 要比较的第二个对象。
 * @return 如果比较的对象完全相同则返回 true，否则返回 false。
 * @example deepEqual([], []) // true
 */
export function deepEqual(obj1: any, obj2: any) {
    if (obj1 && obj2 && typeof obj1 === "object" && typeof obj2 === "object") {
        if (Array.isArray(obj1) || Array.isArray(obj2)) {
            if (!Array.isArray(obj1) || !Array.isArray(obj2) || obj1.length !== obj2.length) {
                return false;
            }
            for (let i = 0; i < obj1.length; i++) {
                if (!deepEqual(obj1[i], obj2[i])) {
                    return false;
                }
            }
            return true;
        }
        for (const key in obj1) {
            if (!deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        }
        for (const key in obj2) {
            if (!deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        }
        return true;
    }
    return obj1 === obj2;
}

/**
 * 浅比较两个对象的差异。
 * @param obj1 要比较的第一个对象。
 * @param obj2 要比较的第二个对象。
 * @return 返回包含差异信息的对象。该对象列出了只在其中某个对象存在的属性值和公共的属性值。
 * @example diff({ a:1, c: 1 }, { b: 1, c: 2 }) // { left: ["a"], right: ["b"], both: ["c"] }
 */
export function diff(obj1: any, obj2: any) {
    const r = {

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
    for (const key in obj1) {
        if (!(key in obj2)) {
            r.left.push(key);
        } else if (obj1[key] !== obj2[key]) {
            r.both.push(key);
        }
    }
    for (const key in obj2) {
        if (!(key in obj1)) {
            r.right.push(key);
        }
    }
    return r;
}

/**
 * 深比较两个对象的差异。
 * @param obj1 要比较的第一个对象。
 * @param obj2 要比较的第二个对象。
 * @param depth 比较的最大深度，超过此深度后的差异将被忽略。
 * @return 返回包含差异信息的对象。该对象列出了只在其中某个对象存在的属性值和公共的属性值。
 * @example deepDiff({ a:1, c: 1 }, { b: 1, c: 2 }) // {left: ["a"], right: ["b"], both: ["c"]}
 */
export function deepDiff(obj1: any, obj2: any, depth = Infinity) {
    const r = {

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
    diff(obj1, obj2, "", depth);
    return r;

    function diff(x: any, y: any, prefix: string, depth: number) {
        if (depth-- === 0) {
            return;
        }
        for (const key in x) {
            if (!(key in y)) {
                r.left.push(prefix + key);
            } else if (x[key] !== y[key]) {
                if (typeof x[key] !== "object" || typeof y[key] !== "object") {
                    r.both.push(prefix + key);
                } else {
                    diff(x[key], y[key], prefix + key + ".", depth);
                }
            }
        }
        for (const key in y) {
            if (!(key in x)) {
                r.right.push(prefix + key);
            }
        }
    }
}

/**
 * 删除对象中值为 null 或 undefined 的键。
 * @param obj 对象。
 * @return 返回原对象。
 * @example clean({a: undefined, b: null, c: 3}) // {c: 3}
 */
export function clean(obj: { [key: string]: any }) {
    for (const key in obj) {
        if (obj[key] == null) {
            delete obj[key];
        }
    }
    return obj;
}

/**
 * 返回对象中指定键组成的新对象。
 * @param obj 对象。
 * @param keys 要选择的所有键。
 * @return 返回新对象。
 * @example select({a: 1, b: 2, c: 3}, "a",  "c") // {a: 1, c: 3}
 */
export function select(obj: { [key: string]: any }, ...keys: string[]) {
    const r: { [key: string]: any } = {};
    for (const key of keys) {
        r[key] = obj[key];
    }
    return r;
}

/**
 * 查找所有参数中第一个不为 undefined 和 null 的值。
 * @param values 所有值。
 * @return 返回第一个不为 undefined 和 null 的值。如果找不到则返回 undefined。
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
 * 查找对象中指定值对应的第一个键。
 * @param obj 对象。
 * @param value 值。
 * @return 返回匹配的第一个键，如果找不到则返回 null。
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
 * @param obj 对象。
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
 * @param obj 对象。
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
}

/**
 * 强制覆盖对象的属性值。
 * @param obj 对象。
 * @param key 要设置的属性名。
 * @param value 要设置的属性值。
 * @example setProperty({myKey: "oldValue"}, "myKey", "newValue")
 */
export function setProperty(obj: any, key: string, value: any) {
    Object.defineProperty(obj, key, {
        value: value,
        writable: true,
        enumerable: true,
        configurable: true
    });
}

/**
 * 添加调用指定成员函数后的回调函数。
 * @param obj 对象。
 * @param key 属性名。
 * @param callback 回调函数。函数接收原函数的所有参数。如果原函数返回 undefined 则返回该函数的返回值。
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
 * @param obj 对象。
 * @param key 属性名。
 * @param callback 回调函数。函数接收以下参数：
 * - this：当前对象。
 * - value：设置的新属性值。
 */
export function addSetCallback<T extends any>(obj: T, key: keyof T, callback: (this: T, value: any) => void) {
    const original = getPropertyDescriptor(obj, key);
    if (original && (original.get || original.set)) {
        Object.defineProperty(obj, key, {
            get: original.get && function (this: any) {
                return original.get!.call(this);
            },
            set: original.set && function (this: any, value) {
                original.set!.call(this, value);
                callback.call(this, value);
            },
        });
    } else {
        let currentValue: any;
        Object.defineProperty(obj, key, {
            get() {
                return currentValue;
            },
            set(value) {
                currentValue = value;
                callback.call(this, value);
            }
        });
    }
}
