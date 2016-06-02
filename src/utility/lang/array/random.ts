// #todo


interface Array<T> {

}

/**
 * 随机获取数组中的任意一项。
 * @returns {Object} 返回找到的项。如果数组为空，则返回 @undefined。
 * @example [1, 2, 3].random()
 */
Array.prototype.random = function () {
    return this[Math.floor(this.length * Math.random())];
};
