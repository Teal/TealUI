/**
 * 深拷贝一个对象，返回和原对象无引用关系的副本。
 * @param obj 要复制的对象。
 * @returns 返回新对象。
 * @remark
 * > 注意：出于性能考虑，`Object.clone` 不会深拷贝函数和正则表达式。
 * @example Object.clone({a: 3, b: [5]}) // {a: 3, b: [5]}
 */
Object.clone = function (obj) {
    if (obj && typeof obj === 'object') {
        if (obj instanceof Array) {
            var newObj = [];
            for (var i = 0; i < obj.length; i++) {
                newObj[i] = Object.clone(obj[i]);
            }
            obj = newObj;
        }
        else if (obj instanceof Date) {
            obj = new Date(+obj);
        }
        else if (!(obj instanceof RegExp)) {
            var newObj = {};
            for (var i in obj) {
                newObj[i] = Object.clone(obj[i]);
            }
            obj = newObj;
        }
    }
    return obj;
};
