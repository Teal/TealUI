/**
 * @fileOverview 对象(Object)扩展
 * @description 提供 JavaScript 内置对象 Array 的扩展 API。
 */

declare global {

    interface ArrayConstructor {

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
        isArray(obj: any): obj is any[];

        // #endregion

    }

    interface Array<T> {

        // #region 语言内置

        /**
         * 获取指定项在当前数组内的第一个索引。
         * @param value 一个类数组对象。
         * @param startIndex=0 搜索开始的位置。
         * @returns 返回索引。如果找不到则返回 -1。
         * @example ["b", "c", "a", "a"].indexOf("a"); // 2
         * @since ES4
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
         */
        indexOf(value: T, startIndex?: number): number;

        /**
         * 获取指定项在当前数组内的最后一个索引。
         * @param value 一个类数组对象。
         * @param startIndex=0 搜索开始的位置。
         * @returns 返回索引。如果找不到则返回 -1。
         * @example ["b", "c", "a", "a"].lastIndexOf("a"); // 3
         * @since ES4
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
         */
        lastIndexOf(value: T, startIndex?: number): number;

        /**
         * 合并当前数组和另一个数组并返回一个新数组。
         * @param values 要合并的数组。
         * @returns 返回新数组。
         * @example ["I", "love"].concat(["you"]); // ["I", "love", "you"]
         * @since ES4
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
         */
        concat(...values: (T | ArrayLike<T>)[]);

        /**
         * 遍历当前数组，并对每一项执行 *callback*。
         * @param callback 对每一项执行的回调函数。
         * * param value 当前项的值。
         * * param index 当前项的索引或键。
         * * param target 当前正在遍历的数组。
         * @param scope 设置 *callback* 执行时 this 的值。
         * @example ["a", "b"].forEach(console.log, console); // 打印 '0  a' 和 '1  b'
         * @since ES5
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
         */
        forEach(callback: (value: T, index: number, target: T[]) => void, scope?: any): void;

        /**
         * 筛选当前数组中符合要求的项并组成一个新数组。
         * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
         * * param value 当前项的值。
         * * param index 当前项的索引或键。
         * * param target 当前正在遍历的数组。
         * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
         * @param scope 设置 *callback* 执行时 this 的值。
         * @returns 返回一个新数组。
         * @example [1, 2].filter(function(item){return item > 1;}) // [2]
         * @since ES5
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
         */
        filter(callback: (value: T, index: number, target: T[]) => boolean, scope?: any): T[];

        /**
         * 遍历当前数组，并对每一项执行 *callback*，然后返回每个结果组成的新数组或对象。
         * @param callback 对每一项执行的回调函数，用于计算每一项的返回值。
         * * param value 当前项的值。
         * * param index 当前项的索引或键。
         * * param target 当前正在遍历的数组。
         * * returns 返回结果。
         * @param scope 设置 *callback* 执行时 this 的值。
         * @returns 返回一个新数组。
         * @example [1, 9, 9, 0].map(function(item){return item + 1}); // [2, 10, 10, 1]
         * @since ES5
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map
         */
        map<K>(callback: (value: T, index: number, target: T[]) => K, scope?: any): K[];

        /**
         * 判断当前数组是否每一项都满足指定条件。
         * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
         * * param value 当前项的值。
         * * param index 当前项的索引或键。
         * * param target 当前正在遍历的数组。
         * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
         * @param scope 设置 *callback* 执行时 this 的值。
         * @returns 如果所有项满足条件则返回 true，否则返回 false。
         * @example [1, 2].every(function(item) {return item > 0}) // true
         * @example [1, 2].every(function(item) {return item > 1}) // false
         * @example [1, 2].every(function(item) {return item > 2}) // false
         * @since ES5
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every
         */
        every(callback: (value: T, index: number, target: T[]) => boolean, scope?: any): boolean;

        /**
         * 判断当前数组是否至少存在一项满足指定条件。
         * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
         * * param value 当前项的值。
         * * param index 当前项的索引或键。
         * * param target 当前正在遍历的数组。
         * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
         * @param scope 设置 *callback* 执行时 this 的值。
         * @returns 如果至少存在一项满足条件则返回 true，否则返回 false。
         * @example [1, 2].some(function(item) {return item > 0}) // true
         * @example [1, 2].some(function(item) {return item > 1}) // true
         * @example [1, 2].some(function(item) {return item > 2}) // false
         * @since ES5
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some
         */
        some(callback: (value: T, index: number, target: T[]) => boolean, scope?: any): boolean;

        /**
         * 从左往右依次合并当前数组中的每一项并最终返回一个值。
         * @param callback 对每一项执行的回调函数，每次合并两项为一项。
         * * param previousValue 要合并的前一项。
         * * param currentValue 要合并的当前项。
         * * param index 当前项的索引或键。
         * * param target 当前正在遍历的数组。
         * * returns 返回合并的结果。
         * @param initialValue 用于合并第一项的初始值。
         * @param scope 设置 *callback* 执行时 this 的值。
         * @returns 返回合并后的最终结果值。
         * @example [1, 2].reduce(function(x, y) {return x + y}) // 3
         * @example [1, 2].reduce(function(x, y) {return x + y}, 10) // 13
         * @since ES5
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
         */
        reduce<K>(callback: (previousValue: K, currentValue: T, index: number, target: T[]) => K, initialValue?: K);

        /**
         * 从右往左依次合并当前数组中的每一项并最终返回一个值。
         * @param callback 对每一项执行的回调函数，每次合并两项为一项。
         * * param previousValue 要合并的前一项。
         * * param currentValue 要合并的当前项。
         * * param index 当前项的索引或键。
         * * param target 当前正在遍历的数组。
         * * returns 返回合并的结果。
         * @param initialValue 用于合并第一项的初始值。
         * @param scope 设置 *callback* 执行时 this 的值。
         * @returns 返回合并后的最终结果值。
         * @example [1, 2].reduce(function(x, y) {return x + y}) // 3
         * @example [1, 2].reduce(function(x, y) {return x + y}, 10) // 13
         * @since ES5
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
         */
        reduceRight<K>(callback: (previousValue: K, currentValue: T, index: number, target: T[]) => K, initialValue?: K);

        /**
         * 找出当前数组中符合要求的第一项。
         * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
         * * param value 当前项的值。
         * * param index 当前项的索引或键。
         * * param target 当前正在遍历的数组。
         * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
         * @param scope 设置 *callback* 执行时 this 的值。
         * @returns 返回符合条件的第一项，如果没有满足条件的项，则返回 undefined。
         * @example [1, 2].find(function(item){return item > 1;}) // 2
         * @since ES5
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find
         */
        find(callback: (value: T, index: number, target: T[]) => boolean, scope?: any): T;

        /**
         * 找出当前数组中符合要求的第一项的索引。
         * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
         * * param value 当前项的值。
         * * param index 当前项的索引或键。
         * * param target 当前正在遍历的数组。
         * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
         * @param scope 设置 *callback* 执行时 this 的值。
         * @returns 返回符合条件的第一项的索引，如果没有满足条件的项，则返回 -1。
         * @example [1, 2].findIndex(function(item){return item > 1;}) // 1
         * @since ES5
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
         */
        findIndex(callback: (value: T, index: number, target: T[]) => boolean, scope?: any): number;

        /**
         * 判断当前数组是否包含指定值。
         * @param value 要判断的值。
         * @returns 如果包含则返回 true，否则返回 false。
         * @since ES7
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
         */
        includes(value: T): boolean;

        /**
         * 填充数组每个项为指定的值。
         * @param value 要填充的值。
         * @param startIndex 填充的开始位置。
         * @param endIndex 填充的结束位置(不包含结束位置本身)。
         * @since ES7
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
         */
        fill(value: T, startIndex?: number, endIndex?: number): void;

        // #endregion

    }

}

