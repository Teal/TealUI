/**
 * 返回第一个不为空的值。
 * @param objs 要检测的对象。
 * @returns 返回第一个不为空的值。如果都为空则返回 undefined。
 * @example Object.pick(undefined, null, 1) // 1
 */
Object.pick = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] != undefined) {
            return arguments[i];
        }
    }
};
