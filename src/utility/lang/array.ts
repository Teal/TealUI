/**
 * @fileOverview 数组(Array)扩展
 * @author xuld@vip.qq.com
 * @description 提供 JavaScript 内置对象 Array 的扩展 API。
 * @namespace Array
 */

// #region 语言内置

/**
 * 判断一个对象是否是数组。
 * @param obj 要判断的对象。
 * @returns 如果 *obj* 是数组则返回 true，否则返回 false。
 * @example Array.isArray([]) // true
 * @example Array.isArray(document.getElementsByTagName("div")) // false
 * @example Array.isArray(new Array) // true
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
 */
export function isArray(obj: any): obj is any[] {
    return Object.prototype.toString.call(obj) === "[object Array]";
}

/**
 * 获取指定项在当前数组内的第一个索引。
 * @param value 一个类数组对象。
 * @param startIndex=0 搜索开始的位置。
 * @returns 返回索引。如果找不到则返回 -1。
 * @example ["b", "c", "a", "a"].indexOf("a"); // 2
 * @since ES4
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 */
export function indexOf<T>(_this: Array<T>, value: T, startIndex = 0) {
    for (const length = _this.length; startIndex < length; startIndex++) {
        if (_this[startIndex] === value) {
            return startIndex;
        }
    }
    return -1;
}

/**
 * 获取指定项在当前数组内的最后一个索引。
 * @param value 一个类数组对象。
 * @param startIndex=0 搜索开始的位置。
 * @returns 返回索引。如果找不到则返回 -1。
 * @example ["b", "c", "a", "a"].lastIndexOf("a"); // 3
 * @since ES4
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 */
export function lastIndexOf<T>(_this: Array<T>, value: T, startIndex = 0) {
    for (let i = _this.length - 1; i >= startIndex; i--) {
        if (_this[i] === value) {
            return i;
        }
    }
    return -1;
}

/**
 * 合并当前数组和另一个数组并返回一个新数组。
 * @param values 要合并的数组。
 * @returns 返回新数组。
 * @example ["I", "love"].concat(["you"]); // ["I", "love", "you"]
 * @since ES4
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
 */
export function concat<T>(_this: Array<T>, ...values: (T | ArrayLike<T>)[]) {
    let result = _this.slice(0);
    for (let i = 0; i < arguments.length; i++) {
        result.push.apply(result, arguments[i]);
    }
    return result;
}

/**
 * 遍历当前数组，并对每一项执行 *callback*。
 * @param callback 对每一项执行的回调函数。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的数组。
 * @param scope 设置 *callback* 执行时 _this 的值。
 * @example ["a", "b"].forEach(console.log, console); // 打印 '0  a' 和 '1  b'
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 */
export function forEach<T>(_this: Array<T>, callback: (value: T, index: number, target: T[]) => void, scope?: any) {
    const length = _this.length;
    for (let i = 0; i < length; i++) {
        if (i in _this) {
            callback.call(scope, _this[i], i, _this);
        }
    }
}

/**
 * 筛选当前数组中符合要求的项并组成一个新数组。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的数组。
 * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 _this 的值。
 * @returns 返回一个新数组。
 * @example [1, 2].filter(function(item){return item > 1;}) // [2]
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */
export function filter<T>(_this: Array<T>, callback: (value: T, index: number, target: T[]) => boolean,
    scope?: any) {
    const length = _this.length;
    let result = [];
    for (let i = 0; i < length; i++) {
        if ((i in _this) && callback.call(scope, _this[i], i, _this)) {
            result.push(_this[i]);
        }
    }
    return result;
}

/**
 * 遍历当前数组，并对每一项执行 *callback*，然后返回每个结果组成的新数组或对象。
 * @param callback 对每一项执行的回调函数，用于计算每一项的返回值。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的数组。
 * * returns 返回结果。
 * @param scope 设置 *callback* 执行时 _this 的值。
 * @returns 返回一个新数组。
 * @example [1, 9, 9, 0].map(function(item){return item + 1}); // [2, 10, 10, 1]
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 */
export function map<T>(_this: Array<T>, callback, scope) {
    const length = _this.length;
    let result = [];
    for (let i = 0; i < length; i++) {
        if (i in _this) {
            result[i] = callback.call(scope, _this[i], i, _this);
        }
    }
    return result;
}