// #region 语言内置

export module isArray {

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
    Array.isArray = Array.isArray || function (obj: any): obj is any[] {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };

}

export module indexOf {

    /*@cc_on 
    Array.prototype.indexOf = Array.prototype.indexOf || function (value, startIndex) {
        startIndex = startIndex || 0;
        for (var len = this.length; startIndex < len; startIndex++) {
            if (this[startIndex] === value) {
                return startIndex;
            }
        }
        return -1;
    };
    @*/

}

export module lastIndexOf {

    /*@cc_on
    Array.prototype.lastIndexOf = Array.prototype.lastIndexOf || function (value, startIndex) {
        startIndex = startIndex || 0;
        for (var i = this.length - 1; i >= startIndex; i--) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    };
    @*/

}

export module concat {

    /*@cc_on
    Array.prototype.concat = Array.prototype.concat || function () {
        var result = this.slice(0);
        for(var i = 0; i < arguments.length; i++) {
            result.push.apply(result, arguments[i]);
        }
        return result;
    };
    @*/

}

export module forEach {

    /**
     * 遍历当前数组，并对每一项执行 *callback*。
     * @param callback 对每一项执行的回调函数。
     * * param value 当前项的值。
     * * param index 当前项的索引或键。
     * * param target 当前正在遍历的数组。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @example ["a", "b"].forEach(console.log, console); // 打印 '0  a' 和 '1  b'
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
     */
    Array.prototype.forEach = Array.prototype.forEach || function <T>(callback: (value: T, index: number, target: T[]) => void, scope?: any) {
        const length = this.length;
        for (let i = 0; i < length; i++) {
            if (i in this) {
                callback.call(scope, this[i], i, this);
            }
        }
    };

}

