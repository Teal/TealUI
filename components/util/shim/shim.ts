import "./promise-shim";

/**
 * 把源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。
 * @param target 目标对象。
 * @param source 源对象。
 * @example assign({a: 1}, {a: 2}) // {a: 2}
 * @example assign({a: 1}, {b: 2}) // {a: 1, b: 2}
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
Object.assign = Object.assign || function (target: any, source: any) {
    for (const key in source) {
        target[key] = source[key];
    }
    return target;
};
