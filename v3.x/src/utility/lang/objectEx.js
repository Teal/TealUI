/**
 * @fileOverview 扩展 Object 相关的 API。
 * @author xuld
 */

// #region @Object.type

/**
 * 获取指定对象的类型。
 * @param {Object} obj 要判断的对象。
 * @returns {String} 返回类型字符串。可能返回的值有： 
 * `string`, `number`, `boolean`, `undefined`, `null`, `array`, 
 * `function`, `element`, `date`, `regexp`, `object`。
 * @example
 * Object.type(null) // "null"
 * 
 * Object.type(undefined) // "undefined"
 * 
 * Object.type(new Function) // "function"
 * 
 * Object.type(+'a') // "number"
 * 
 * Object.type(/a/) // "regexp"
 * 
 * Object.type([]) // "array"
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

// #region @Object.isEmpty

/**
 * 判断一个对象是否空。
 * @param {Object} obj 要判断的对象。
 * @returns {Boolean} 如果 @obj 是 @null、@false、空字符串或空数组，则返回 @true，否则返回 @false。
 * @example
 * Object.isEmpty(null) // true
 * 
 * Object.isEmpty(undefined) // true
 * 
 * Object.isEmpty("") // true
 * 
 * Object.isEmpty(" ") // false
 * 
 * Object.isEmpty([]) // true
 * 
 * Object.isEmpty({}) // false
 */
Object.isEmpty = function (obj) {
    return !obj || obj.length === 0;
};

// #endregion

// #region @Object.isObject

/**
 * 判断一个对象是否是引用对象。
 * @param {Object} obj 要判断的对象。
 * @returns {Boolean} 如果 @obj 是引用变量，则返回 @true，否则返回 @false。
 * @remark 此函数等效于 `obj !== null && typeof obj === "object"`
 * @example
 * Object.isObject({}) // true
 * 
 * Object.isObject(null) // false
 */
Object.isObject = function (obj) {
    return obj !== null && typeof obj === "object";
}

// #endregion

// #region @Object.assignIf

/**
 * 复制对象的所有属性到其它对象，但不覆盖原对象的相应值。
 * @param {Object} target 复制的目标对象。
 * @param {Object} source 复制的源对象。
 * @returns {Object} 返回 @target。
 * @example
 * var a = {v: 3}, b = {g: 2};
 * Object.assignIf(a, b) // a 现在是 {v: 3, g: 2}
 */
Object.assignIf = function (target, source) {
    typeof console === "object" && console.assert(target != null, "Object.assignIf(target: 不能为空, source)");
    // 和 Object.assign 类似，只是判断目标的值，如果不是 undefined 然后拷贝。
    for (var key in source) {
        if (target[key] === undefined) {
            target[key] = source[key];
        }
    }
    return target;
},

// #endregion

// #region @Object.clone

/**
 * 深拷贝一个对象，拷贝的对象和原对象无引用关系。
 * @param {Object} obj 要复制的对象。
 * @returns {Object} 返回新对象。
 * @remark
 * > #### !不拷贝函数
 * > 考虑项目实际需求和性能，`Object.clone` 不拷贝函数，因此拷贝的对象成员函数将保持引用关系。
 * @example
 * Object.clone({a: 3, b: [5]}) // {a: 3, b: [5]}
 */
Object.clone = function (obj) {
    if (obj && typeof obj === 'object') {
        if (obj instanceof Array) {
            var newObj = [];
            for (var i = 0; i < obj.length; i++) {
                newObj[i] = Object.clone(obj[i]);
            }
            obj = newObj;
        } else if (obj instanceof Date) {
            obj = new Date(+obj);
        } else if (obj instanceof RegExp) {
            obj = new RegExp(obj);
        } else {
            var newObj = {};
            for (var i in obj) {
                newObj[i] = Object.clone(obj[i]);
            }
            obj = newObj;
        }
    }
    return obj;
};

// #endregion

// #region @Object.areSame

/**
 * 比较两个引用对象的内容是否相同。
 * @param {Object} objA 要比较的第一个对象。
 * @param {Object} objB 要比较的第二个对象。
 * @returns {Boolean} 如果比较的对象相同则返回 @true，否则返回 @false。
 * @example Object.areSame([], []) // true
 */
Object.areSame = function (objA, objB) {
    if (typeof objA === "object" && typeof objB === "object") {
        for (var key in objA) {
            if (!Object.areSame(objA[key], objB[key])) {
                return false;
            }
        }
        return true;
    }

    return objA === objB;
};

// #endregion

// #region @Object.size

