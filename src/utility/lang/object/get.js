/**
 * 设置对象指定属性的值。
 * @param obj 要获取的对象。
 * @param prop 要获取的属性表达式。如 `a.b[0]`。
 * @returns 返回属性值。如果属性不存在则返回 undefined。
 * @example Object.get({a: {b: 1}}, "a.b") // 1
 */
Object.get = function (obj, prop) {
    prop.replace(/\.?\s*([^\.\[]+)|\[\s*([^\]]*)\s*\]/g, function (_, propName, indexer) {
        if (obj)
            obj = obj[propName || indexer];
        return "";
    });
    return obj;
};