/**
 * 判断当前数组是否每一项都满足指定条件。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的数组。
 * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 _this 的值。
 * @returns 如果所有项满足条件则返回 true，否则返回 false。
 * @example [1, 2].every(function(item) {return item > 0}) // true
 * @example [1, 2].every(function(item) {return item > 1}) // false
 * @example [1, 2].every(function(item) {return item > 2}) // false
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every
 */
export function every<T>(_this: Array<T>, callback: (value: T, index: number, target: T[]) => boolean, scope?: any) {
    const length = _this.length;
    for (let i = 0; i < length; i++) {
        if ((i in _this) && callback.call(scope, _this[i], i, _this)) {
            return false;
        }
    }
    return true;
}

/**
 * 判断当前数组是否至少存在一项满足指定条件。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的数组。
 * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 _this 的值。
 * @returns 如果至少存在一项满足条件则返回 true，否则返回 false。
 * @example [1, 2].some(function(item) {return item > 0}) // true
 * @example [1, 2].some(function(item) {return item > 1}) // true
 * @example [1, 2].some(function(item) {return item > 2}) // false
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some
 */
export function some<T>(_this: Array<T>, callback: (value: T, index: number, target: T[]) => boolean, scope?: any) {
    const length = _this.length;
    for (let i = 0; i < length; i++) {
        if ((i in _this) && callback.call(scope, _this[i], i, _this)) {
            return true;
        }
    }
    return false;
}

/**
 * 从左往右依次合并当前数组中的每一项并最终返回一个值。
 * @param callback 对每一项执行的回调函数，每次合并两项为一项。
 * * param previousValue 要合并的前一项。
 * * param currentValue 要合并的当前项。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的数组。
 * * returns 返回合并的结果。
 * @param initialValue 用于合并第一项的初始值。
 * @param scope 设置 *callback* 执行时 _this 的值。
 * @returns 返回合并后的最终结果值。
 * @example [1, 2].reduce(function(x, y) {return x + y}) // 3
 * @example [1, 2].reduce(function(x, y) {return x + y}, 10) // 13
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 */
export function reduce<T, R>(_this: Array<T>, callback: (previousValue: R, currentValue: T, index: number, target: T[]) => R, initialValue?: R) {
    const length = _this.length;
    let result: R;
    for (let i = 0, first = true; i < length; i++) {
        if (i in _this) {
            if (first) {
                first = false;
                result = initialValue === undefined ? _this[i] as any : callback(initialValue, _this[i], i, _this);
            } else {
                result = callback(result, _this[i], i, _this);
            }
        }
    }
    return result;
}

/**
 * 从右往左依次合并当前数组中的每一项并最终返回一个值。
 * @param callback 对每一项执行的回调函数，每次合并两项为一项。
 * * param previousValue 要合并的前一项。
 * * param currentValue 要合并的当前项。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的数组。
 * * returns 返回合并的结果。
 * @param initialValue 用于合并第一项的初始值。
 * @param scope 设置 *callback* 执行时 _this 的值。
 * @returns 返回合并后的最终结果值。
 * @example [1, 2].reduce(function(x, y) {return x + y}) // 3
 * @example [1, 2].reduce(function(x, y) {return x + y}, 10) // 13
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
 */
export function reduceRight<T, R>(_this: Array<T>, callback: (previousValue: R, currentValue: T, index: number, target: T[]) => R, initialValue?: R) {
    let result: R;
    for (let i = _this.length, first = true; --i >= 0;) {
        if (i in _this) {
            if (first) {
                first = false;
                result = initialValue === undefined ? _this[i] as any : callback(initialValue, _this[i], i, _this);
            } else {
                result = callback(result, _this[i], i, _this);
            }
        }
    }
    return result;
}