export module filter {

    /**
     * 筛选当前数组中符合要求的项并组成一个新数组。
     * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
     * * param value 当前项的值。
     * * param index 当前项的索引或键。
     * * param target 当前正在遍历的数组。
     * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 返回一个新数组。
     * @example [1, 2].filter(function(item){return item > 1;}) // [2]
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
     */
    Array.prototype.filter = Array.prototype.filter || function (callback: (value: any, index: number, target: any[]) => boolean,
        scope?: any) {
        const length = this.length;
        let result = [];
        for (let i = 0; i < length; i++) {
            if ((i in this) && callback.call(scope, this[i], i, this)) {
                result.push(this[i]);
            }
        }
        return result;
    };

}

export module map {

    /**
     * 遍历当前数组，并对每一项执行 *callback*，然后返回每个结果组成的新数组或对象。
     * @param callback 对每一项执行的回调函数，用于计算每一项的返回值。
     * * param value 当前项的值。
     * * param index 当前项的索引或键。
     * * param target 当前正在遍历的数组。
     * * returns 返回结果。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 返回一个新数组。
     * @example [1, 9, 9, 0].map(function(item){return item + 1}); // [2, 10, 10, 1]
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map
     */
    Array.prototype.map = Array.prototype.map || function (callback, scope) {
        const length = this.length;
        let result = [];
        for (let i = 0; i < length; i++) {
            if (i in this) {
                result[i] = callback.call(scope, this[i], i, this);
            }
        }
        return result;
    };

}

export module every {

