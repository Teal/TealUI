/**
 * @fileOverview 数组扩展。
 * @author xuld
 */

// #region @Array.parseArray

/**
 * 将一个类数组对象转为原生数组。
 * @param {Object} iterable 一个伪数组对象。
 * @param {Number} startIndex=0 转换开始的位置。
 * @return {Array} 返回新数组，其值和 *value* 一一对应。
 * @remark iterable 不支持原生的 DomList 对象。
 * @example
 * <pre>
 * // 将 arguments 对象转为数组。
 * Array.parseArray(arguments); // 返回一个数组
 *
 * // 获取数组的子集。
 * Array.parseArray([4,6], 1); // [6]
 *
 * // 处理伪数组。
 * Array.parseArray({length: 1, "0": "value"}); // ["value"]
 *
 * </pre>
 */
Array.parseArray = function (iterable, startIndex) {
    if(!iterable)
        return [];

    // [DOM Object] 。
    if(iterable.item) {
        var r = [], len = iterable.length;
        for(startIndex = startIndex || 0; startIndex < len;
        startIndex++)
            r[startIndex] = iterable[startIndex];
        return r;
    }

    // 调用 slice 实现。
    return iterable ? Array.prototype.slice.call(iterable, startIndex) : [];
};

// #endregion

// #region @Array#every

/**
 * 遍历一个数组并调用指定的函数，判断是否都满足条件。
 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
 *
 * - {Object} value 当前元素的值。
 * - {Number} index 当前元素的索引。
 * - {Array} array 当前正在遍历的数组。
 *
 * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
 * @return {Boolean} 全部满足返回 true 否则返回 false。
 */
Array.prototype.every = Array.prototype.every || function(fn, scope) {
    for (var i = 0, l = this.length; i < l; i++)
        if ((i in this) && fn.call(scope, this[i], i, this)) 
            return false;
    return true;
};

// #endregion

// #region @Array#some

/**
 * 遍历一个数组并调用指定的函数，判断是否部分满足条件。
 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
 *
 * - {Object} value 当前元素的值。
 * - {Number} index 当前元素的索引。
 * - {Array} array 当前正在遍历的数组。
 *
 * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
 * @return {Boolean} 部分满足返回 true 否则返回 false。
 */
Array.prototype.some = Array.prototype.some || function(fn, scope) {
    for (var i = 0, l = this.length; i < l; i++)
        if ((i in this) && fn.call(scope, this[i], i, this)) 
            return true;
    return false;
};

// #endregion

// #region @Array#map

/**
 * 遍历一个类数组对象并调用指定的函数，返回每次调用的返回值数组。
 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
 *
 * - {Object} value 当前元素的值。
 * - {Number} index 当前元素的索引。
 * - {Array} array 当前正在遍历的数组。
 *
 * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
 * @return {Boolean} 部分满足返回 true 否则返回 false。
 */
Array.prototype.map = Array.prototype.map || function(fn, scope) {
    var result = [];
    for (var i = 0, l = this.length; i < l; i++)
        if (i in this) result[i] = fn.call(scope, this[i], i, this);
    return result;
};

// #endregion

// #region @Array#concat

/**
 * 合并两个数组。
 * @param {Array} array 数组。
 * @return {Array} 返回新数组。
 */
Array.prototype.concat = Array.prototype.concat || function(array) {
    var arr = this.slice(0);
    arr.push.apply(arr, array);
    return arr;
};

// #endregion

// #region @Array#insert

/**
 * 将指定的值插入到当前数组的指定位置。
 * @param {Number} index 要插入的位置。索引从 0 开始。如果 *index* 大于数组的长度，则插入到末尾。
 * @param {Object} value 要插入的内容。
 * @return {Object} 返回 value。
 * @example
 * <pre>
 * ["I", "you"].insert(1, "love"); //   ["I", "love", "you"]
 * </pre>
 */
Array.prototype.insert = function (index, value) {
    this.splice(index, 0, value);
    return value;
};

// #endregion

// #region @Array#clean

/**
 * 删除数组中的空值。
 * @return {Array} 返回新数组。
 */
Array.prototype.clean = function() {
    return this.filter(function(obj){return !obj});
};