/**
 * 找出当前数组中符合要求的第一项。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的数组。
 * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 _this 的值。
 * @returns 返回符合条件的第一项，如果没有满足条件的项，则返回 undefined。
 * @example [1, 2].find(function(item){return item > 1;}) // 2
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 */
export function find<T>(_this: Array<T>, callback: (value: T, index: number, target: T[]) => boolean, scope?: any) {
    const length = _this.length;
    for (let i = 0; i < length; i++) {
        if ((i in _this) && callback.call(scope, _this[i], i, _this)) {
            return true;
        }
    }
    return false;
}

/**
 * 找出当前数组中符合要求的第一项的索引。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * * param value 当前项的值。
 * * param index 当前项的索引或键。
 * * param target 当前正在遍历的数组。
 * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 _this 的值。
 * @returns 返回符合条件的第一项的索引，如果没有满足条件的项，则返回 -1。
 * @example [1, 2].findIndex(function(item){return item > 1;}) // 1
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
 */
export function findIndex<T>(_this: Array<T>, callback: (value: T, index: number, target: T[]) => boolean, scope?: any) {
    const length = _this.length;
    for (let i = 0; i < length; i++) {
        if ((i in _this) && callback.call(scope, _this[i], i, _this)) {
            return i;
        }
    }
    return -1;
}

/**
 * 判断当前数组是否包含指定值。
 * @param value 要判断的值。
 * @returns 如果包含则返回 true，否则返回 false。
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
 */
export function includes<T>(_this: Array<T>, value: T) {
    const length = _this.length;
    for (let i = 0; i < length; i++) {
        if (_this[i] === value || (value !== value && _this[i] !== _this[i])) {
            return true;
        }
    }
    return false;
}

/**
 * 填充数组每个项为指定的值。
 * @param value 要填充的值。
 * @param startIndex 填充的开始位置。
 * @param endIndex 填充的结束位置(不包含结束位置本身)。
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
 */
export function fill<T>(_this: Array<T>, value: T, startIndex: number = 0, endIndex: number = _this.length) {
    for (; startIndex < endIndex; startIndex++) {
        _this[startIndex] = value;
    }
}

// #endregion

// #region 更新数组

/**
 * 删除当前数组中匹配的第一个项。
 * @param value 要删除的项。
 * @param startIndex = 0 开始搜索 *value* 的起始位置。
 * @returns 返回被删除的项在原数组中的位置。如果数组中找不到指定的项，则返回 -1。
 * @remark > 注意：一次只删除第一个匹配项。
 * @example [1, 9, 9, 0].remove(9) // 1, 数组变成 [1, 9, 0]
 * @example while(arr.remove("wow") >= 0); // 删除所有 "wow"。
 */
export function remove<T>(_this: Array<T>, value: T, startIndex?: number) {
    startIndex = this.indexOf(value, startIndex);
    ~startIndex && this.splice(startIndex, 1);
    return startIndex;
}

/**
 * 将指定的值插入到当前数组的指定位置。
 * @param index 要插入的位置。索引从 0 开始。如果 *index* 大于数组的长度，则插入到末尾。
 * @param value 要插入的内容。
 * @example ["I", "you"].insert(1, "love"); // ["I", "love", "you"]
 */
export function insert<T>(_this: Array<T>, index: number, value: T) {
    _this.splice(index, 0, value);
}

/**
 * 如果当前数组中不存在项则添加到数组末尾。
 * @param item 元素。
 * @returns 如果已新增则返回 true，否则返回 false。
 * @example [1, 9, 0].pushIf(1) // [1, 9, 0]
 * @example [1, 9, 0].pushIf(2) // [1, 9, 0, 2]
 */
export function pushIf<T>(_this: Array<T>, item: T) {
    return _this.indexOf(item) >= 0 && _this.push(item) > 0;
}

/**
 * 删除数组中值为 false 的值。
 * @returns 返回过滤后的新数组。
 * @example ["", false, 0, undefined, null, {}].clean(); // [{}]
 */
