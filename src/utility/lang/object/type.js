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
Object.type = function (obj) {
    var types = Object["_types"];
    if (!types) {
        Object["_types"] = types = {};
        "Boolean Number String Function Array Date RegExp Object Error".replace(/\w+/g, function (typeName) { return types["[object " + typeName + "]"] = typeName.toLowerCase(); });
    }
    return obj == null ? String(obj) : types[types.toString.call(obj)] || "object";
};
