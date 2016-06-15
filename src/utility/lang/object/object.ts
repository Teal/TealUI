/**
 * @fileOverview 对象(Object)扩展
 * @author xuld@vip.qq.com
 * @description 提供 JavaScript 内置对象 Object 的扩展 API。
 * @namespace Object
 */

// #region 语言内置

/**
 * 复制对象的所有属性到目标对象。
 * @param target 复制的目标对象。
 * @param sources 复制的源对象。
 * @returns 返回 *target*。
 * @example Object.assign({a: 1}, {b: 2}) // {a: 1, b: 2}
 * @example Object.assign({a: 1}, {a: 2}) // {a: 2}
 * @example Object.assign({a: 1}, {b: 2}, {b: 3}) // {a: 1, b: 3}
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
export function assign<T>(target: T, ...sources: any[]) {
    target = Object(target);
    for (let i = 1; i < arguments.length; i++) {
        const source = arguments[i];
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

/**
 * 复制对象的所有属性到目标对象。
 * @param target 复制的目标对象。
 * @param source 复制的源对象。
 * @returns 返回 *target*。
 * @example Object.assign({a: 1}, {b: 2}) // {a: 1, b: 2}
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
export function assign_simple<T>(target: T, source: any) {
    for (const key in source) {
        target[key] = source[key];
    }
    return target;
}

/**
 * 获取对象的所有键。
 * @param obj 要获取的对象。
 * @returns 返回所有键组成的数组。
 * @example Object.keys({a: 3, b: 5}) // ["a", "b"]
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 * @see values
 */
export function keys(obj: any) {
    let result: string[] = [];
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result.push(key);
        }
    }
    return result;
}

/**
 * 获取对象的所有值。
 * @param obj 要获取的对象。
 * @returns 返回所有值组成的数组。
 * @example Object.values({a: 3, b: 5}) // [3, 5]
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/values
 * @see keys
 */
export function values(obj: any) {
    let result = [];
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result.push(obj[key]);
        }
    }
    return result;
}

/**
 * 创建一个包含指定原型的对象。
 * @param proto 原型。
 * @param properties 包含的属性。
 * @returns 返回创建的对象。
 * @example Object.create({a: 3, b: 5}) // {a: 3, b: 5}
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
 */
export function create<T>(obj: T, properties?: any): T {
    properties = properties || {};
    properties.__proto__ = obj;
    return properties;
}

/**
 * 创建一个包含指定原型的对象。
 * @param proto 原型。
 * @param properties 包含的属性。
 * @returns 返回创建的对象。
 * @example Object.create({a: 3, b: 5}) // {a: 3, b: 5}
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
 */
export function create_simple<T>(obj: T): T {
    return { __proto__: obj } as any;
}

// #endregion

// #region 集合处理

/**
 * 遍历指定类数组或对象，并对每一项执行 *callback*。
 * @param iterable 要遍历的类数组或对象（不支持函数）。
 * @param callback 对每一项执行的回调函数。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的类数组或对象。
 * * returns 函数可以返回 false 以终止循环。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @returns 如果循环是因为 *callback* 返回 false 而中止，则返回 false，否则返回 true。
 * @example Object.each({a: 1, b: 2}, console.log, console); // 打印 'a  1' 和 'b  2'
 * @example Object.each(["a", "b"], console.log, console); // 打印 '0  a' 和 '1  b'
 */
export function each<T>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (value: T, index: number | string, target: typeof iterable) => boolean | void, scope?: any) {
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        const length = (iterable as ArrayLike<T>).length;
        for (let i = 0; i < length; i++) {
            if ((i in iterable) && callback.call(scope, iterable[i], i, iterable) === false) {
                return false;
            }
        }
    } else {
        for (let i in iterable) {
            if (callback.call(scope, iterable[i], i, iterable) === false) {
                return false;
            }
        }
    }
    return true;
}

/**
 * 遍历指定类数组或对象，并对每一项执行 *callback*。
 * @param iterable 要遍历的类数组或对象（不支持函数）。
 * @param callback 对每一项执行的回调函数。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的类数组或对象。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @example Object.forEach({a: 1, b: 2}, console.log, console); // 打印 'a  1' 和 'b  2'
 * @example Object.forEach(["a", "b"], console.log, console); // 打印 '0  a' 和 '1  b'
 */