export function clean<T>(_this: Array<T>) {
    let result: T[] = [];
    for (let i = 0; i < _this.length; i++) {
        _this[i] && result.push(_this[i]);
    }
    return result;
}

/**
 * 清空数组所有项。
 * @example [1, 2].clear() // []
 */
export function clear<T>(_this: Array<T>) {
    _this.length = 0;
    return _this;
}

/**
 * 随机打乱数组的内容。
 * @example [1, 2, 3].shuffle()
 */
export function shuffle<T>(_this: Array<T>) {
    for (let i = _this.length; --i >= 0;) {
        const r = Math.floor((i + 1) * Math.random());
        const temp = _this[i];
        _this[i] = _this[r];
        _this[r] = temp;
    }
    return _this;
}

// #endregion

// #region 读取和创建数组

/**
 * 将一个类数组对象转为原生数组。
 * @param iterable 一个类数组对象。
 * @returns 返回新数组，其值和 @iterable 一一对应。
 * @since ES5
 * @example Array.from([1, 4]); // [1, 4]
 * @example (function(){return Array.from(arguments)})(0, 1, 2); // [0, 1, 2]
 * @example Array.from({length: 1, "0": "value"}); // ["value"]
 */
export function from<T>(iterable: ArrayLike<T>): T[] {
    // IE6-8: [DOM Object] 。
    if (!+"\v1") {
        const length = iterable.length;
        let result = [];
        for (let i = 0; i < length; i++) {
            result[i] = iterable[i];
        }
        return result;
    }
    return Array.prototype.slice.call(iterable);
};

/**
 * 创建一个从 0 到指定指定值组成的数组。
 * @param from 开始的数值。
 * @param to 结束的数值(不包含此数值)。
 * @param step 步长，即相邻数字的值。
 * @returns 返回一个新数组。
 * @example Array.range(0, 6) // [0, 1, 2, 3, 4, 5]
 * @example Array.range(2, 11, 3) // [2, 5, 8]
 */
export function range(from: number, to: number, step?: number) {
    step = step || 1;
    let result: number[] = [];
    for (; from < to; from += step) {
        result.push(from);
    }
    return result;
}

/**
 * 获取数组指定索引的项。
 * @param index 要获取的索引。如果值为负数，则获取倒数的项。
 * @returns 返回指定索引的项。
 * @example ['a', 'b'].item(-1) // 'b'
 */
export function item<T>(_this: Array<T>, index: number) {
    return _this[index < 0 ? _this.length + index : index];
}

/**
 * 删除当前数组中的重复项并返回新数组。
 * @returns 返回过滤后的新数组。
 * @example [1, 9, 9, 0].unique() // 返回 [1, 9, 0]
 */
export function unique<T>(_this: Array<T>) {
    let result = [];
    for (let i = 0; i < _this.length; i++) {
        ~result.indexOf(_this[i], i + 1) && result.push(_this[i]);
    }
    return result;
}

/**
 * 判断数组中是否存在重复项。
 * @returns 若数组中存在重复值，则返回 true，否则返回 false。
 * @example [1, 9, 0].isUnique() // true
 * @example [1, 9, 9, 0].isUnique() // false
 */
export function isUnique<T>(_this: Array<T>) {
    for (let i = _this.length - 1; i > 0; i--) {
        if (~_this.indexOf(_this[i - 1], i)) {
            return false;
        }
    }
    return true;
}

/**
 * 将数组中的值和指定的键表组合为对象。
 * @param keys 要匹配的键名。
 * @returns 返回数组和指定键组成的键值对。
 * @example [1, 2].associate(["a", "b"]) // {a: 1, b: 2}
 */
export function associate<T>(_this: Array<T>, keys: string[]) {
    let result = {};
    const length = Math.min(_this.length, keys.length);
    for (let i = 0; i < length; i++) {
        result[keys[i]] = _this[i];
    }
    return result;
}