// #endregion

// #region @Array#min/Array#max

/**
 * 获取数组中的最小值。
 * @return {Number} 返回数组中的最小值。
 */
Array.prototype.min = function(){
    return Math.min.apply(null, this);
};

/**
 * 获取数组中的最大值。
 * @return {Number} 返回数组中的最大值。
 */
Array.prototype.max = function(){
    return Math.max.apply(null, this);
};

// #endregion

// #region @Array#sum

/**
 * 获取数组中的和。
 * @return {Number} 返回数组中的最大值。
 */
Array.prototype.sum = function(){
    var result = 0, i = this.length;
    while (--i >= 0) result += this[i] || 0;
    return result;
};

// #endregion

// #region @Array#avg

/**
 * 获取数组中的算术平均值。
 * @return {Number} 返回数组中的最大值。
 */
Array.prototype.avg = function () {
    var result = 0, i = this.length, c = 0;
    while (--i >= 0) {
        if (typeof this[i] === 'number') {
            result += this[i];
            c++;
        }
    }
    return c ? result / c : 0;
};

// #endregion

// #region @Array#associate

/**
 * 将数组中的值和指定的键表组合为对象。
 * @return {Number} 返回数组中的最大值。
 */
Array.prototype.associate = function(keys){
    var obj = {}, length = Math.min(this.length, keys.length);
    for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
    return obj;
};

// #endregion

// #region @Array#clear

/**
 * 清空数组。
 * @return this
 */
Array.prototype.clear = function(keys){
    this.length = 0;
    return this;
};

// #endregion

// #region @Array#pick

/**
 * 获取数组中第一个不为空的元素。
 * @return {Object} 返回结果。
 */
Array.prototype.pick = function(keys){
    for (var i = 0, l = this.length; i < l; i++)
        if (this[i] != undefined)
            return this[i];
    return null;
};

// #endregion

// #region @Array#random

/**
 * 返回数组的随机位置的值。
 * @return {Object} 返回结果。
 */
Array.prototype.random = function(){
    return this.length ? this[Math.floor(this.length * Math.random())] : null;
};

// #endregion

// #region @Array#shuffle

/**
 * 随机打乱数组的内容。
 * @return {Array} 返回结果。
 */
Array.prototype.shuffle = function(){
    for (var i = this.length; --i >= 0;){
        var temp = this[i], r = Math.floor(Math.random() * ( i + 1 ));
        this[i] = this[r];
        this[r] = temp;
    }
    return this;
};

// #endregion

// #region @Array#flatten

/**
 * 将多维数组合并为一维数组。
 * @return {Array} 返回结果。
 */
Array.prototype.flatten = function(){
    var result = [];
    for (var i = 0, l = this.length; i < l; i++)
        if (this[i] && this[i].flatten)
            result.push.apply(result, this[i].flatten());
        else
            result.push(this[i]);
    return result;
};

// #endregion

// #region @Array#checkRepeat

/**
 * 检查数组中是否存在重复值。
 * @return {Boolean} 若数组中存在重复值，则返回 true，否则返回 false。
 */
Array.prototype.checkRepeat = function(){
   for (var i = 0; i < this.length - 1; i++)
        for (var j = i + 1; j < this.length; j++)
            if (this[i] == this[j])
                return true;
    return false;
};

// #endregion

// #region @Array#sub

/**
 * 将当前数组中减去另一个数组的元素，返回剩下的元素数组。
 * @param {Array} array 数组。
 * @return {Array} 返回结果。
 */
Array.prototype.sub = function(array){
    var clone = this.slice(0),
            ln = clone.length,
            i, j, lnB;

    for (i = 0,lnB = array.length; i < lnB; i++) {
        for (j = 0; j < ln; j++) {
            if (clone[j] === array[i]) {
                clone.splice(j, 1);
                j--;
                ln--;
            }
        }
    }

    return clone;
};

// #endregion

// #region @Array#pushIf

/**
 * 如果不存在则添加。
 * @param {Array} item 元素。
 * @return {Array} 返回新长度。
 */
Array.prototype.pushIf = function(item) {
    return this.indexOf(item) < 0 ? this.push(item) : this.length;
};

// #endregion