export function forEach<T>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (value: T, index: number | string, target: typeof iterable) => boolean | void, scope?: any) {
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        const length = (iterable as ArrayLike<T>).length;
        for (let i = 0; i < length; i++) {
            if (i in iterable) {
                callback.call(scope, iterable[i], i, iterable);
            }
        }
    } else {
        for (let i in iterable) {
            callback.call(scope, iterable[i], i, iterable);
        }
    }
}

/**
 * 筛选指定类数组或对象中符合要求的项并组成一个新数组或对象。
 * @param iterable 要遍历的类数组或对象（不支持函数）。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的类数组或对象。
 * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @returns 返回一个新数组或对象。
 * @example Object.filter([1, 2], function(item){return item > 1;}) // [2]
 * @example Object.filter({a: 1, b: 2}, function(item){ return item > 1; }) // {b:2}
 */
export function filter<T>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (value: T, index: number | string, target: typeof iterable) => boolean, scope?: any) {
    let result: T[] | { [key: string]: T };
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        result = [];
        const length = (iterable as ArrayLike<T>).length;
        for (let i = 0; i < length; i++) {
            if ((i in iterable) && callback.call(scope, iterable[i], i, iterable)) {
                (result as T[]).push(iterable[i]);
            }
        }
    } else {
        result = {};
        for (let i in iterable) {
            if (callback.call(scope, iterable[i], i, iterable)) {
                result[i] = iterable[i];
            }
        }
    }
    return result;
}

/**
 * 遍历指定类数组或对象，并对每一项执行 *callback*，然后返回每个结果组成的新数组或对象。
 * @param iterable 要遍历的类数组或对象（不支持函数）。
 * @param callback 对每一项执行的回调函数，用于计算每一项的返回值。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的类数组或对象。
 * * returns 返回结果。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @returns 返回一个新数组或对象。
 * @example Object.map(["a", "b"], function(a){ return a + a; }) // ["aa", "bb"]
 * @example Object.map({length: 1, "0": "a"}, function(a){ return a + a; }) // ["a"]
 * @example Object.map({a: "a", b: "b"}, function(a){ return a + a; }) // {a: "aa", b: "bb"}
 */
export function map<T, R>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (value: T, index: number | string, target: R) => boolean, scope?: any) {
    let result: R[] | { [key: string]: R };
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        result = [];
        const length = (iterable as ArrayLike<T>).length;
        for (let i = 0; i < length; i++) {
            if (i in iterable) {
                result[i] = callback.call(scope, iterable[i], i, iterable);
            }
        }
    } else {
        result = {};
        for (let i in iterable) {
            result[i] = callback.call(scope, iterable[i], i, iterable);
        }
    }
    return result;
}

/**
 * 判断指定类数组或对象是否每一项都满足指定条件。
 * @param iterable 要遍历的类数组或对象（不支持函数）。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的类数组或对象。
 * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @returns 如果所有项满足条件则返回 true，否则返回 false。
 * @example Object.every([1, 2], function(item) {return item > 0}) // true
 * @example Object.every([1, 2], function(item) {return item > 1}) // false
 * @example Object.every([1, 2], function(item) {return item > 2}) // false
 * @example Object.every({a: 1, b: 2}, function(item) {return item > 0}) // true
 * @example Object.every({a: 1, b: 2}, function(item) {return item > 1}) // false
 * @example Object.every({a: 1, b: 2}, function(item) {return item > 2}) // false
 */