/**
 * 计算对象的属性数。
 * @param {Object} obj 要处理的对象。
 * @returns {Number} 返回属性数。只返回对象自身的属性数，不含原型属性。
 * @example Object.size({v: 3, g: 5}) // 2
 */
Object.size = function (obj) {
    var result = 0;
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result++;
        }
    }
    return result;
};

// #endregion

// #region @Object.keys

/**
 * 获取对象的所有键。
 * @param {Object} obj 要处理的对象。
 * @returns {Array} 返回所有键组成的数组。
 * @example Object.keys({a: 3, b: 5}) // ["a", "b"]
 * @since ES5
 */
Object.keys = Object.keys || function (obj) {
    var result = [];
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result.push(key);
        }
    }
    return result;
};

// #endregion

// #region @Object.values

/**
 * 获取对象的所有值。
 * @param {Object} obj 要处理的对象。
 * @returns {Array} 返回所有值组成的数组。
 * @example Object.values({a: 3, b: 5}) // [3, 5]
 */
Object.values = function (obj) {
    var result = [];
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result.push(obj[key]);
        }
    }
    return result;
};

// #endregion

// #region @Object.keyOf

/**
 * 返回对象中指定值对应的第一个键。
 * @param {Object} obj 要搜索的对象。
 * @param {Object} value 要查找的值。
 * @returns {String} 返回匹配的第一个键，如果不存在返回 null。
 * @example Object.keyOf({a:1, b:1}, 1) // "a"
 */
Object.keyOf = function (obj, value) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] === value) {
            return key;
        }
    }
    return null;
};

// #endregion

// #region @Object.insertBefore

/**
 * 在对象指定键之前插入一个键值对。
 * @param {Object} obj 要插入的对象。
 * @param {String} refKey 插入的位置。新键值对将插入在指定的键前。如果指定键不存在则插入到末尾。
 * @param {String} newKey 新插入的键。
 * @param {Object} newValue 新插入的值。
 * @returns {Object} 返回 @obj。Function.getSour
 * @example Object.insertBefore({a:1}, 'a', 'b', 2) // {b:2, a: 1}
 */
Object.insertBefore = function (obj, refKey, newKey, newValue) {
    typeof console === "object" && console.assert(obj, "Object.insertBefore(obj: 不能为空, refKey, newKey, newValue)");
    var tmpObj = {}, foundKey = false;
    for (var key in obj) {
        if (key === refKey) foundKey = true;
        if (foundKey) {
            tmpObj[key] = obj[key];
            delete obj[key];
        }
    }
    obj[newKey] = newValue;
    for (var key in tmpObj) {
        obj[key] = tmpObj[key];
    }
    return obj;
};

// #endregion

// #region @Object.filter

/**
 * 将指定数组或对象中符合要求的项组成一个新数组。
 * @param {Object} iterable 要遍历的数组或对象（函数除外）。
 * @param {Function} fn 用于判断每一项是否符合要求的函数。函数的参数依次为:
 * 
 * * @param {Object} value 当前项的值。
 * * @param {Number} index 当前项的索引。
 * * @param {Array} array 当前正在遍历的数组。
 * * @returns {Boolean} 返回 @true 说明当前元素符合条件，否则不符合。
 * 
 * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
 * @returns {Object} 返回一个新数组或对象。
 * @example 
 * Object.filter([1, 2], function(v){return v > 1;}) // [2]
 * 
 * Object.filter({a:1, b:2}, function(v){return v > 1;}) // {b:2}
 */
Object.filter = function (iterable, fn, scope) {
    typeof console === "object" && console.assert(fn instanceof Function, "Object.filter(iterable, fn: 必须是函数, [scope])");

    var target;

    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable instanceof Array) {
        target = [];
        for (var i = 0, length = iterable.length; i < length; i++) {
            if ((i in this) && fn.call(scope, iterable[i], i, iterable)) {
                target.push(iterable[i]);
            }
        }
    } else {
        target = {};
        for (var i in iterable) {
            if (fn.call(scope, iterable[i], i, iterable)) {
                target[i] = iterable[i];
            }
        }
    }

    // 返回目标。
    return target;
}

// #endregion

// #region @Object.map

/**
 * 对指定数组或对象每一项进行处理，并将结果组成一个新数组。
 * @param {Object} iterable 要遍历的数组或对象（函数除外）。
 * @param {Function} fn 用于处理每一项的函数。函数的参数依次为:
 *
 * * @param {Object} value 当前项的值。
 * * @param {Number} index 当前项的索引。
 * * @param {Array} array 当前正在遍历的数组。
 * * @returns {Object} 返回处理后的新值，这些新值将组成结构数组。
 * 
 * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
 * @returns {Object} 返回一个新数组或对象。
 * @example
 * Object.map(["a","b"], function(a){
 * 	  return a + a;
 * }) // ["aa", "bb"];
 * 
 * Object.map({a: "a", b: "b"}, function(a){
 * 	  return a + a
 * }) // {a: "aa", b: "bb"};
 * 
 * Object.map({length: 1, "0": "a"}, function(a){
 * 	   return a + a
 * }) // ["a"];
 */
