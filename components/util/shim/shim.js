define(["require", "exports", "./promise-shim"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。
     * @param target 目标对象。
     * @param sources 所有源对象。
     * @example assign({a: 1}, {a: 2}) // {a: 2}
     * @example assign({a: 1}, {b: 2}) // {a: 1, b: 2}
     * @example assign({a: 1}, {b: 2}, {b: 3}, {c: 4}) // {a: 1, b: 3, c: 4}
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
     */
    Object.assign = Object.assign || function (target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        target = Object(target);
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    /**
     * 将一个数组转为原生数组。
     * @param obj 数组。
     * @return 返回一个新数组。
     * @example from([1, 4]) // [1, 4]
     * @example (function() { return Array.from(arguments); })(0, 1, 2) // [0, 1, 2]
     * @example from({length: 1, "0": "value"}) // ["value"]
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from
     */
    Array.from = Array.from || function (obj) {
        /*@cc_on  if (!+"\v1") {
             const r: T[] = [];
             for (let i = 0; i < iterable.length; i++) {
                 r[i] = iterable[i];
             }
             return r;
         } */
        return Array.prototype.slice.call(obj);
    };
    /**
     * 找出数组中符合条件的第一项。
     * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
     * - value：当前项的值。
     * - index：当前项的索引。
     * - target：数组本身。
     *
     * 如果当前项符合条件应返回 true，否则返回 false。
     * @param thisArg 执行回调函数时 this 的值。
     * @return 返回符合条件的第一项，如果找不到则返回 undefined。
     * @example find([1, 2], function (item) { return item > 1; }) // 2
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find
     */
    Array.prototype.find = Array.prototype.find || function (callback, thisArg) {
        for (var i = 0; i < this.length; i++) {
            if ((i in this) && callback.call(thisArg, this[i], i, this)) {
                return this[i];
            }
        }
    };
    /**
     * 找出数组中符合条件的第一项的索引。
     * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
     * - value：当前项的值。
     * - index：当前项的索引。
     * - target：数组本身。
     *
     * 如果当前项符合条件应返回 true，否则返回 false。
     * @param thisArg 执行回调函数时 this 的值。
     * @return 返回符合条件的第一项的索引，如果找不到则返回 -1。
     * @example [1, 2].findIndex(function(item) { return item > 1; }) // 1
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
     */
    Array.prototype.findIndex = Array.prototype.findIndex || function (callback, thisArg) {
        for (var i = 0; i < this.length; i++) {
            if ((i in this) && callback.call(thisArg, this[i], i, this)) {
                return i;
            }
        }
        return -1;
    };
    /**
     * 判断字符串是否以指定子字符串开头。
     * @param value 子字符串。
     * @return 如果字符串以指定子字符串开头则返回 true，否则返回 false。
     * @example startsWith("1234567", "123") // true
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
     */
    String.prototype.startsWith = String.prototype.startsWith || function (value) {
        return this.substr(0, value.length) === value;
    };
    /**
     * 判断字符串是否以指定子字符串结尾。
     * @param value 字符串。
     * @return 如果字符串以指定子字符串结尾则返回 true，否则返回 false。
     * @example endsWith("1234567", "67") // true
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
     */
    String.prototype.endsWith = String.prototype.endsWith || function (value) {
        return this.substr(this.length - value.length) === value;
    };
    /**
     * 重复拼接当前字符串内容指定次数。
     * @param count 重复的次数。
     * @return 返回新字符串。
     * @example repeat("a", 4) // "aaaa"
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
     */
    String.prototype.repeat = String.prototype.repeat || function (count) {
        return new Array(count + 1).join(this);
    };
});
//# sourceMappingURL=shim.js.map