    /**
     * 判断当前数组是否每一项都满足指定条件。
     * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
     * * param value 当前项的值。
     * * param index 当前项的索引或键。
     * * param target 当前正在遍历的数组。
     * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 如果所有项满足条件则返回 true，否则返回 false。
     * @example [1, 2].every(function(item) {return item > 0}) // true
     * @example [1, 2].every(function(item) {return item > 1}) // false
     * @example [1, 2].every(function(item) {return item > 2}) // false
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every
     */
    Array.prototype.every = Array.prototype.every || function <T>(callback: (value: T, index: number, target: T[]) => boolean, scope?: any) {
        const length = this.length;
        for (let i = 0; i < length; i++) {
            if ((i in this) && callback.call(scope, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };

}

export module some {

    /**
     * 判断当前数组是否至少存在一项满足指定条件。
     * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
     * * param value 当前项的值。
     * * param index 当前项的索引或键。
     * * param target 当前正在遍历的数组。
     * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 如果至少存在一项满足条件则返回 true，否则返回 false。
     * @example [1, 2].some(function(item) {return item > 0}) // true
     * @example [1, 2].some(function(item) {return item > 1}) // true
     * @example [1, 2].some(function(item) {return item > 2}) // false
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     */
    Array.prototype.some = Array.prototype.some || function <T>(callback: (value: T, index: number, target: T[]) => boolean, scope?: any) {
        const length = this.length;
        for (let i = 0; i < length; i++) {
            if ((i in this) && callback.call(scope, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };

}

export module reduce {

    /**
     * 从左往右依次合并当前数组中的每一项并最终返回一个值。
     * @param callback 对每一项执行的回调函数，每次合并两项为一项。
     * * param previousValue 要合并的前一项。
     * * param currentValue 要合并的当前项。
     * * param index 当前项的索引或键。
     * * param target 当前正在遍历的数组。
     * * returns 返回合并的结果。
     * @param initialValue 用于合并第一项的初始值。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 返回合并后的最终结果值。
     * @example [1, 2].reduce(function(x, y) {return x + y}) // 3
     * @example [1, 2].reduce(function(x, y) {return x + y}, 10) // 13
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
     */
    Array.prototype.reduce = Array.prototype.reduce || function <T, K>(callback: (previousValue: K, currentValue: T, index: number, target: T[]) => K, initialValue?: K) {
        const length = this.length;
        let result;
        for (let i = 0, first = true; i < length; i++) {
            if (i in this) {
                if (first) {
                    first = false;
                    result = initialValue === undefined ? this[i] : callback(initialValue, this[i], i, this);
                } else {
                    result = callback(result, this[i], i, this);
                }
            }
        }
        return result;
    };

}

export module reduceRight {

    /**
     * 从右往左依次合并当前数组中的每一项并最终返回一个值。
     * @param callback 对每一项执行的回调函数，每次合并两项为一项。
     * * param previousValue 要合并的前一项。
     * * param currentValue 要合并的当前项。
     * * param index 当前项的索引或键。
     * * param target 当前正在遍历的数组。
     * * returns 返回合并的结果。
     * @param initialValue 用于合并第一项的初始值。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 返回合并后的最终结果值。
     * @example [1, 2].reduce(function(x, y) {return x + y}) // 3
     * @example [1, 2].reduce(function(x, y) {return x + y}, 10) // 13
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
     */
    Array.prototype.reduceRight = Array.prototype.reduceRight || function <T, K>(callback: (previousValue: K, currentValue: T, index: number, target: T[]) => K, initialValue?: K) {
        let result;
        for (let i = this.length, first = true; --i >= 0;) {
            if (i in this) {
                if (first) {
                    first = false;
                    result = initialValue === undefined ? this[i] : callback(initialValue, this[i], i, this);
                } else {
                    result = callback(result, this[i], i, this);
                }
            }
        }
        return result;
    };

}

export module find {

    /**
     * 找出当前数组中符合要求的第一项。
     * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
     * * param value 当前项的值。
     * * param index 当前项的索引或键。
     * * param target 当前正在遍历的数组。
     * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 返回符合条件的第一项，如果没有满足条件的项，则返回 undefined。
     * @example [1, 2].find(function(item){return item > 1;}) // 2
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find
     */
    Array.prototype.find = Array.prototype.find || function <T>(callback: (value: T, index: number, target: T[]) => boolean, scope?: any) {
        const length = this.length;
        for (let i = 0; i < length; i++) {
            if ((i in this) && callback.call(scope, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };

}

export module findIndex {

    /**
     * 找出当前数组中符合要求的第一项的索引。
     * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
     * * param value 当前项的值。
     * * param index 当前项的索引或键。
     * * param target 当前正在遍历的数组。
     * * returns 如果当前项符合条件则应该返回 true，否则返回 false。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 返回符合条件的第一项的索引，如果没有满足条件的项，则返回 -1。
     * @example [1, 2].findIndex(function(item){return item > 1;}) // 1
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
     */
    Array.prototype.findIndex = Array.prototype.findIndex || function <T>(callback: (value: T, index: number, target: T[]) => boolean, scope?: any) {
        const length = this.length;
        for (let i = 0; i < length; i++) {
            if ((i in this) && callback.call(scope, this[i], i, this)) {
                return i;
            }
        }
        return -1;
    };

}

export module includes {

    /**
     * 判断当前数组是否包含指定值。
     * @param value 要判断的值。
     * @returns 如果包含则返回 true，否则返回 false。
     * @since ES7
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
     */
    Array.prototype.includes = Array.prototype.includes || function <T>(value: T) {
        const length = this.length;
        for (let i = 0; i < length; i++) {
            if (this[i] === value || (value !== value && this[i] !== this[i])) {
                return true;
            }
        }
        return false;
    };

}

export module fill {

    /**
     * 填充数组每个项为指定的值。
     * @param value 要填充的值。
     * @param startIndex 填充的开始位置。
     * @param endIndex 填充的结束位置(不包含结束位置本身)。
     * @since ES7
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
     */
    Array.prototype.fill = Array.prototype.fill || function <T>(value: T, startIndex: number = 0, endIndex: number = this.length) {
        for (; startIndex < endIndex; startIndex++) {
            this[startIndex] = value;
        }
    };

}

// #endregion


/**
 * @fileOverview 数组扩展。
 * @author xuld@vip.qq.com
 */

export module parseArray {

    /**
     * 将一个类数组对象转为原生数组。
     * @param {Object} iterable 一个类数组对象。
     * @param {Number} [startIndex=0] 转换开始的位置。
     * @returns {Array} 返回新数组，其值和 @iterable 一一对应。
     * @example
     * // 将 arguments 对象转为数组。
     * (function(){return Array.parseArray(arguments)})(); // 返回一个数组
     *
     * // 获取数组的子集。
     * Array.parseArray([4,6], 1); // [6]
     *
     * // 处理伪数组。
     * Array.parseArray({length: 1, "0": "value"}); // ["value"]
     */
    Array.parseArray = function (iterable, startIndex) {
        if (!iterable) return [];

        // IE6-8: [DOM Object] 。
        /*@cc_on if(!+"\v1") {
        var result = [], length = iterable.length;
        for (startIndex = startIndex || 0; startIndex < length; startIndex++) {
            result.push(iterable[startIndex]);
        }
        return result;
        } @*/

        return Array.prototype.slice.call(iterable, startIndex);
    };

}

// #region Array.range

/**
 * 创建一个从 0 到指定指定值组成的数组。
 * @param {Number} [start=0] 开始的数值。
 * @param {Number} stop 结束的数值。
 * @param {Number} [step=1] 步长，即相邻数字的值。
 * @returns {Array} 返回一个新数组。
 * @example 
 * Array.range(6) // [0, 1, 2, 3, 4, 5]
 * 
 * Array.range(2, 11, 3) // [2, 5, 8]
 */
Array.range = function (start, stop, step) {
    if (arguments.length <= 1) {
        stop = start || 0;
        start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var result = Array(length);

    for (var i = 0; i < length; i++ , start += step) {
        result[i] = start;
    }

    return result;
};

}

export module map {

    /**
     * 对当前数组每一项进行处理，并将结果组成一个新数组。
     * @param {Function} fn 用于处理每一项的函数。函数的参数依次为:
     *
     * * @param {Object} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Array} array 当前正在遍历的数组。
     * * @returns {Object} 返回处理后的新值，这些新值将组成结构数组。
     * 
     * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
     * @returns {Object} 返回一个新数组或对象。
     * @example [1, 9, 9, 0].map(function(item){return item + 1}); // [2, 10, 10, 1]
     * @since ES5
     */
    Array.prototype.map = Array.prototype.map || function (fn, scope) {
        typeof console === "object" && console.assert(fn instanceof Function, "array.map(fn: 必须是函数, [scope])");
        var result = [];
        for (var i = 0, length = this.length; i < length; i++) {
            if (i in this) {
                result[i] = fn.call(scope, this[i], i, this);
            }
        }
        return result;
    };

}

export module every {

    /**
     * 判断当前数组是否每一项都满足指定条件。
     * @param {Function} fn 用于判断每一项是否满足条件的回调。函数的参数依次为:
     * 
     * * @param {Object} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Array} array 当前正在遍历的数组。
     * * @returns {Boolean} 返回 @true 说明当前元素符合条件，否则不符合。
     * 
     * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
     * @returns {Boolean} 如果全部满足条件返回 @true，否则返回 @false。
     * @example [1, 9, 9, 0].every(function(item){return item > 5}); // false
     * @since ES5
     */
    Array.prototype.every = Array.prototype.every || function (fn, scope) {
        typeof console === "object" && console.assert(fn instanceof Function, "array.every(fn: 必须是函数, [scope])");
        for (var i = 0, length = this.length; i < length; i++) {
            if ((i in this) && fn.call(scope, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };

}

export module some {

    /**
     * 判断当前数组是否至少存在一项满足指定条件。
     * @param {Function} fn 用于判断每一项是否满足条件的回调。函数的参数依次为:
     * 
     * * @param {Object} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Array} array 当前正在遍历的数组。
     * * @returns {Boolean} 返回 @true 说明当前元素符合条件，否则不符合。
     * 
     * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
     * @returns {Boolean} 如果至少存在一项满足条件返回 @true，否则返回 @false。
     * @example [1, 9, 9, 0].some(function(item){return item > 5}); // true
     * @since ES5
     */
    Array.prototype.some = Array.prototype.some || function (fn, scope) {
        typeof console === "object" && console.assert(fn instanceof Function, "array.some(fn: 必须是函数, [scope])");
        for (var i = 0, length = this.length; i < length; i++) {
            if ((i in this) && fn.call(scope, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };

}

export module concat {

    /**
     * 合并当前数组和另一个数组并返回一个新数组。
     * @param {Array} array 要合并的数组。
     * @returns {Array} 返回新数组。
     * @example ["I", "love"].concat(["you"]); // ["I", "love", "you"]
     * @since ES4
     */
    Array.prototype.concat = Array.prototype.concat || function (array) {
        var result = this.slice(0);
        result.push.apply(result, array);
        return result;
    };

}

export module insert {

    /**
     * 将指定的值插入到当前数组的指定位置。
     * @param {Number} index 要插入的位置。索引从 0 开始。如果 *index* 大于数组的长度，则插入到末尾。
     * @param {Object} value 要插入的内容。
     * @returns {Object} 返回 *value*。
     * @example ["I", "you"].insert(1, "love"); // ["I", "love", "you"]
     */
    Array.prototype.insert = function (index, value) {
        this.splice(index, 0, value);
        return value;
    };

}

export module invoke {

    /**
     * 调用数组每一项的成员函数。
     * @param {Number} funcName 要调用的函数名。
     * @param {Object} ... 调用的参数。
     * @returns {Array} 返回所有调用结果的返回值。
     * @example ["I", "you"].invoke("length"); // [1, 3]
     */
    Array.prototype.invoke = function (funcName) {
        var result = [],
            args = Array.parseArray ? Array.parseArray(arguments, 1) : Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < this.length; i++) {
            var item = this[i][funcName];
            if (item && item.constructor === Function) {
                item = item.apply(this[i], args);
            }
            result.push(item);
        }
        return result;
    };

}

export module item {

    /**
     * 获取数组指定索引的项。
     * @param {Number} index 要获取的索引。如果值为负数，则获取倒数的项。
     * @returns {Object} 返回指定索引的项。
     * @example ['a', 'b'].item(-1) // 'b'
     */
    Array.prototype.item = function (index) {
        return this[index < 0 ? this.length + index : index];
    };

}

export module clean {

    /**
     * 删除数组中值为 @false 的值。
     * @returns {Array} 返回过滤后的新数组。
     * @example ["", false, 0, undefined, null, {}].clean(); // [{}]
     */
    Array.prototype.clean = function () {
        return this.filter(function (obj) {
            return !obj
        });
    };

}

export module min/Array#max
{

    /**
     * 计算数组中所有项的最小值。
     * @returns {Number} 返回数组中所有项的最小值。
     * @example [1, 2].min() // 1
     */
    Array.prototype.min = function () {
        return Math.min.apply(null, this);
    };

    /**
     * 计算数组中所有项的最大值。
     * @returns {Number} 返回数组中所有项的最大值。
     * @example [1, 2].max() // 2
     */
    Array.prototype.max = function () {
        return Math.max.apply(null, this);
    };

}

export module sum {

    /**
     * 计算数组中所有数值的和。
     * @returns {Number} 返回数组中所有数值的和。
     * @example [1, 2].sum() // 3
     */
    Array.prototype.sum = function () {
        var result = 0, i = this.length;
        while (--i >= 0) {
            result += +this[i] || 0;
        }
        return result;
    };

}

export module avg {

    /**
     * 计算数组中所有数值的算术平均值。
     * @returns {Number} 返回数组中所有数值的算术平均值。
     * @example [1, 2].avg() // 1.5
     */
    Array.prototype.avg = function () {
        var result = 0, i = this.length, c = 0;
        while (--i >= 0) {
            if (this[i] === 0 || +this[i]) {
                result += +this[i];
                c++;
            }
        }
        return c ? result / c : 0;
    };

}

export module associate {

    /**
     * 将数组中的值和指定的键表组合为对象。
     * @param {Array} keys 要匹配的键名。
     * @returns {Object} 返回数组和指定键组成的键值对。
     * @example [1, 2].associate(["a", "b"]) // {a: 1, b: 2}
     */
    Array.prototype.associate = function (keys) {
        typeof console === "object" && console.assert(keys && typeof keys.length === "number", "array.associate(keys: 必须是数组)");
        var result = {};
        for (var i = 0, length = Math.min(this.length, keys.length); i < length; i++) {
            result[keys[i]] = this[i];
        }
        return result;
    };

}

export module clear {

    /**
     * 清空数组所有项。
     * @returns this
     * @example [1, 2].clear() // []
     */
    Array.prototype.clear = function () {
        this.length = 0;
        return this;
    };

}

export module pick {

    /**
     * 获取数组中第一个不为空的元素。
     * @returns {Object} 返回不为空的元素，如果所有元素都为空则返回 @undefined。
     * @example [undefined, null, 1, 2].pick() // 1
     */
    Array.prototype.pick = function () {
        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] != undefined) {
                return this[i];
            }
        }
    };

}

export module random {

    /**
     * 随机获取数组中的任意一项。
     * @returns {Object} 返回找到的项。如果数组为空，则返回 @undefined。
     * @example [1, 2, 3].random()
     */
    Array.prototype.random = function () {
        return this[Math.floor(this.length * Math.random())];
    };

}

export module shuffle {

    /**
     * 随机打乱数组的内容。
     * @returns this
     * @example [1, 2, 3].shuffle()
     */
    Array.prototype.shuffle = function () {
        for (var i = this.length; --i >= 0;) {
            var r = Math.floor((i + 1) * Math.random());
            var temp = this[i];
            this[i] = this[r];
            this[r] = temp;
        }
        return this;
    };

}

export module flatten {

    /**
     * 将多维数组合并为一维数组。
     * @returns {Array} 返回新数组。
     * @example [[1, 2], [[[3]]]].flatten() // [1, 2, 3]
     */
    Array.prototype.flatten = function () {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            this[i] && this[i].flatten ? result.push.apply(result, this[i].flatten()) : result.push(this[i]);
        }
        return result;
    };

}

export module isUnique {

    /**
     * 判断数组中是否存在重复项。
     * @returns {Boolean} 若数组中存在重复值，则返回 @true，否则返回 @false。
     * @example 
     * [1, 9, 0].isUnique() // true
     * 
     * [1, 9, 9, 0].isUnique() // false
     */
    Array.prototype.isUnique = function () {
        for (var i = 0; i < this.length - 1; i++) {
            if (~this.indexOf(this[i], i + 1)) {
                return false;
            }
        }
        return true;
    };

}

export module sub {

    /**
     * 从当前数组中删除另一个数组的所有元素，返回剩下的元素组成的新数组。
     * @param {Array} array 被除去的元素数组。
     * @returns {Array} 返回新数组。
     * @example [1, 2].sub([1]) // [2]
     */
    Array.prototype.sub = function (array) {
        typeof console === "object" && console.assert(array && array.indexOf, "array.sub(array: 必须是数组)");
        var result = this.slice(0), i;
        for (i = result.length - 1; i >= 0; i--) {
            if (array.indexOf(result[i]) < 0) {
                result.splice(i, 1);
            }
        }
        return result;
    };

}

export module pushIf {

    /**
     * 如果当前数组中不存在项则添加到数组末尾。
     * @param {Array} item 元素。
     * @returns {Boolean} 如果已新增则返回 @true，否则返回 @false。
     * @example 
     * [1, 9, 0].pushIf(1) // [1, 9, 0]
     * 
     * [1, 9, 0].pushIf(2) // [1, 9, 0, 2]
     */
    Array.prototype.pushIf = function (item) {
        return this.indexOf(item) < 0 ? this.push(item) > 0 : false;
    };

}


/**
 * 计算数组的全排列结果。
 * @returns {Array} 如果已新增则返回 @true，否则返回 @false。
 */
Array.prototype.permute = function () {
    var result = [],
        usedChars = [];
    function next(input) {
        for (var i = 0; i < input.length; i++) {
            var ch = input.splice(i, 1)[0];
            usedChars.push(ch);
            if (input.length == 0) {
                result.push(usedChars.slice());
            }
            next(input);
            input.splice(i, 0, ch);
            usedChars.pop();
        }
    }
    return next(this);
};
