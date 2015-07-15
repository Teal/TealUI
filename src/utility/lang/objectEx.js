/**
 * @author xuld
 */

// #region @Object.type

/**
 * 返回一个变量的类型的字符串形式。
 * @param {Object} obj 变量。
 * @return {String} 所有可以返回的字符串： string number boolean undefined null
 *         array function element class date regexp object。
 * @example <code> 
 * Object.type(null); // "null"
 * Object.type(); // "undefined"
 * Object.type(new Function); // "function"
 * Object.type(+'a'); // "number"
 * Object.type(/a/); // "regexp"
 * Object.type([]); // "array"
 * </code>
 */
Object.type = function (obj) {
    var types = Object._types;
    if (!types) {
        Object._types = types = {};
        "Boolean Number String Function Array Date RegExp Object Error".replace(/\w+/g, function (name) {
            types["[object " + name + "]"] = name.toLowerCase()
        });
    }

    return obj == null ? String(obj) : types[types.toString.call(obj)] || "object";
};

// #endregion

// #region @Object.isObject

/**
 * 判断一个变量是否是引用变量。
 * @param {Object} obj 变量。
 * @return {Boolean} 如果 *obj* 是引用变量，则返回 **true**, 否则返回 **false** 。
 * @remark 此函数等效于 `obj !== null && typeof obj === "object"`
 * @example
 * <pre>
 * Object.isObject({}); // true
 * Object.isObject(null); // false
 * </pre>
 */
Object.isObject = function (obj) {
    return obj !== null && typeof obj === "object";
}

// #endregion

// #region @Object.isFunction

/**
 * 判断一个变量是否是函数。
 * @param {Object} obj 要判断的变量。
 * @return {Boolean} 如果是函数，返回 true， 否则返回 false。
 * @example
 * <pre>
 * Object.isFunction(function () {}); // true
 * Object.isFunction(null); // false
 * Object.isFunction(new Function); // true
 * </pre>
 */
Object.isFunction = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Function]";
}

// #endregion

// #region @Object.assignIf

/**
 * 复制对象的所有属性到其它对象，但不覆盖原对象的相应值。
 * @param {Object} target 复制的目标对象。
 * @param {Object} src 复制的源对象。
 * @return {Object} 返回 *target*。
 * @see Object.assign
 * @example
 * <pre>
 * var a = {v: 3, g: 5}, b = {g: 2};
 * Object.extendIf(a, b);
 * trace(a); // {v: 3, g: 5}  b 未覆盖 a 任何成员。
 * </pre>
 */
Object.assignIf = function (target, source) {
    // 和 Object.assign 类似，只是判断目标的值，如果不是 undefined 然后拷贝。
    for (var key in source)
        if (target[key] === undefined)
            target[key] = source[key];
    return target;
},

// #endregion

// #region @Object.clone

/**
 * 深拷贝一个对象，拷贝的对象和原对象无关联。
 * @param {Object} obj 复制的对象。
 * @return {Object} 返回新对象。
 * @example
 * <pre>
 * var a = {v: 3, g: 5};
 * Object.clone(a, b);
 * trace(a); // {v: 3, g: 5}
 * </pre>
 */
Object.clone = function (obj) {
    if (obj && typeof obj === 'object') {
        var newObj, i;
        if (obj instanceof Array) {
            newObj = [];
            for (i = 0; i < obj.length; i++) {
                newObj[i] = Object.clone(obj[i]);
            }
            obj = newObj;
        } else if (obj instanceof Date) {
            obj = new Date(+obj);
        } else if (obj instanceof RegExp) {
            obj = new RegExp(obj);
        } else {
            newObj = {};
            for (i in obj) {
                newObj[i] = Object.clone(obj[i]);
            }
            obj = newObj;
        }
    }
    return obj;
};

// #endregion

// #region @Object.count

/**
 * 获取对象的属性数。
 * @param {Object} obj 判断的对象。
 * @return {Number} 返回属性数。
 * @example
 * <pre>
 * var a = {v: 3, g: 5};
 * console.log(Object.length(a));
 * </pre>
 */
Object.count = function (obj) {
    var length = 0, key;
    for (key in obj)
        if (obj.hasOwnProperty(key))
            length++;
    return length;
};

// #endregion

// #region @Object.keys

/**
 * 获取对象的所有键。
 * @param {Object} obj 判断的对象。
 * @return {Array} 返回所有键。
 * @example
 * <pre>
 * var a = {v: 3, g: 5};
 * console.log(Object.keys(a));
 * </pre>
 */
Object.keys = Object.keys || function (obj) {
    var result = [], key;
    for (key in obj)
        if (obj.hasOwnProperty(key))
            result.push(key);
    return result;
};

// #endregion

// #region @Object.values

/**
 * 获取对象的所有值。
 * @param {Object} obj 判断的对象。
 * @return {Array} 返回所有值。
 * @example
 * <pre>
 * var a = {v: 3, g: 5};
 * console.log(Object.values(a));
 * </pre>
 */
Object.values = function (obj) {
    var result = [], key;
    for (key in obj)
        if (obj.hasOwnProperty(key))
            result.push(obj[key]);
    return result;
};

// #endregion

// #region @Object.keyOf

/**
 * 返回一个值对应的键。
 * @param {Object} obj 判断的对象。
 * @param {Object} value 判断的值。
 * @return {String} 返回键，如果不存在返回 null。
 * @example
 * <pre>
 * var a = {v: 3, g: 5};
 * console.log(Object.values(a));
 * </pre>
 */
Object.keyOf = function (obj, value) {
    for (var key in obj)
        if (obj.hasOwnProperty(key) && obj[key] === value)
            return key;
    return null;
};

// #endregion

// #region @Object.insertBefore

