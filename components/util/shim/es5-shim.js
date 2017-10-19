define(["require", "exports", "./json-shim"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 创建一个拥有指定原型和若干个属性的对象。
     * @param proto 原型对象。
     * @param properties 包含的属性。
     * @return 返回创建的对象。
     * @example Object.create({a: 3, b: 5}) // {a: 3, b: 5}
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
     */
    Object.create = Object.create || function (proto, properties) {
        function Temp() { }
        Temp.prototype = proto;
        var r = new Temp();
        for (var key in properties) {
            Object.defineProperty(r, key, properties[key]);
        }
        return r;
    };
    /**
     * 定义或修改对象的属性。
     * @param obj 对象。
     * @param prop 要定义或修改的属性名。
     * @param descriptor 要定义或修改的属性描述符。
     * @return 返回原对象。
     * @example Object.defineProperty({}, "prop", {value: 1})
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
     */
    Object.defineProperty = Object.defineProperty || function (obj, prop, descriptor) {
        if (descriptor.get) {
            obj.__defineGetter__(prop, descriptor.get);
        }
        if (descriptor.set) {
            obj.__defineSetter__(prop, descriptor.set);
        }
        if ("value" in descriptor) {
            obj[prop] = descriptor.value;
        }
    };
    /**
     * 定义或修改对象的多个属性。
     * @param obj 对象。
     * @param props 要定义或修改的属性名和描述符组成的键值对。
     * @return 返回原对象。
     * @example Object.defineProperties({}, { props: value: 1 })
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
     */
    Object.defineProperties = Object.defineProperties || function (obj, props) {
        for (var key in props) {
            Object.defineProperty(obj, key, props[key]);
        }
    };
    /**
     * 返回对象的原型。
     * @param obj 对象。
     * @return 返回原型对象。
     * @example Object.getPrototypeOf({}) // Object.prototype
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf
     */
    Object.getPrototypeOf = Object.getPrototypeOf || function (obj) {
        var proto = obj.__proto__;
        if (proto || proto === null) {
            return proto;
        }
        if (obj.constructor) {
            return obj.constructor.prototype;
        }
        return Object.prototype;
    };
    /**
     * 获取对象自身的所有键。
     * @param obj 对象。
     * @return 返回所有键组成的数组。
     * @example Object.keys({a: 3, b: 5}) // ["a", "b"]
     * @example Object.keys([0, 1]) // ["0", "1"]
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
     */
    Object.keys = Object.keys || function (obj) {
        var r = [];
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                r.push(key);
            }
        }
        return r;
    };
    /**
     * 冻结一个对象，禁止增删改对象的属性。
     * @param obj 要被冻结的对象。
     * @return 返回已冻结的对象。
     * @example Object.freeze({}) // {}
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
     */
    Object.freeze = Object.freeze || function (obj) {
        return obj;
    };
    /**
     * 判断一个对象是否已被冻结。
     * @param obj 要判断的对象。
     * @return 如果已被冻结则返回 true，否则返回 false。
     * @example Object.isFrozen({}) // false
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen
     */
    Object.isFrozen = Object.isFrozen || function (obj) {
        return false;
    };
    /**
     * 密封一个对象，禁止增删对象的属性。
     * @param obj 要被密封的对象。
     * @return 返回已密封的对象。
     * @example Object.seal({}) // {}
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal
     */
    Object.seal = Object.seal || function (obj) {
        return obj;
    };
    /**
     * 禁止增加对象的新属性。
     * @param obj 要被禁止的对象。
     * @return 返回已禁止的对象。
     * @example Object.freeze({}) // {}
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions
     */
    Object.preventExtensions = Object.preventExtensions || function (obj) {
        return obj;
    };
    /**
     * 判断一个对象是否被密封。
     * @param obj 要判断的对象。
     * @return 如果已被密封则返回 true，否则返回 false。
     * @example Object.isSealed({}) // false
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed
     */
    Object.isSealed = Object.isSealed || function (obj) {
        return false;
    };
    /**
     * 判断一个对象是否可扩展。
     * @param obj 要判断的对象。
     * @return 如果不可扩展则返回 true，否则返回 false。
     * @example Object.isExtensible({}) // false
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible
     */
    Object.isExtensible = Object.isExtensible || function (obj) {
        return obj instanceof Object;
    };
    /**
     * 获取对象自有属性的描述符。
     * @param obj 对象。
     * @param prop 要获取的属性名。
     * @return 返回属性描述符（property descriptor），如果对象自身不含对应的属性名则返回 undefined。
     * @example Object.getOwnPropertyDescriptor({}) // false
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
     */
    Object.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor || function (obj, prop) {
        return obj.hasOwnProperty(prop) ? {
            get: obj.__lookupGetter__(prop),
            set: obj.__lookupSetter__(prop),
            value: obj[prop]
        } : undefined;
    };
    /**
     * 获取对象所有自有属性列表。
     * @param obj 对象。
     * @return 所有自有属性列表。
     * @example Object.getOwnPropertyNames({}) // []
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
     */
    Object.getOwnPropertyNames = Object.getOwnPropertyNames || Object.keys;
    /**
     * 判断一个对象是否是数组。
     * @param obj 要判断的对象。
     * @return 如果对象是原生数组则返回 true，否则返回 false。
     * @example Array.isArray([]) // true
     * @example Array.isArray(document.getElementsByTagName("div")) // false
     * @example Array.isArray(new Array) // true
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
     */
    Array.isArray = Array.isArray || function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };
    /**
     * 查找指定项在数组内的第一个索引。
     * @param value 要查找的项。
     * @param startIndex 查找开始的位置。
     * @return 返回索引。如果找不到则返回 -1。
     * @example ["a", "b", "b", "c"].indexOf("b") // 1
     * @example ["a", "b", "b", "c"].indexOf("e") // -1
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
     */
    Array.prototype.indexOf = Array.prototype.indexOf || function (value, startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        for (; startIndex < this.length; startIndex++) {
            if (this[startIndex] === value) {
                return startIndex;
            }
        }
        return -1;
    };
    /**
     * 查找指定项在数组内的最后一个索引。
     * @param value 要查找的项。
     * @param startIndex 查找开始的位置。
     * @return 返回索引。如果找不到则返回 -1。
     * @example ["a", "b", "b", "c"].lastIndexOf("b") // 2
     * @example ["a", "b", "b", "c"].lastIndexOf("e") // -1
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
     */
    Array.prototype.lastIndexOf = Array.prototype.lastIndexOf || function (value, startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        for (var i = this.length - 1; i >= startIndex; i--) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    };
    /**
     * 对数组的每一项执行一次回调函数。
     * @param callback 回调函数。函数接收以下参数：
     * - value：当前项的值。
     * - index：当前项的索引。
     * - target：数组本身。
     * @param thisArg 执行回调函数时 this 的值。
     * @example ["a", "b"].forEach(console.log, console) // 打印“0  a”和“1  b”
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
     */
    Array.prototype.forEach = Array.prototype.forEach || function (callback, thisArg) {
        for (var i = 0; i < this.length; i++) {
            if (i in this) {
                callback.call(thisArg, this[i], i, this);
            }
        }
    };
    /**
     * 对数组的每一项执行一次回调函数，然后将每个结果组成新数组。
     * @param callback 回调函数。函数接收以下参数：
     * - value：当前项的值。
     * - index：当前项的索引。
     * - target：数组本身。
     *
     * 函数应返回新的结果。
     * @param thisArg 执行回调函数时 this 的值。
     * @return 返回一个新数组。
     * @example [1, 9, 9, 0].map(function(item) { return item + 1; }) // [2, 10, 10, 1]
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map
     */
    Array.prototype.map = Array.prototype.map || function (callback, thisArg) {
        var r = [];
        for (var i = 0; i < this.length; i++) {
            if (i in this) {
                r[i] = callback.call(thisArg, this[i], i, this);
            }
        }
        return r;
    };
    /**
     * 筛选数组中符合条件的项并组成一个新数组。
     * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
     * - value：当前项的值。
     * - index：当前项的索引。
     * - target：数组本身。
     *
     * 如果当前项符合条件应返回 true，否则返回 false。
     * @param thisArg 执行回调函数时 this 的值。
     * @return 返回一个新数组。
     * @example [1, 2].filter(function(item) { return item > 1; }) // [2]
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
     */
    Array.prototype.filter = Array.prototype.filter || function (callback, thisArg) {
        var r = [];
        for (var i = 0; i < this.length; i++) {
            if ((i in this) && callback.call(thisArg, this[i], i, this)) {
                r.push(this[i]);
            }
        }
        return r;
    };
    /**
     * 判断数组的每一项是否都符合条件。
     * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
     * - value：当前项的值。
     * - index：当前项的索引。
     * - target：数组本身。
     *
     * 如果当前项符合条件应返回 true，否则返回 false。
     * @param thisArg 执行回调函数时 this 的值。
     * @return 如果所有项满足条件则返回 true，否则返回 false。
     * @example [1, 2].every(function(item) {return item > 0}) // true
     * @example [1, 2].every(function(item) {return item > 1}) // false
     * @example [1, 2].every(function(item) {return item > 2}) // false
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every
     */
    Array.prototype.every = Array.prototype.every || function (callback, thisArg) {
        for (var i = 0; i < this.length; i++) {
            if ((i in this) && !callback.call(thisArg, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };
    /**
     * 判断数组中是否存在一项或多项符合条件。
     * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
     * - value：当前项的值。
     * - index：当前项的索引。
     * - target：数组本身。
     *
     * 如果当前项符合条件应返回 true，否则返回 false。
     * @param thisArg 执行回调函数时 this 的值。
     * @return 如果至少存在一项满足条件则返回 true，否则返回 false。
     * @example [1, 2].some(function(item) {return item > 0}) // true
     * @example [1, 2].some(function(item) {return item > 1}) // true
     * @example [1, 2].some(function(item) {return item > 2}) // false
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     */
    Array.prototype.some = Array.prototype.some || function (callback, thisArg) {
        for (var i = 0; i < this.length; i++) {
            if ((i in this) && callback.call(thisArg, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };
    /**
     * 从左往右依次合并数组中的每一项并最终返回一个值。
     * @param callback 用于合并两个项的回调函数。函数接收以下参数：
     * - previousValue：要合并的前一项。
     * - currentValue：要合并的当前项。
     * - index：当前项的索引。
     * - target：数组本身。
     *
     * 函数应合并的结果。
     * @param initialValue 用于合并第一项的初始值。
     * @param thisArg 执行回调函数时 this 的值。
     * @return 返回合并后的最终结果值。
     * @example [1, 2].reduce(function(x, y) { return x + y; }) // 3
     * @example [1, 2].reduce(function(x, y) { return x + y; }, 10) // 13
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
     */
    Array.prototype.reduce = Array.prototype.reduce || function (callback, initialValue) {
        var r;
        var first = true;
        for (var i = 0; i < this.length; i++) {
            if (i in this) {
                if (first) {
                    first = false;
                    r = initialValue === undefined ? this[i] : callback(initialValue, this[i], i, this);
                }
                else {
                    r = callback(r, this[i], i, this);
                }
            }
        }
        return r;
    };
    /**
     * 从右往左依次合并数组中的每一项并最终返回一个值。
     * @param callback 用于合并两个项的回调函数。函数接收以下参数：
     * - previousValue：要合并的前一项。
     * - currentValue：要合并的当前项。
     * - index：当前项的索引。
     * - target：数组本身。
     *
     * 函数应合并的结果。
     * @param initialValue 用于合并第一项的初始值。
     * @param thisArg 执行回调函数时 this 的值。
     * @return 返回合并后的最终结果值。
     * @example [1, 2].reduceRight(function(x, y) {return x + y}) // 3
     * @example [1, 2].reduceRight(function(x, y) {return x + y}, 10) // 13
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
     */
    Array.prototype.reduceRight = Array.prototype.reduceRight || function (callback, initialValue) {
        var r;
        var first = true;
        for (var i = this.length; --i >= 0;) {
            if (i in this) {
                if (first) {
                    first = false;
                    r = initialValue === undefined ? this[i] : callback(initialValue, this[i], i, this);
                }
                else {
                    r = callback(r, this[i], i, this);
                }
            }
        }
        return r;
    };
    /**
     * 去除字符串的首尾空格。
     * @return 返回新字符串。
     * @example "  a".trim() // "a"
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/trim
     */
    String.prototype.trim = String.prototype.trim || function () {
        return this.replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, "");
    };
    /**
     * 获取当前时间戳。
     * @return 返回当前时间和 1970/1/1 08:00:00 的相差毫秒数。
     * @example Date.now() // 相当于 new Date().getTime()
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/now
     */
    Date.now = Date.now || function () {
        return +new Date();
    };
    /**
     * 返回一个 ISO（ISO 8601 Extended Format）格式的字符串（YYYY-MM-DDTHH:mm:ss.sssZ）。
     * @return 返回 ISO 格式的字符串。时区总是 UTC（协调世界时），加一个后缀“Z”标识。
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
     */
    Date.prototype.toISOString = Date.prototype.toISOString || function () {
        return (this.getUTCFullYear() + "-" + (this.getUTCMonth() + 1) + "-" + this.getUTCDate() + "T" + this.getUTCHours() + ":" + this.getUTCMinutes() + ":" + this.getUTCSeconds() + "." + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + "Z").replace(/([-T:])(\d\D)/g, "$10$2");
    };
    /**
     * 返回一个新函数，这个函数执行时 this 始终为指定的值。
     * @param thisArg 要绑定的 this 的值。
     * @return 返回一个新函数。
     * @example (function(){ return this; }).bind([0])()[0] // 0
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
     */
    Function.prototype.bind = Function.prototype.bind || function (thisArg) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return function () {
            var args2 = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args2[_i] = arguments[_i];
            }
            return _this.apply(thisArg, args.concat(args2));
        };
    };
});
//# sourceMappingURL=es5-shim.js.map