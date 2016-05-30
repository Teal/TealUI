
interface Array<T> {

    /**
     * 将数组中的值和指定的键一一配对为新对象。
     * @param keys 要匹配的键名。
     * @returns 返回数组和指定键组成的键值对。
     * @example [1, 2].associate(["a", "b"]) // {a: 1, b: 2}
     */
    associate(keys: string[]): { [key: string]: T };
}

/**
 * 将数组中的值和指定的键一一配对为新对象。
 * @param keys 要匹配的键名。
 * @returns 返回数组和指定键组成的键值对。
 * @example [1, 2].associate(["a", "b"]) // {a: 1, b: 2}
 */
Array.prototype.associate = function (keys) {
    let result = {};
    for (let i = 0, length = Math.min(this.length, keys.length); i < length; i++) {
        result[keys[i]] = this[i];
    }
    return result;
};