export function every<T>(iterable: ArrayLike<any> | { [key: string]: T }, callback: (value: T, index: number | string, target: typeof iterable) => boolean, scope?: any) {
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        const length = (iterable as ArrayLike<T>).length;
        for (let i = 0; i < length; i++) {
            if ((i in iterable) && callback.call(scope, iterable[i], i, iterable)) {
                return false;
            }
        }
    } else {
        for (let i in iterable) {
            if (callback.call(scope, iterable[i], i, iterable)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * 判断指定类数组或对象是否至少存在一项满足指定条件。
 * @param iterable 要遍历的类数组或对象（不支持函数）。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的类数组或对象。
 * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @returns 如果至少存在一项满足条件则返回 true，否则返回 false。
 * @example Object.some([1, 2], function(item) {return item > 0}) // true
 * @example Object.some([1, 2], function(item) {return item > 1}) // true
 * @example Object.some([1, 2], function(item) {return item > 2}) // false
 * @example Object.some({a: 1, b: 2}, function(item) {return item > 1}) // true
 * @example Object.some({a: 1, b: 2}, function(item) {return item > 1}) // true
 * @example Object.some({a: 1, b: 2}, function(item) {return item > 2}) // false
 */
export function some<T>(iterable: ArrayLike<any> | { [key: string]: T }, callback: (value: T, index: number | string, target: typeof iterable) => boolean, scope?: any) {
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        const length = (iterable as ArrayLike<T>).length;
        for (let i = 0; i < length; i++) {
            if ((i in iterable) && callback.call(scope, iterable[i], i, iterable)) {
                return true;
            }
        }
    } else {
        for (let i in iterable) {
            if (callback.call(scope, iterable[i], i, iterable)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * 找出指定类数组或对象中符合要求的第一项。
 * @param iterable 要遍历的类数组或对象（不支持函数）。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的类数组或对象。
 * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @returns 返回符合条件的第一项，如果没有满足条件的项，则返回 undefined。
 * @example Object.find([1, 2], function(item){ return item > 1; }) // 2
 * @example Object.find({a: 1, b: 2}, function(item){return item > 1;}) // 2
 */
export function find<T>(iterable: ArrayLike<any> | { [key: string]: T }, callback: (value: T, index: number | string, target: typeof iterable) => boolean, scope?: any) {
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        const length = (iterable as ArrayLike<T>).length;
        for (let i = 0; i < length; i++) {
            if ((i in iterable) && callback.call(scope, iterable[i], i, iterable)) {
                return iterable[i];
            }
        }
    } else {
        for (let i in iterable) {
            if (callback.call(scope, iterable[i], i, iterable)) {
                return iterable[i];
            }
        }
    }
}

/**
 * 找出指定类数组或对象中符合要求的第一项的索引或键。
 * @param iterable 要遍历的类数组或对象（不支持函数）。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的类数组或对象。
 * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @returns 返回符合条件的第一项的索引或键，如果没有满足条件的项，则返回 undefined。
 * @example Object.findIndex([1, 2], function(item){ return item > 1; }) // 1
 * @example Object.findIndex({a: 1, b: 2}, function(item){return item > 1;}) // 'b'
 */
export function findIndex<T>(iterable: ArrayLike<any> | { [key: string]: T }, callback: (value: T, index: number | string, target: typeof iterable) => boolean, scope?: any): number | string {
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        const length = (iterable as ArrayLike<T>).length;
        for (let i = 0; i < length; i++) {
            if ((i in iterable) && callback.call(scope, iterable[i], i, iterable)) {
                return i;
            }
        }
    } else {
        for (let i in iterable) {
            if (callback.call(scope, iterable[i], i, iterable)) {
                return i;
            }
        }
    }
}

/**
 * 从左往右依次合并类数组或对象中的每一项并最终返回一个值。
 * @param iterable 要遍历的类数组或对象（不支持函数）。
 * @param callback 对每一项执行的回调函数，每次合并两项为一项。
 * * param previousValue 要合并的前一项。
 * * param currentValue 要合并的当前项。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的类数组或对象。
 * * returns 返回合并的结果。
 * @param initialValue 用于合并第一项的初始值。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @returns 返回合并后的最终结果值。
 * @example Object.reduce([1, 2], function(x, y) {return x + y}) // 3
 * @example Object.reduce([1, 2], function(x, y) {return x + y}, 10) // 13
 * @example Object.reduce({a: 1, b: 2}, function(x, y) {return x + y}) // 3
 * @example Object.reduce({a: 1, b: 2}, function(x, y) {return x + y}, 10) // 13
 */
export function reduce<T, R>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (previousValue: R, currentValue: T, index: number | string, target: typeof iterable) => R, initialValue?: R, scope?: any) {
    let result: R;
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        const length = (iterable as ArrayLike<T>).length;
        for (let i = 0, first = true; i < length; i++) {
            if (i in iterable) {
                if (first) {
                    first = false;
                    result = initialValue === undefined ? iterable[i] : callback.call(scope, initialValue, iterable[i], i, iterable);
                } else {
                    result = callback.call(scope, result, iterable[i], i, iterable);
                }
            }
        }
    } else {
        result = reduce(Object.keys(iterable), (previousKey: any, currentKey: any) => callback(iterable[previousKey], iterable[currentKey], currentKey, iterable));
    }
    return result;
}

/**
 * 从左往右依次合并类数组或对象中的每一项并最终返回一个值。
 * @param iterable 要遍历的类数组或对象（不支持函数）。
 * @param callback 对每一项执行的回调函数，每次合并两项为一项。
 * * param previousValue 要合并的前一项。
 * * param currentValue 要合并的当前项。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的类数组或对象。
 * * returns 返回合并的结果。
 * @param initialValue 用于合并第一项的初始值。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @returns 返回合并后的最终结果值。
 * @example Object.reduceRight([1, 2], function(x, y) {return x + y}) // 3
 * @example Object.reduceRight([1, 2], function(x, y) {return x + y}, 10) // 13
 * @example Object.reduceRight({a: 1, b: 2}, function(x, y) {return x + y}) // 3
 * @example Object.reduceRight({a: 1, b: 2}, function(x, y) {return x + y}, 10) // 13
 */
export function reduceRight<T, R>(iterable: ArrayLike<T> | { [key: string]: T }, callback: (previousValue: R, currentValue: T, index: number | string, target: typeof iterable) => R, initialValue?: R, scope?: any) {
    let result: R;
    if (iterable && typeof (iterable as ArrayLike<T>).length === "number") {
        for (let i = (iterable as ArrayLike<T>).length, first = true; --i >= 0;) {
            if (i in iterable) {
                if (first) {
                    first = false;
                    result = initialValue === undefined ? this[i] : callback(initialValue, this[i], i, this);
                } else {
                    result = callback(result, this[i], i, this);
                }
            }
        }
    } else {
        result = reduceRight(Object.keys(iterable), (previousKey: any, currentKey: any) => callback(iterable[previousKey], iterable[currentKey], currentKey, iterable));
    }
    return result;
}

// #endregion

// #region 对象处理

/**
 * 获取指定对象的类型。
 * @param obj 要判断的对象。
 * @returns 返回类型字符串。
 * @example Object.type(null) // "null"
 * @example Object.type(undefined) // "undefined"
 * @example Object.type(new Function) // "function"
 * @example Object.type(+'a') // "number"
 * @example Object.type(/a/) // "regexp"
 * @example Object.type([]) // "array"
 */
export function type(obj: any): "string" | "number" | "boolean" | "undefined" | "null" | "array" | "function" | "date" | "regexp" | "error" | "object" {
    let cache = type.types;
    if (!cache) {
        Object["_types"] = cache = {};
        "Boolean Number String Function Array Date RegExp Object Error".replace(/\w+/g, typeName => cache["[object " + typeName + "]"] = typeName.toLowerCase());
    }
    return obj == null ? String(obj) : cache[cache.toString.call(obj)] || "object";
}

export namespace type {
    export var types: { [key: string]: any };
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
export function isEmpty(obj: any) {
    return !obj || obj.length === 0;
}

/**
 * 判断一个对象是否是引用对象。
 * @param obj 要判断的对象。
 * @returns 如果 *obj* 是引用变量，则返回 true，否则返回 false。
 * @remark 此函数等效于 `obj !== null && typeof obj === "object"`
 * @example Object.isObject({}) // true
 * @example Object.isObject(null) // false
 */
export function isObject(obj: any) {
    return obj !== null && typeof obj === "object";
}

/**
 * 复制对象的所有目标对象不存在的属性到目标对象。
 * @param target 复制的目标对象。
 * @param sources 复制的源对象。
 * @returns 返回 *target*。
 * @example Object.assignIf({a: 1}, {b: 2}) // {a: 1, b: 2}
 * @example Object.assignIf({a: 1}, {b: 2}, {b: 3}) // {a: 1, b: 2}
 */
export function assignIf<T>(target: T) {
    target = Object(target);
    for (let i = 1; i < arguments.length; i++) {
        const source = arguments[i];
        for (const key in source) {
            if (target[key] === undefined) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

/**
 * 浅拷贝一个对象并返回和原对象无引用关系的副本。
 * @param obj 要复制的对象。
 * @returns 返回拷贝的新对象，更新新对象不会影响原对象。
 * @remark > 注意：出于性能考虑，`export function clone` 不会拷贝函数和正则表达式。
 * @example Object.clone({a: 3, b: [5]}) // {a: 3, b: [5]}
 */
export function clone(obj: any) {
    if (obj && typeof obj === 'object') {
        if (obj instanceof Array) {
            obj = obj.slice(0);
        } else if (obj instanceof Date) {
            obj = new Date(+obj);
        } else if (!(obj instanceof RegExp)) {
            let newObj = { __proto__: obj.__proto__ };
            for (const i in obj) {
                newObj[i] = obj[i];
            }
            obj = newObj;
        }
    }
    return obj;
}

/**
 * 深拷贝一个对象并返回和原对象无引用关系的副本。
 * @param obj 要复制的对象。
 * @returns 返回拷贝的新对象，更新新对象不会影响原对象。
 * @remark > 注意：出于性能考虑，`export function deepClone` 不会深拷贝函数和正则表达式。
 * @example Object.deepClone({a: 3, b: [5]}) // {a: 3, b: [5]}
 */
export function deepClone(obj: any) {
    if (obj && typeof obj === 'object') {
        if (obj instanceof Array) {
            let newObj = [];
            for (let i = 0; i < obj.length; i++) {
                newObj[i] = deepClone(obj[i]);
            }
            obj = newObj;
        } else if (obj instanceof Date) {
            obj = new Date(+obj);
        } else if (!(obj instanceof RegExp)) {
            let newObj = { __proto__: obj.__proto__ };
            for (const i in obj) {
                newObj[i] = deepClone(obj[i]);
            }
            obj = newObj;
        }
    }
    return obj;
}

/**
 * 计算对象的属性数。
 * @param obj 要处理的对象。
 * @returns 返回对象自身的属性数，不包含原型属性。
 * @example Object.size({a: 1, b: 2}) // 2
 * @example Object.size([0, 1]) // 2
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
 * 比较两个引用对象的内容是否相同。
 * @param objX 要比较的第一个对象。
 * @param objY 要比较的第二个对象。
 * @returns 如果比较的对象相同则返回 true，否则返回 false。
 * @example Object.deepEqual([], []) // true
 */
export function deepEqual(objX: any, objY: any) {
    if (objX && objY && typeof objX === "object" && typeof objY === "object") {
        for (const key in objX) {
            if (!deepEqual(objX[key], objY[key])) {
                return false;
            }
        }
        return true;
    }
    return objX === objY;
}

/**
 * 深度比较两个对象的差异。
 * @param objX 要比较的第一个对象。
 * @param objY 要比较的第二个对象。
 * @returns 返回一个对象。
 * @example Object.diff({a:1, c: 1}, {b:1, c: 2}) // {left: ["a"], right: ["b"], both: ["c"]}
 */
export function diff(objX: any, objY: any) {

    let result = {

        /**
         * 获取仅在左值存在的字段。
         */
        left: [],

        /**
         * 获取仅在右值存在的字段。
         */
        right: [],

        /**
         * 获取在左右同时存在但其值不同的字段。
         */
        both: []

    };

    for (const key in objX) {
        if (!(key in objY)) {
            result.left.push(key);
        } else if (objX[key] !== objY[key]) {
            result.both.push(key);
        }
    }

    for (const key in objY) {
        if (!(key in objX)) {
            result.right.push(key);
        }
    }

    return result;
}

/**
 * 深度比较两个对象的差异。
 * @param objX 要比较的第一个对象。
 * @param objY 要比较的第二个对象。
 * @returns 返回一个对象。
 * @example Object.diff({a:1, c: 1}, {b:1, c: 2}) // {left: ["a"], right: ["b"], both: ["c"]}
 */
export function deepDiff(objX: any, objY: any) {
    let result = {

        /**
         * 获取仅在左值存在的字段。
         */
        left: [],

        /**
         * 获取仅在右值存在的字段。
         */
        right: [],

        /**
         * 获取在左右同时存在但其值不同的字段。
         */
        both: []

    };

    diff(objX, objY, "");

    return result;

    function diff(objX: any, objY: any, prefix: string) {
        for (const key in objX) {
            if (!(key in objY)) {
                result.left.push(prefix + key);
            } else if (objX[key] !== objY[key]) {
                if (typeof objX[key] !== typeof objY[key]) {
                    result.both.push(prefix + key);
                } else {
                    diff(objX[key], objY[key], prefix + key + ".");
                }
            }
        }

        for (const key in objY) {
            if (!(key in objX)) {
                result.right.push(prefix + key);
            }
        }
    }

}

/**
 * 返回第一个不为空的值。
 * @param objs 要检测的对象。
 * @returns 返回第一个不为空的值。如果都为空则返回 undefined。
 * @example Object.pick(undefined, null, 1) // 1
 */
export function pick() {
    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] != undefined) {
            return arguments[i];
        }
    }
}

// #endregion

// #region 局部处理

/**
 * 返回对象中指定值对应的第一个键。
 * @param obj 要搜索的对象。
 * @param value 要查找的值。
 * @returns 返回匹配的第一个键，如果不存在匹配的值则返回 null。
 * @example Object.keyOf({a:1, b:1}, 1) // "a"
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
 * 获取对象指定键列表的子集。
 * @param obj 要处理的对象。
 * @param keys 要获取的键列表。
 * @returns 返回新对象。
 * @example Object.subset({a: 1, b: 2}, ['a']) // {a: 1}
 */
export function subset<T>(obj: { [key: number]: T } | { [key: string]: T }, keys: string[]) {
    let result: { [key: string]: T } = {};
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] in obj) {
            result[keys[i]] = obj[keys[i]];
        }
    }
    return result;
}

