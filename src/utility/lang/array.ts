
declare global {

    interface Array<T> {

        // #region 语言自带

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
         * @param others 要合并的数组。
         * @returns 返回新数组。
         * @example ["I", "love"].concat(["you"]); // ["I", "love", "you"]
         * @since ES4
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
         */
        concat(...others: ArrayLike<T>[]);

        /**
         * 遍历当前数组，并对每一项执行 *callback*。
         * @param callback 对每一项执行的回调函数。
         * - param value 当前项的值。
         * - param index 当前项的索引或键。
         * - param target 当前正在遍历的数组。
         * @param scope 设置 *callback* 执行时 this 的值。
         * @example ["a", "b"].forEach(console.log, console); // 打印 '0  a' 和 '1  b'
         * @since ES5
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
         */
        forEach(callback: (value: T, index: number, target: T[]) => void, scope?: any): void;

        /**
         * 筛选当前数组中符合要求的项并组成一个新数组。
         * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
         * - param value 当前项的值。
         * - param index 当前项的索引或键。
         * - param target 当前正在遍历的数组。
         * - returns 如果当前项符合条件则应该返回 true，否则返回 false。
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
         * - param value 当前项的值。
         * - param index 当前项的索引或键。
         * - param target 当前正在遍历的数组。
         * - returns 返回结果。
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
         * - param value 当前项的值。
         * - param index 当前项的索引或键。
         * - param target 当前正在遍历的数组。
         * - returns 如果当前项符合条件则应该返回 true，否则返回 false。
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
         * - param value 当前项的值。
         * - param index 当前项的索引或键。
         * - param target 当前正在遍历的数组。
         * - returns 如果当前项符合条件则应该返回 true，否则返回 false。
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
         * - param previousValue 要合并的前一项。
         * - param currentValue 要合并的当前项。
         * - param index 当前项的索引或键。
         * - param target 当前正在遍历的数组。
         * - returns 返回合并的结果。
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
         * - param previousValue 要合并的前一项。
         * - param currentValue 要合并的当前项。
         * - param index 当前项的索引或键。
         * - param target 当前正在遍历的数组。
         * - returns 返回合并的结果。
         * @param initialValue 用于合并第一项的初始值。
         * @param scope 设置 *callback* 执行时 this 的值。
         * @returns 返回合并后的最终结果值。
         * @example [1, 2].reduce(function(x, y) {return x + y}) // 3
         * @example [1, 2].reduce(function(x, y) {return x + y}, 10) // 13
         * @since ES5
         * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
         */
        reduceRight<K>(callback: (previousValue: K, currentValue: T, index: number, target: T[]) => K, initialValue?: K);

        // #endregion

    }

    interface ArrayConstructor {

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

    }

}

// #region 语言自带

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

export module forEach {

    /**
     * 遍历当前数组，并对每一项执行 *callback*。
     * @param callback 对每一项执行的回调函数。
     * - param value 当前项的值。
     * - param index 当前项的索引或键。
     * - param target 当前正在遍历的数组。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @example ["a", "b"].forEach(console.log, console); // 打印 '0  a' 和 '1  b'
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
     */
    Array.prototype.forEach = Array.prototype.forEach || function <T>(callback: (value: T, index: number, target: T[]) => void, scope?: any) {
        const length = this.length;
        for (let i = 0; i < length; i++) {
            callback.call(scope, this[i], i, this);
        }
    };

}

export module filter {

    /**
     * 筛选当前数组中符合要求的项并组成一个新数组。
     * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
     * - param value 当前项的值。
     * - param index 当前项的索引或键。
     * - param target 当前正在遍历的数组。
     * - returns 如果当前项符合条件则应该返回 true，否则返回 false。
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
     * - param value 当前项的值。
     * - param index 当前项的索引或键。
     * - param target 当前正在遍历的数组。
     * - returns 返回结果。
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
     * - param value 当前项的值。
     * - param index 当前项的索引或键。
     * - param target 当前正在遍历的数组。
     * - returns 如果当前项符合条件则应该返回 true，否则返回 false。
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
     * - param value 当前项的值。
     * - param index 当前项的索引或键。
     * - param target 当前正在遍历的数组。
     * - returns 如果当前项符合条件则应该返回 true，否则返回 false。
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
     * - param previousValue 要合并的前一项。
     * - param currentValue 要合并的当前项。
     * - param index 当前项的索引或键。
     * - param target 当前正在遍历的数组。
     * - returns 返回合并的结果。
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
        let result = this[0];
        if (initialValue !== undefined) result = callback(initialValue, result, 0, this);
        for (let i = 1; i < length; i++) {
            result = callback(result, this[i], i, this);
        }
        return result;
    };

}

export module reduceRight {

    /**
     * 从右往左依次合并当前数组中的每一项并最终返回一个值。
     * @param callback 对每一项执行的回调函数，每次合并两项为一项。
     * - param previousValue 要合并的前一项。
     * - param currentValue 要合并的当前项。
     * - param index 当前项的索引或键。
     * - param target 当前正在遍历的数组。
     * - returns 返回合并的结果。
     * @param initialValue 用于合并第一项的初始值。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 返回合并后的最终结果值。
     * @example [1, 2].reduce(function(x, y) {return x + y}) // 3
     * @example [1, 2].reduce(function(x, y) {return x + y}, 10) // 13
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
     */
    Array.prototype.reduceRight = Array.prototype.reduceRight || function <T, K>(callback: (previousValue: K, currentValue: T, index: number, target: T[]) => K, initialValue?: K) {
        const end = this.length - 1;
        let result = this[end];
        if (initialValue !== undefined) result = callback(initialValue, result, end, this);
        for (let i = end - 1; i >= 0; i--) {
            result = callback(result, this[i], i, this);
        }
        return result;
    };

}