Object.map = function (iterable, fn, scope) {
    typeof console === "object" && console.assert(fn instanceof Function, "Object.map(iterable, fn: 必须是函数, [scope])");

    var result;

    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable instanceof Array) {
        result = [];
        for (var i = 0, length = iterable.length; i < length; i++) {
            result[i] = fn.call(scope, iterable[i], i, iterable);
        }
    } else {
        result = {};
        for (var i in iterable) {
            result[i] = fn.call(scope, iterable[i], i, iterable);
        }
    }

    return result;
}

// #endregion

// #region @Object.every

/**
 * 判断指定数组或对象是否每一项都满足指定条件。
 * @param {Object} iterable 要遍历的数组或对象（函数除外）。
 * @param {Function} fn 用于判断每一项是否满足条件的回调。函数的参数依次为:
 * 
 * * @param {Object} value 当前项的值。
 * * @param {Number} index 当前项的索引。
 * * @param {Array} array 当前正在遍历的数组。
 * * @returns {Boolean} 返回 @true 说明当前元素符合条件，否则不符合。
 * 
 * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
 * @returns {Boolean} 如果全部满足条件返回 @true，否则返回 @false。
 * @example Object.every({a:1, b:9, c:9, d:0}, function(item){return item > 5}) // false
 */
Object.every = function (iterable, fn, scope) {
    typeof console === "object" && console.assert(fn instanceof Function, "Object.every(iterable, fn: 必须是函数, [scope])");

    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable instanceof Array) {
        for (var i = 0, length = iterable.length; i < length; i++) {
            if ((i in this) && fn.call(scope, iterable[i], i, iterable)) {
                return false;
            }
        }
    } else {
        for (var i in iterable) {
            if (fn.call(scope, iterable[i], i, iterable)) {
                return false;
            }
        }
    }

    // 返回目标。
    return true;
}

// #endregion

// #region @Object.some

/**
 * 判断指定数组或对象是否至少存在一项满足指定条件。
 * @param {Object} iterable 要遍历的数组或对象（函数除外）。
 * @param {Function} fn 用于判断每一项是否满足条件的回调。函数的参数依次为:
 * 
 * * @param {Object} value 当前项的值。
 * * @param {Number} index 当前项的索引。
 * * @param {Array} array 当前正在遍历的数组。
 * * @returns {Boolean} 返回 @true 说明当前元素符合条件，否则不符合。
 * 
 * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
 * @returns {Boolean} 如果至少存在一项满足条件返回 @true，否则返回 @false。
 * @example Object.some({a:1, b:9, c:9, d:0}, function(item){return item > 5}) // true。
 */
Object.some = function (iterable, fn, scope) {
    typeof console === "object" && console.assert(fn instanceof Function, "Object.some(iterable, fn: 必须是函数, [scope])");

    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable instanceof Array) {
        for (var i = 0, length = iterable.length; i < length; i++) {
            if ((i in this) && fn.call(scope, iterable[i], i, iterable)) {
                return true;
            }
        }
    } else {
        for (var i in iterable) {
            if (fn.call(scope, iterable[i], i, iterable)) {
                return true;
            }
        }
    }

    // 返回目标。
    return false;
}

// #endregion

// #region @Object.subset

/**
 * 获取对象指定键的子集。
 * @param {Object} obj 要处理的对象。
 * @param {Array} keys 要获取的键列表。
 * @returns {Object} 返回新对象。
 * @example Object.subset({a:1, b:1}, ['a']) // {a:1}
 */
Object.subset = function (obj, keys) {
    typeof console === "object" && console.assert(keys instanceof Array, "Object.subset(obj, keys: 必须是数组)");

    var result = {};
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] in obj) {
            result[keys[i]] = obj[keys[i]];
        }
    }
    return result;
}

// #endregion

// #region @Object.pick

/**
 * 获取参数中第一个不为空的值。
 * @param {Object} ... 要检测的对象。
 * @returns {Object} 返回第一个不为空的值。如果都为空则返回 @undefined。
 * @example Object.pick(undefined, null, 1) // 1
 */
Object.pick = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] != undefined) {
            return arguments[i];
        }
    }
}

// #endregion