/**
 * 获取对象指定属性的值。
 * @param obj 要获取的对象。
 * @param prop 要获取的属性表达式。如 `a.b[0]`。
 * @returns 返回属性值。如果属性不存在则返回 undefined。
 * @example Object.get({a: {b: 1}}, "a.b") // 1
 */
export function get(obj: any, prop: string) {
    prop.replace(/\.?\s*([^\.\[]+)|\[\s*([^\]]*)\s*\]/g, ((_: string, propName: string, indexer: string) => {
        if (obj) obj = obj[propName || indexer];
    }) as ((substring: string, ...args: any[]) => string));
    return obj;
}

/**
 * 设置对象指定属性的值。
 * @param obj 要设置的对象。
 * @param prop 要设置的属性表达式。如 `a.b[0]`。
 * @param value 要设置的值。
 * @returns 返回 *obj*。
 * @example Object.set({}, "a[1].b", 2) // {a:[undefined, {b: 2}]}
 */
export function set<T>(obj: T, prop: string, value: any) {
    if (obj == null) obj = {} as T;
    let t = obj;
    prop.replace(/\.?\s*([^\.\[]+)|\[\s*([^\]]*)\s*\]/g, ((source: string, propName: string, indexer: string, index: number) => {
        const key = propName || indexer;
        if (index + source.length === prop.length) {
            t[key] = value;
        } else {
            if (t[key] == null) t[key] = propName ? {} : [];
            t = t[key];
        }
    }) as ((substring: string, ...args: any[]) => string));
    return obj;
}

/**
 * 在对象指定键之前插入一个键值对。
 * @param obj 要插入的对象。
 * @param key 新插入的键。
 * @param value 新插入的值。
 * @param refKey 插入的位置。新键值对将插入在指定的键前。如果指定键不存在则插入到末尾。
 * @returns 返回 *obj*。
 * @example Object.insertBefore({a:1}, 'a', 'b', 2) // {b:2, a: 1}
 */
export function insertBefore<T>(obj: T, key: string, value: any, refKey?: string) {
    let tmpObj;
    for (const key in obj) {
        if (key === refKey) tmpObj = {};
        if (tmpObj) {
            tmpObj[key] = obj[key];
            delete obj[key];
        }
    }
    obj[key] = value;
    for (const key in tmpObj) {
        obj[key] = tmpObj[key];
    }
    return obj;
}

// #endregion
