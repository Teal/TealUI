/**
 * @fileOverview 数组扩展。
 * @author xuld
 */

// #region @Array.parseArray

/**
 * 将一个类数组对象转为原生数组。
 * @param {Object} iterable 一个类数组对象。
 * @param {Number} [startIndex=0] 转换开始的位置。
 * @returns {Array} 返回新数组，其值和 @iterable 一一对应。
 * @example
 * 
 * // 将 arguments 对象转为数组。
 * Array.parseArray(arguments); // 返回一个数组
 *
 * // 获取数组的子集。
 * Array.parseArray([4,6], 1); // [6]
 *
 * // 处理伪数组。
 * Array.parseArray({length: 1, "0": "value"}); // ["value"]
 *
 */
Array.parseArray = function (iterable, startIndex) {
    if (!iterable)
        return [];

    // [DOM Object] 。
    if (iterable.item) {
        var r = [], len = iterable.length;
        for (startIndex = startIndex || 0; startIndex < len;
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
 * 判断一个数组是否每一项都满足指定条件。
 * @param {Function} fn 用于判断是否满足条件的回调。函数的参数依次为:
 * 
 * 参数名 | 类型       | 说明
 * value | `Object`  | 当前元素的值。
 * index | `Number`  | 当前元素的索引。
 * array | `Array`   | 当前正在遍历的数组。
 * 返回值 | `Boolean` | 用于确定是否满足条件。
 * 
 * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
 * @returns {Boolean} 如果全部满足条件返回 @true，否则返回 @false。
 * @example [1, 9, 9, 0].every(function(item){return item > 5}); // false
 * @since ES5
 */
Array.prototype.every = Array.prototype.every || function (fn, scope) {
    for (var i = 0, l = this.length; i < l; i++)
        if ((i in this) && fn.call(scope, this[i], i, this))
            return false;
    return true;
};

// #endregion

// #region @Array#some

/**
 * 判断一个数组是否至少存在一项满足指定条件。
 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
 * 
 * 参数名 | 类型       | 说明
 * value | `Object`  | 当前元素的值。
 * index | `Number`  | 当前元素的索引。
 * array | `Array`   | 当前正在遍历的数组。
 * 返回值 | `Boolean` | 用于确定是否满足条件。
 * 
 * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
 * @returns {Boolean} 如果至少存在一项满足条件返回 @true，否则返回 @false。
 * @example [1, 9, 9, 0].some(function(item){return item > 5}); // true
 * @since ES5
 */
Array.prototype.some = Array.prototype.some || function (fn, scope) {
    for (var i = 0, l = this.length; i < l; i++)
        if ((i in this) && fn.call(scope, this[i], i, this))
            return true;
    return false;
};

// #endregion

// #region @Array#map

/**
 * 对数组每一项进行处理，并将结果组成一个新数组。
 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
 *
 * 参数名 | 类型       | 说明
 * value | `Object`  | 当前元素的值。
 * index | `Number`  | 当前元素的索引。
 * array | `Array`   | 当前正在遍历的数组。
 * 返回值 | `Boolean` | 返回处理后的新值。
 * 
 * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
 * @returns {Array} 返回一个新数组。
 * @example [1, 9, 9, 0].map(function(item){return item + 1}); // [2, 10, 10, 1]
 * @since ES5
 */
Array.prototype.map = Array.prototype.map || function (fn, scope) {
    var result = [];
    for (var i = 0, l = this.length; i < l; i++)
        if (i in this) result[i] = fn.call(scope, this[i], i, this);
    return result;
};

// #endregion

// #region @Array#concat

/**
 * 合并两个数组。
 * @param {Array} array 要合并的数组。
 * @returns {Array} 返回新数组。
 * @example ["I", "love"].concat("you"); // ["I", "love", "you"]
 * @since ES4
 */
Array.prototype.concat = Array.prototype.concat || function (array) {
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
 * @returns {Object} 返回 *value*。
 * @example ["I", "you"].insert(1, "love"); // ["I", "love", "you"]
 */
Array.prototype.insert = function (index, value) {
    this.splice(index, 0, value);
    return value;
};

// #endregion

// #region @Array#clean

/**
 * 删除数组中值为 @false 的值。
 * @returns {Array} 返回过滤后的新数组。
 * @example ["", false, 0, undefined, null, {}].clean(); // [{}]
 */
Array.prototype.clean = function () {
    return this.filter(function (obj) { return !obj });
};

// #endregion

// #region @Array#min/Array#max

/**
 * 计算数组中所有项的最小值。
 * @returns {Number} 返回数组中所有项的最小值。
 * @example [1, 2].min() // 1
 */
Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

/**
 * 计算数组中所有项的最大值。
 * @returns {Number} 返回数组中所有项的最大值。
 * @example [1, 2].max() // 2
 */
Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

// #endregion

// #region @Array#sum

/**
 * 计算数组中所有数值的和。
 * @returns {Number} 返回数组中所有数值的和。
 * @example [1, 2].sum() // 3
 */
Array.prototype.sum = function () {
    var result = 0, i = this.length;
    while (--i >= 0) result += this[i] || 0;
    return result;
};

// #endregion

// #region @Array#avg

/**
 * 计算数组中所有数值的算术平均值。
 * @returns {Number} 返回数组中所有数值的算术平均值。
 * @example [1, 2].avg() // 1.5
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
 * @param {Array} keys 要匹配的键名。
 * @returns {Object} 返回数组和指定键组成的键值对。
 * @example [1, 2].associate(["a", "b"]) // {a: 1, b: 2}
 */
Array.prototype.associate = function (keys) {
    var obj = {}, length = Math.min(this.length, keys.length);
    for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
    return obj;
};

// #endregion

// #region @Array#clear

/**
 * 清空数组所有项。
 * @returns this
 * @example [1, 2].clear() // []
 */
Array.prototype.clear = function () {
    this.length = 0;
    return this;
};

// #endregion

// #region @Array#pick

/**
 * 获取数组中第一个不为空的元素。
 * @returns {Object} 返回不为空的元素，如果所有元素都为空则返回 **undefined**。
 * @example [undefined, null, 1, 2].pick() // 1
 */
Array.prototype.pick = function () {
    for (var i = 0, l = this.length; i < l; i++)
        if (this[i] != undefined)
            return this[i];
};

// #endregion

// #region @Array#random

/**
 * 随机获取数组中的任意一项。
 * @returns {Object} 返回找到的项。如果数组为空，为返回 **undefined**。
 * @example [1, 2, 3].random()
 */
Array.prototype.random = function () {
    return this[Math.floor(this.length * Math.random())];
};

// #endregion

// #region @Array#shuffle

/**
 * 随机打乱数组的内容。
 * @returns this
 * @example [1, 2, 3].shuffle()
 */
Array.prototype.shuffle = function () {
    for (var i = this.length; --i >= 0;) {
        var temp = this[i], r = Math.floor(Math.random() * (i + 1));
        this[i] = this[r];
        this[r] = temp;
    }
    return this;
};

// #endregion

// #region @Array#flatten

/**
 * 将多维数组合并为一维数组。
 * @returns {Array} 返回新数组。
 * @example [[1, 2], [[[3]]]].flatten() // [1, 2, 3]
 */
Array.prototype.flatten = function () {
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
 * 判断数组中是否存在重复项。
 * @returns {Boolean} 若数组中存在重复值，则返回 @true，否则返回 @false。
 * @example 
 * [1, 9, 0].isUnique() // false
 * [1, 9, 9, 0].isUnique() // true
 */
Array.prototype.isUnique = function () {
    for (var i = 0; i < this.length - 1; i++)
        for (var j = i + 1; j < this.length; j++)
            if (this[i] == this[j])
                return true;
    return false;
};

// #endregion

// #region @Array#sub

/**
 * 从当前数组中删除另一个数组的所有元素，返回剩下的元素组成的新数组。
 * @param {Array} array 被除去的元素数组。
 * @returns {Array} 返回新数组。
 * @example [1, 2].sub([1]) // [2]
 */
Array.prototype.sub = function (array) {
    var clone = this.slice(0),
            ln = clone.length,
            i, j, lnB;

    for (i = 0, lnB = array.length; i < lnB; i++) {
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
 * 如果当前数组中不存在项则添加到数组末尾。
 * @param {Array} item 元素。
 * @returns {Boolean} 如果已新增则返回 @true，否则返回 @false。
 * @example 
 * [1, 9, 0].pushIf(1) // [1, 9, 0]
 * [1, 9, 0].pushIf(2) // [1, 9, 0, 2]
 */
Array.prototype.pushIf = function (item) {
    return this.indexOf(item) < 0 ? this.push(item) > 0 : false;
};

// #endregion
