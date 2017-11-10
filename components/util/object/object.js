var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 复制源对象的所有可枚举属性到目标对象，如果目标对象中对应的属性值不是 undefined 则跳过。
     * @param target 目标对象。
     * @param source 源对象。源对象可以是 null 或 undefined。
     * @return 返回目标对象。
     * @example assignIf({a: 1}, {a: 2, b: 2}) // {a: 1, b: 2}
     */
    function assignIf(target, source) {
        for (var key in source) {
            if (target[key] === undefined) {
                target[key] = source[key];
            }
        }
        return target;
    }
    exports.assignIf = assignIf;
    /**
     * 获取对象自身或原型上的属性描述符。
     * @param obj 对象。
     * @param key 要获取的属性名。
     * @return 返回对象描述器。如果找不到则返回 undefined。
     */
    function getPropertyDescriptor(obj, key) {
        var desc;
        while (obj && !(desc = Object.getOwnPropertyDescriptor(obj, key))) {
            obj = obj.__proto__ || Object.getPrototypeOf(obj);
        }
        return desc;
    }
    exports.getPropertyDescriptor = getPropertyDescriptor;
    /**
     * 在对象指定的键之前插入一个键值对。
     * @param obj 对象。
     * @param newKey 要插入的键。
     * @param newValue 要插入的值。
     * @param refKey 指示插入位置的键，将在该键前插入。如果指定为 null 则插入到末尾。
     * @example insertBefore({ a: 1 }, "b", 2, "a") // { b:2, a: 1 }
     */
    function insertBefore(obj, newKey, newValue, refKey) {
        var tmpObj;
        for (var key in obj) {
            if (key === refKey) {
                tmpObj = {};
            }
            if (tmpObj) {
                tmpObj[key] = obj[key];
                delete obj[key];
            }
        }
        obj[newKey] = newValue;
        for (var key in tmpObj) {
            obj[key] = tmpObj[key];
        }
    }
    exports.insertBefore = insertBefore;
    function each(obj, callback, thisArg) {
        if (obj && typeof obj.length === "number") {
            for (var i = 0; i < obj.length; i++) {
                if ((i in obj) && callback.call(thisArg, obj[i], i, obj) === false) {
                    return false;
                }
            }
        }
        else {
            for (var i in obj) {
                if (callback.call(thisArg, obj[i], i, obj) === false) {
                    return false;
                }
            }
        }
        return true;
    }
    exports.each = each;
    function forEach(obj, callback, thisArg) {
        if (obj && typeof obj.length === "number") {
            for (var i = 0; i < obj.length; i++) {
                if (i in obj) {
                    callback.call(thisArg, obj[i], i, obj);
                }
            }
        }
        else {
            for (var i in obj) {
                callback.call(thisArg, obj[i], i, obj);
            }
        }
    }
    exports.forEach = forEach;
    function filter(obj, callback, thisArg) {
        var r;
        if (obj && typeof obj.length === "number") {
            r = [];
            for (var i = 0; i < obj.length; i++) {
                if ((i in obj) && callback.call(thisArg, obj[i], i, obj)) {
                    r.push(obj[i]);
                }
            }
        }
        else {
            r = {};
            for (var i in obj) {
                if (callback.call(thisArg, obj[i], i, obj)) {
                    r[i] = obj[i];
                }
            }
        }
        return r;
    }
    exports.filter = filter;
    function map(obj, callback, thisArg) {
        var r;
        if (obj && typeof obj.length === "number") {
            r = [];
            for (var i = 0; i < obj.length; i++) {
                if (i in obj) {
                    r[i] = callback.call(thisArg, obj[i], i, obj);
                }
            }
        }
        else {
            r = {};
            for (var i in obj) {
                r[i] = callback.call(thisArg, obj[i], i, obj);
            }
        }
        return r;
    }
    exports.map = map;
    function every(obj, callback, thisArg) {
        if (obj && typeof obj.length === "number") {
            for (var i = 0; i < obj.length; i++) {
                if ((i in obj) && !callback.call(thisArg, obj[i], i, obj)) {
                    return false;
                }
            }
        }
        else {
            for (var i in obj) {
                if (!callback.call(thisArg, obj[i], i, obj)) {
                    return false;
                }
            }
        }
        return true;
    }
    exports.every = every;
    function some(obj, callback, thisArg) {
        if (obj && typeof obj.length === "number") {
            for (var i = 0; i < obj.length; i++) {
                if ((i in obj) && callback.call(thisArg, obj[i], i, obj)) {
                    return true;
                }
            }
        }
        else {
            for (var i in obj) {
                if (callback.call(thisArg, obj[i], i, obj)) {
                    return true;
                }
            }
        }
        return false;
    }
    exports.some = some;
    function find(obj, callback, thisArg) {
        if (obj && typeof obj.length === "number") {
            for (var i = 0; i < obj.length; i++) {
                if ((i in obj) && callback.call(thisArg, obj[i], i, obj)) {
                    return obj[i];
                }
            }
        }
        else {
            for (var i in obj) {
                if (callback.call(thisArg, obj[i], i, obj)) {
                    return obj[i];
                }
            }
        }
    }
    exports.find = find;
    function findIndex(obj, callback, thisArg) {
        if (obj && typeof obj.length === "number") {
            for (var i = 0; i < obj.length; i++) {
                if ((i in obj) && callback.call(thisArg, obj[i], i, obj)) {
                    return i;
                }
            }
            return -1;
        }
        else {
            for (var i in obj) {
                if (callback.call(thisArg, obj[i], i, obj)) {
                    return i;
                }
            }
            return null;
        }
    }
    exports.findIndex = findIndex;
    function reduce(obj, callback, initialValue, thisArg) {
        var r;
        var first = true;
        if (obj && typeof obj.length === "number") {
            for (var i = 0; i < obj.length; i++) {
                if (i in obj) {
                    if (first) {
                        first = false;
                        r = initialValue === undefined ? obj[i] : callback.call(thisArg, initialValue, obj[i], i, obj);
                    }
                    else {
                        r = callback.call(thisArg, r, obj[i], i, obj);
                    }
                }
            }
        }
        else {
            for (var i in obj) {
                if (first) {
                    first = false;
                    r = initialValue === undefined ? obj[i] : callback.call(thisArg, initialValue, obj[i], i, obj);
                }
                else {
                    r = callback.call(thisArg, r, obj[i], i, obj);
                }
            }
        }
        return r;
    }
    exports.reduce = reduce;
    function reduceRight(obj, callback, initialValue, thisArg) {
        var r;
        var first = true;
        if (obj && typeof obj.length === "number") {
            for (var i = obj.length; --i >= 0;) {
                if (i in obj) {
                    if (first) {
                        first = false;
                        r = initialValue === undefined ? obj[i] : callback.call(thisArg, initialValue, obj[i], i, obj);
                    }
                    else {
                        r = callback.call(thisArg, r, obj[i], i, obj);
                    }
                }
            }
        }
        else {
            var key = [];
            for (var i in obj) {
                key.push(i);
            }
            for (var i = key.length; --i >= 0;) {
                if (first) {
                    first = false;
                    r = initialValue === undefined ? obj[key[i]] : callback.call(thisArg, initialValue, obj[key[i]], key[i], obj);
                }
                else {
                    r = callback.call(thisArg, r, obj[key[i]], key[i], obj);
                }
            }
        }
        return r;
    }
    exports.reduceRight = reduceRight;
    function contains(obj, value, start) {
        if (obj && typeof obj.length === "number") {
            for (var i = start || 0; i < obj.length; i++) {
                if (obj[i] === value) {
                    return true;
                }
            }
        }
        else {
            var skip = start !== undefined;
            for (var i in obj) {
                if (skip) {
                    if (i !== start) {
                        continue;
                    }
                    skip = false;
                }
                if (obj[i] === value) {
                    return true;
                }
            }
        }
        return false;
    }
    exports.contains = contains;
    /**
     * 获取对象包含指定键的子对象。
     * @param obj 对象。
     * @param keys 键列表。
     * @return 返回新对象。
     * @example subset({a: 1, b: 2}, ["a"]) // {a: 1}
     */
    function subset(obj, keys) {
        var r = {};
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (key in obj) {
                r[key] = obj[key];
            }
        }
        return r;
    }
    exports.subset = subset;
    /**
     * 将对象的键和值对换组成新对象。
     * @param obj 对象。
     * @return 返回新对象。
     * @example invert({a: 1, b: 2, c: 3}) // { 1: "a", 2: "b", 3: "c" }
     */
    function invert(obj) {
        var r = {};
        for (var key in obj) {
            r[obj[key]] = key;
        }
        return r;
    }
    exports.invert = invert;
    /**
     * 判断一个对象是否是引用对象。
     * @param obj 对象。
     * @return 如果对象是引用对象则返回 true，否则返回 false。
     * @desc 此函数等效于 `obj !== null && typeof obj === "object"`
     * @example isObject({}) // true
     * @example isObject(null) // false
     */
    function isObject(obj) {
        return obj !== null && typeof obj === "object";
    }
    exports.isObject = isObject;
    /**
     * 存储所有内置类型转为字符串的值。
     */
    var types;
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
    function type(obj) {
        if (!types) {
            types = { __proto__: null };
            "Boolean Number String Function Array Date RegExp Object Error".replace(/\w+/g, function (typeName) { return types["[object " + typeName + "]"] = typeName.toLowerCase(); });
        }
        return obj == null ? String(obj) : types[Object.prototype.toString.call(obj)] || "object";
    }
    exports.type = type;
    /**
     * 计算对象自身的可枚举属性数。
     * @param obj 对象。
     * @return 返回对象自身的可枚举属性数，原型上的属性会被忽略。
     * @example size({a: 1, b: 2}) // 2
     * @example size([0, 1]) // 2
     */
    function count(obj) {
        var r = 0;
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                r++;
            }
        }
        return r;
    }
    exports.count = count;
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
    function isEmpty(obj) {
        if (!obj) {
            return true;
        }
        if (typeof obj !== "object") {
            return false;
        }
        if (obj.length === 0) {
            return true;
        }
        for (var key in obj) {
            return false;
        }
        return true;
    }
    exports.isEmpty = isEmpty;
    /**
     * 浅拷贝指定的对象。
     * @param obj 对象。
     * @return 返回拷贝得到的新对象，该对象和原对象无引用关系。
     * @desc 出于性能考虑，此函数不会拷贝函数和正则表达式。
     * @example clone({a: 3, b: [5]}) // {a: 3, b: [5]}
     */
    function clone(obj) {
        if (obj && typeof obj === "object") {
            return __assign({}, obj);
        }
        return obj;
    }
    exports.clone = clone;
    /**
     * 深拷贝一个对象。
     * @param obj 对象。
     * @param replacer 用于拷贝自定义对象的函数。函数接收一个参数为要拷贝的值，函数应返回拷贝后的新值。
     * @return 返回拷贝得到的新对象，该对象的每个层级和原对象都无引用关系。
     * @desc 出于性能考虑，此函数不会拷贝函数和正则表达式。
     * @example deepCloneSafe({a: 3, b: [5]}) // {a: 3, b: [5]}
     */
    function deepClone(obj, replacer, cloned, clonedResult) {
        if (cloned === void 0) { cloned = []; }
        if (clonedResult === void 0) { clonedResult = []; }
        if (obj && typeof obj === "object") {
            var index = cloned.indexOf(obj);
            if (index >= 0) {
                return clonedResult[index];
            }
            if (obj instanceof Array) {
                var newObj = [];
                cloned.push(obj);
                clonedResult.push(newObj);
                for (var i = 0; i < obj.length; i++) {
                    newObj[i] = deepClone(obj[i], replacer, cloned, clonedResult);
                }
                obj = newObj;
            }
            else if (obj instanceof Date) {
                obj = new Date(+obj);
            }
            else if (!(obj instanceof RegExp)) {
                if (replacer) {
                    obj = replacer(obj);
                }
                else {
                    var newObj = { __proto__: obj.__proto__ };
                    cloned.push(obj);
                    clonedResult.push(newObj);
                    for (var i in obj) {
                        newObj[i] = deepClone(obj[i], replacer, cloned, clonedResult);
                    }
                    obj = newObj;
                }
            }
        }
        return obj;
    }
    exports.deepClone = deepClone;
    /**
     * 深拷贝一个对象。不支持存在循环引用的对象。
     * @param obj 对象。
     * @param depth 拷贝的最大深度，超过此深度后将直接使用原值。
     * @param replacer 用于拷贝自定义对象的函数。函数接收一个参数为要拷贝的值，函数应返回拷贝后的新值。
     * @return 返回拷贝得到的新对象，该对象的每个层级和原对象都无引用关系。
     * @desc 出于性能考虑，此函数不会拷贝函数和正则表达式。
     * @example deepClone({a: 3, b: [5]}) // {a: 3, b: [5]}
     */
    function deepCloneFast(obj, replacer, depth) {
        if (depth === void 0) { depth = Infinity; }
        if (obj && typeof obj === "object" && depth-- > 0) {
            if (obj instanceof Array) {
                var newObj = [];
                for (var i = 0; i < obj.length; i++) {
                    newObj[i] = deepCloneFast(obj[i], replacer, depth);
                }
                obj = newObj;
            }
            else if (obj instanceof Date) {
                obj = new Date(+obj);
            }
            else if (!(obj instanceof RegExp)) {
                if (replacer) {
                    obj = replacer(obj);
                }
                else {
                    var newObj = { __proto__: obj.__proto__ };
                    for (var i in obj) {
                        newObj[i] = deepCloneFast(obj[i], replacer, depth);
                    }
                    obj = newObj;
                }
            }
        }
        return obj;
    }
    exports.deepCloneFast = deepCloneFast;
    /**
     * 比较两个引用对象的内容是否相同。
     * @param obj1 要比较的第一个对象。
     * @param obj2 要比较的第二个对象。
     * @return 如果比较的对象完全相同则返回 true，否则返回 false。
     * @example deepEqual([], []) // true
     */
    function deepEqual(obj1, obj2) {
        if (obj1 && obj2 && typeof obj1 === "object" && typeof obj2 === "object") {
            if (Array.isArray(obj1) || Array.isArray(obj2)) {
                if (!Array.isArray(obj1) || !Array.isArray(obj2) || obj1.length !== obj2.length) {
                    return false;
                }
                for (var i = 0; i < obj1.length; i++) {
                    if (!deepEqual(obj1[i], obj2[i])) {
                        return false;
                    }
                }
                return true;
            }
            for (var key in obj1) {
                if (!deepEqual(obj1[key], obj2[key])) {
                    return false;
                }
            }
            for (var key in obj2) {
                if (!deepEqual(obj1[key], obj2[key])) {
                    return false;
                }
            }
            return true;
        }
        return obj1 === obj2;
    }
    exports.deepEqual = deepEqual;
    /**
     * 浅比较两个对象的差异。
     * @param obj1 要比较的第一个对象。
     * @param obj2 要比较的第二个对象。
     * @return 返回包含差异信息的对象。该对象列出了只在其中某个对象存在的属性值和公共的属性值。
     * @example diff({ a:1, c: 1 }, { b: 1, c: 2 }) // { left: ["a"], right: ["b"], both: ["c"] }
     */
    function diff(obj1, obj2) {
        var r = {
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
            both: [],
        };
        for (var key in obj1) {
            if (!(key in obj2)) {
                r.left.push(key);
            }
            else if (obj1[key] !== obj2[key]) {
                r.both.push(key);
            }
        }
        for (var key in obj2) {
            if (!(key in obj1)) {
                r.right.push(key);
            }
        }
        return r;
    }
    exports.diff = diff;
    /**
     * 深比较两个对象的差异。
     * @param obj1 要比较的第一个对象。
     * @param obj2 要比较的第二个对象。
     * @param depth 比较的最大深度，超过此深度后的差异将被忽略。
     * @return 返回包含差异信息的对象。该对象列出了只在其中某个对象存在的属性值和公共的属性值。
     * @example deepDiff({ a:1, c: 1 }, { b: 1, c: 2 }) // {left: ["a"], right: ["b"], both: ["c"]}
     */
    function deepDiff(obj1, obj2, depth) {
        if (depth === void 0) { depth = Infinity; }
        var r = {
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
            both: [],
        };
        diff(obj1, obj2, "", depth);
        return r;
        function diff(x, y, prefix, depth) {
            if (depth-- === 0) {
                return;
            }
            for (var key in x) {
                if (!(key in y)) {
                    r.left.push(prefix + key);
                }
                else if (x[key] !== y[key]) {
                    if (typeof x[key] !== "object" || typeof y[key] !== "object") {
                        r.both.push(prefix + key);
                    }
                    else {
                        diff(x[key], y[key], prefix + key + ".", depth);
                    }
                }
            }
            for (var key in y) {
                if (!(key in x)) {
                    r.right.push(prefix + key);
                }
            }
        }
    }
    exports.deepDiff = deepDiff;
    /**
     * 删除对象中值为 null 或 undefined 的键。
     * @param obj 对象。
     * @return 返回原对象。
     * @example clean({a: undefined, b: null, c: 3}) // {c: 3}
     */
    function clean(obj) {
        for (var key in obj) {
            if (obj[key] == null) {
                delete obj[key];
            }
        }
        return obj;
    }
    exports.clean = clean;
    /**
     * 返回对象中指定键组成的新对象。
     * @param obj 对象。
     * @param keys 要选择的所有键。
     * @return 返回新对象。
     * @example select({a: 1, b: 2, c: 3}, "a",  "c") // {a: 1, c: 3}
     */
    function select(obj) {
        var keys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            keys[_i - 1] = arguments[_i];
        }
        var r = {};
        for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
            var key = keys_2[_a];
            r[key] = obj[key];
        }
        return r;
    }
    exports.select = select;
    /**
     * 查找所有参数中第一个不为 undefined 和 null 的值。
     * @param values 所有值。
     * @return 返回第一个不为 undefined 和 null 的值。如果找不到则返回 undefined。
     * @example pick(undefined, null, 1) // 1
     */
    function pick() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
            var value = values_1[_a];
            if (value != undefined) {
                return value;
            }
        }
    }
    exports.pick = pick;
    /**
     * 查找对象中指定值对应的第一个键。
     * @param obj 对象。
     * @param value 值。
     * @return 返回匹配的第一个键，如果找不到则返回 null。
     * @example keyOf({a:1, b:1}, 1) // "a"
     */
    function keyOf(obj, value) {
        for (var key in obj) {
            if (obj[key] === value) {
                return key;
            }
        }
        return null;
    }
    exports.keyOf = keyOf;
    /**
     * 获取对象指定属性的值。
     * @param obj 对象。
     * @param prop 要获取的属性表达式。如 `a.b[0]`。
     * @return 返回属性值。如果属性不存在则返回 undefined。
     * @example get({a: {b: 1}}, "a.b") // 1
     */
    function get(obj, prop) {
        prop.replace(/\.?\s*([^\.\[]+)|\[\s*([^\]]*)\s*\]/g, (function (_, propName, indexer) {
            if (obj) {
                obj = obj[propName || indexer];
            }
        }));
        return obj;
    }
    exports.get = get;
    /**
     * 设置对象指定属性的值。
     * @param obj 对象。
     * @param prop 要设置的属性表达式。如 `a.b[0]`。
     * @param value 要设置的值。
     * @example set({}, "a[1].b", 2) // { a: [undefined, { b: 2 }]}
     */
    function set(obj, prop, value) {
        var prevObject;
        var prevKey;
        prop.replace(/\.?\s*([^\.\[]+)|\[\s*([^\]]*)\s*\]/g, (function (source, propName, indexer, index) {
            var currentObject = prevKey ? prevObject[prevKey] : obj;
            if (currentObject == null) {
                currentObject = indexer ? [] : {};
                if (prevKey) {
                    prevObject[prevKey] = currentObject;
                }
                else {
                    prevObject = obj = currentObject;
                }
            }
            prevObject = currentObject;
            prevKey = propName || indexer;
            if (index + source.length === prop.length) {
                currentObject[prevKey] = value;
            }
        }));
    }
    exports.set = set;
    /**
     * 强制覆盖对象的属性值。
     * @param obj 对象。
     * @param key 要设置的属性名。
     * @param value 要设置的属性值。
     * @example setProperty({myKey: "oldValue"}, "myKey", "newValue")
     */
    function setProperty(obj, key, value) {
        Object.defineProperty(obj, key, {
            value: value,
            writable: true,
            enumerable: true,
            configurable: true
        });
    }
    exports.setProperty = setProperty;
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
    function addCallback(obj, key, callback) {
        var oldFunc = obj[key];
        obj[key] = oldFunc ? function () {
            var oldResult = oldFunc.apply(this, arguments);
            var newResult = callback.apply(this, arguments);
            return oldResult !== undefined ? oldResult : newResult;
        } : callback;
    }
    exports.addCallback = addCallback;
    /**
     * 添加设置指定属性后的回调函数。
     * @param obj 对象。
     * @param key 属性名。
     * @param callback 回调函数。函数接收以下参数：
     * - this：当前对象。
     * - value：设置的新属性值。
     */
    function addSetCallback(obj, key, callback) {
        var original = getPropertyDescriptor(obj, key);
        if (original && (original.get || original.set)) {
            Object.defineProperty(obj, key, {
                get: original.get && function () {
                    return original.get.call(this);
                },
                set: original.set && function (value) {
                    original.set.call(this, value);
                    callback.call(this, value);
                },
            });
        }
        else {
            var currentValue_1;
            Object.defineProperty(obj, key, {
                get: function () {
                    return currentValue_1;
                },
                set: function (value) {
                    currentValue_1 = value;
                    callback.call(this, value);
                }
            });
        }
    }
    exports.addSetCallback = addSetCallback;
});
//# sourceMappingURL=object.js.map