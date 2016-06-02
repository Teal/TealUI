// #todo


interface Array<T> {

}

/**
 * 如果当前数组中不存在项则添加到数组末尾。
 * @param {Array} item 元素。
 * @returns {Boolean} 如果已新增则返回 @true，否则返回 @false。
 * @example 
 * [1, 9, 0].pushIf(1) // [1, 9, 0]
 * 
 * [1, 9, 0].pushIf(2) // [1, 9, 0, 2]
 */
Array.prototype.pushIf = function (item) {
    return this.indexOf(item) < 0 ? this.push(item) > 0 : false;
};