/**
 * 获取数组中第一个不为空的元素。
 * @returns 返回不为空的元素，如果所有元素都为空则返回 undefined。
 * @example [undefined, null, 1, 2].pick() // 1
 */
export function pick<T>(_this: Array<T>) {
    for (var i = 0, l = _this.length; i < l; i++) {
        if (_this[i] != undefined) {
            return _this[i];
        }
    }
}

/**
 * 从当前数组中删除另一个数组的所有元素，返回剩下的元素组成的新数组。
 * @param array 被除去的元素数组。
 * @returns 返回新数组。
 * @example [1, 2].sub([1]) // [2]
 */
export function sub<T>(_this: Array<T>, array: Array<T>) {
    let result: T[] = [];
    for (let i = _this.length; --i >= 0;) {
        ~array.indexOf(_this[i]) || result.push(_this[i]);
    }
    return result;
}

/**
 * 将多维数组合并为一维数组。
 * @returns 返回新数组。
 * @example [[1, 2], [[[3]]]].flatten() // [1, 2, 3]
 */
export function flatten(_this: Array<any>) {
    let result: any[] = [];
    for (let i = 0; i < _this.length; i++) {
        _this[i] && _this[i] instanceof Array ? result.push.apply(result, flatten(_this[i])) : result.push(_this[i]);
    }
    return result;
}

/**
 * 随机获取数组中的任意一项。
 * @returns 返回找到的项。如果数组为空，则返回 undefined。
 * @example [1, 2, 3].random()
 */
export function random<T>(_this: Array<T>) {
    return _this[Math.floor(_this.length * Math.random())];
}

/**
 * 计算数组的全排列结果。
 * @returns 如果已新增则返回 true，否则返回 false。
 */
export function permute<T>(_this: Array<T>) {
    let result = [];
    let usedItems = [];
    next(_this);
    return result;

    function next(input) {
        for (let i = 0; i < input.length; i++) {
            const item = input.splice(i, 1)[0];
            usedItems.push(item);
            if (input.length == 0) {
                result.push(usedItems.slice());
            }
            next(input);
            input.splice(i, 0, item);
            usedItems.pop();
        }
    }
}

/**
 * 调用数组每一项的成员函数。
 * @param funcName 要调用的函数名。
 * @param args 调用的参数。
 * @returns 返回所有调用结果的返回值。
 * @example ["I", "you"].invoke("length"); // [1, 3]
 */
export function invoke<T>(_this: Array<T>, funcName: string, ...args: any[]) {
    let result = [];
    for (let i = 0; i < _this.length; i++) {
        let item = _this[i][funcName];
        if (typeof item === "function") {
            item = item.apply(_this[i], args);
        }
        result.push(item);
    }
    return result;
}

// #endregion

// #region 数字数组

/**
 * 计算数组中所有数值的最小值。
 * @returns 返回数组中所有项的最小值。
 * @example [1, 2].min() // 1
 */
export function min(_this: Array<number>): number {
    return Math.min.apply(null, _this);
}

/**
 * 计算数组中所有数值的最大值。
 * @returns 返回数组中所有项的最大值。
 * @example [1, 2].max() // 2
 */
export function max(_this: Array<number>): number {
    return Math.max.apply(null, _this);
}

/**
 * 计算数组中所有数值的和。
 * @returns 返回数组中所有数值的和。计算时忽略非数字项。
 * @example [1, 2].sum() // 3
 */
export function sum(_this: Array<number>) {
    let result = 0;
    let i = _this.length;
    while (--i >= 0) {
        result += +_this[i] || 0;
    }
    return result;
}

/**
 * 计算数组中所有数值的算术平均值。
 * @returns 返回数组中所有数值的算术平均值。计算时忽略非数字项。
 * @example [1, 2].avg() // 1.5
 */
export function avg(_this: Array<number>): number {
    let sum = 0;
    let c = 0;
    let i = _this.length;
    while (--i >= 0) {
        if (_this[i] === 0 || +_this[i]) {
            sum += +_this[i];
            c++;
        }
    }
    return c ? sum / c : 0;
}

// #endregion
