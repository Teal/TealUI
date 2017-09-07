import "./promise-shim";

/**
 * 把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。
 * @param target 目标对象。
 * @param sources 任意多个源对象。
 * @example assign({a: 1}, {a: 2}) // {a: 2}
 * @example assign({a: 1}, {b: 2}) // {a: 1, b: 2}
 * @example assign({a: 1}, {b: 2}, {b: 3}, {c: 4}) // {a: 1, b: 3, c: 4}
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
Object.assign = Object.assign || function <T>(target: T, ...sources: any[]) {
    target = Object(target);
    for (let i = 1; i < arguments.length; i++) {
        const source = arguments[i];
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                (target as any)[key] = source[key];
            }
        }
    }
    return target;
};

/**
 * 判断两个对象是否相等。
 * @param x 要比较的第一个对象。
 * @param y 要比较的第二个对象。
 * @return 如果相等则返回 true，否则返回 false。
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
Object.is = Object.is || function (x: number, y: number) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    } else {
        return x !== x && y !== y;
    }
};

/**
 * 把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。
 * @param target 目标对象。
 * @param sources 任意多个源对象。
 * @example assign({a: 1}, {a: 2}) // {a: 2}
 * @example assign({a: 1}, {b: 2}) // {a: 1, b: 2}
 * @example assign({a: 1}, {b: 2}, {b: 3}, {c: 4}) // {a: 1, b: 3, c: 4}
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
 */
Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
};

/**
 * 判断当前字符串是否以某个特定字符串开头。
 * @param str 开头的字符串。
 * @return 返回符合要求则返回 true，否则返回 false。
 * @example startsWith("1234567", "123") // true
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
 */
String.prototype.startsWith = String.prototype.startsWith || function (this: string, value: string) {
    return this.substr(0, value.length) === value;
};

/**
 * 判断当前字符串是否以某个特定字符串结尾。
 * @param value 开头的字符串。
 * @return 返回符合要求则返回 true，否则返回 false。
 * @example endsWith("1234567", "67") // true
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
 */
String.prototype.endsWith = String.prototype.endsWith || function (this: string, value: string) {
    return this.substr(this.length - value.length) === value;
};

/**
 * 重复当前字符串内容指定次数。
 * @return 返回新字符串。
 * @example repeat("a", 4) // "aaaa"
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
 */
String.prototype.repeat = String.prototype.repeat || function (this: string, count: number) {
    return new Array(count + 1).join(this);
};

/**
 * 将一个类数组对象转为原生数组。
 * @param iterable 一个类数组对象。
 * @return 返回新数组，其值和 *iterable* 一一对应。
 * @since ES5
 * @example from([1, 4]) // [1, 4]
 * @example (function() { return Array.from(arguments); })(0, 1, 2) // [0, 1, 2]
 * @example from({length: 1, "0": "value"}) // ["value"]
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 */
Array.from = Array.from || function <T>(iterable: ArrayLike<T>): T[] {
    /*@cc_on  if (!+"\v1") {
         const result: T[] = [];
         for (let i = 0; i < iterable.length; i++) {
             result[i] = iterable[i];
         }
         return result;
     } */
    return Array.prototype.slice.call(iterable);
};

/**
 * 找出当前数组中符合要求的第一项。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - index：当前项的索引或键。
 * - target：当前正在遍历的数组。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @return 返回符合条件的第一项，如果没有满足条件的项，则返回 undefined。
 * @example find([1, 2], function (item) { return item > 1; }) // 2
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 */
Array.prototype.find = Array.prototype.find || function <T>(this: T[], callback: (value: T, index: number, target: T[]) => boolean, scope?: any) {
    for (let i = 0; i < this.length; i++) {
        if ((i in this) && callback.call(scope, this[i], i, this)) {
            return this[i];
        }
    }
};

/**
 * 找出当前数组中符合要求的第一项的索引。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - index：当前项的索引或键。
 * - target：当前正在遍历的数组。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @return 返回符合条件的第一项的索引，如果没有满足条件的项，则返回 -1。
 * @example [1, 2].findIndex(function(item) { return item > 1; }) // 1
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
 */
Array.prototype.findIndex = Array.prototype.findIndex || function <T>(this: T[], callback: (value: T, index: number, target: T[]) => boolean, scope?: any) {
    for (let i = 0; i < this.length; i++) {
        if ((i in this) && callback.call(scope, this[i], i, this)) {
            return i;
        }
    }
    return -1;
};

/**
 * 填充数组每个项为指定的值。
 * @param value 要填充的值。
 * @param startIndex 填充的开始位置。
 * @param endIndex 填充的结束位置(不包含结束位置本身)。
 * @example [1, 2].fill(1)
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
 */
Array.prototype.fill = Array.prototype.fill || function <T>(this: T[], value: T, startIndex = 0, endIndex = this.length) {
    for (; startIndex < endIndex; startIndex++) {
        this[startIndex] = value;
    }
};

/**
 * 判断一个数字是否是整数。
 * @param obj 要判断的数字。
 * @return 如果是整数则返回 true，否则返回 false。
 * @example isInteger(7) // true
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 */
Number.isInteger = Number.isInteger || ((value: number) => {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
});