/**
 * 在对象指定键之前插入一个属性对。
 * @param {Object} obj 插入的对象。
 * @param {Object} refKey 插入的位置。
 * @param {Object} key 插入的键。
 * @param {Object} value 插入的值。
 * @return {Object} 返回 *obj*。
 * @example
 * <pre>
 * var a = {v: 3, g: 5};
 * console.log(Object.values(a));
 * </pre>
 */
Object.insertBefore = function (obj, refKey, key, value) {
    var tmpObj = {}, foundKey = false, k;
    for (k in obj) {
        if (k === refKey) foundKey = true;
        if (foundKey) {
            tmpObj[k] = obj[k];
            delete obj[k];
        }
    }
    obj[key] = value;
    for (k in tmpObj) {
        obj[k] = tmpObj[k];
    }
    return obj;
};

// #endregion

// #region @Object.map

/**
 * 遍历一个类数组对象并调用指定的函数，返回每次调用的返回值数组。
 * @param {Array/Object} iterable 任何对象，不允许是函数。
 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
 *
 * - {Object} value 当前元素的值。
 * - {Number} index 当前元素的索引。
 * - {Array} array 当前正在遍历的数组。
 *
 * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
 * @return {Object} 返回的结果对象。
 * @example
 * <pre>
 * 
 * Object.map(["a","b"], function(a){
 * 	  return a + a;
 * }); // => ["aa", "bb"];
 *
 * Object.map({a: "a", b: "b"}, function(a){
 * 	  return a + a
 * }); // => {a: "aa", b: "bb"};
 *
 * Object.map({length: 1, "0": "a"}, function(a){
 * 	   return a + a
 * }); // => ["a"];
 * 
 * </pre>
 */
Object.map = function (iterable, fn, scope) {

    var target, length, i;

    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable instanceof Array) {
        target = [];
        length = iterable.length;
        for (i = 0; i < length; i++)
            target[i] = fn.call(scope, iterable[i], i, iterable);
    } else {
        target = {};
        for (i in iterable)
            target[i] = fn.call(scope, iterable[i], i, iterable);
    }

    // 返回目标。
    return target;
}

// #endregion

// #region @Object.filter

/**
 * 遍历一个类数组对象并调用指定的函数，过滤不满足要求的元素。
 * @param {Array/Object} iterable 任何对象，不允许是函数。
 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
 *
 * - {Object} value 当前元素的值。
 * - {Number} index 当前元素的索引。
 * - {Array} array 当前正在遍历的数组。
 *
 * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
 * @return {Object} 返回的结果对象。
 */
Object.filter = function (iterable, fn, scope) {

    var target, length, i;

    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable instanceof Array) {
        target = [];
        length = iterable.length;
        for (i = 0; i < length; i++)
            if (fn.call(scope, iterable[i], i, iterable) !== false)
                target.push(iterable[i]);
    } else {
        target = {};
        for (i in iterable)
            if (fn.call(scope, iterable[i], i, iterable) !== false)
                target[i] = iterable[i];
    }

    // 返回目标。
    return target;
}

// #endregion

// #region @Object.every

/**
 * 遍历一个类数组对象并调用指定的函数，判断是否都满足条件。
 * @param {Array/Object} iterable 任何对象，不允许是函数。
 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
 *
 * - {Object} value 当前元素的值。
 * - {Number} index 当前元素的索引。
 * - {Array} array 当前正在遍历的数组。
 *
 * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
 * @return {Object} 返回的结果对象。
 */
Object.every = function (iterable, fn, scope) {

    var target, length, i;

    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable instanceof Array) {
        target = [];
        length = iterable.length;
        for (i = 0; i < length; i++)
            if (fn.call(scope, iterable[i], i, iterable) === false)
                return false;
    } else {
        target = {};
        for (i in iterable)
            if (fn.call(scope, iterable[i], i, iterable) === false)
                return false;
    }

    // 返回目标。
    return true;
}

// #endregion

// #region @Object.some

/**
 * 遍历一个类数组对象并调用指定的函数，判断是否都满足条件。
 * @param {Array/Object} iterable 任何对象，不允许是函数。
 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
 *
 * - {Object} value 当前元素的值。
 * - {Number} index 当前元素的索引。
 * - {Array} array 当前正在遍历的数组。
 *
 * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
 * @return {Object} 返回的结果对象。
 */
Object.some = function (iterable, fn, scope) {

    var target, length, i;

    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable instanceof Array) {
        target = [];
        length = iterable.length;
        for (i = 0; i < length; i++)
            if (fn.call(scope, iterable[i], i, iterable) !== false)
                return true;
    } else {
        target = {};
        for (i in iterable)
            if (fn.call(scope, iterable[i], i, iterable) !== false)
                return true;
    }

    // 返回目标。
    return false;
}

// #endregion

// #region @Object.subset

/**
 * 获取对象指定键的子集。
 * @param {Object} obj 任何对象，不允许是函数。
 * @param {Array} keys 对每个元素运行的函数。函数的参数依次为:
 * @return {Object} 返回的结果对象。
 */
Object.subset = function (obj, keys) {
    var result = {}, i;
    for (i = 0; i < keys.length; i++)
        if (keys[i] in obj)
            result[keys[i]] = obj[keys[i]];
    return result;
}

// #endregion

// #region @Object.pick

/**
 * 获取参数中第一个不为 undefined 的值。
 * @param {Object} obj 任何对象，不允许是函数。
 * @param {Array} keys 对每个元素运行的函数。函数的参数依次为:
 * @return {Object} 返回的结果对象。
 */
Object.pick = function () {
    for (var i = 0; i < arguments.length; i++)
        if (arguments[i] != undefined)
            return arguments[i];
    return null;
}

// #endregion
