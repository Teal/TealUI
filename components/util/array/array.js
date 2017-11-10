define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 创建一个等差数列组成的数组。
     * @param start 开始的数值。
     * @param end 结束的数值（不包含此数值）。
     * @param step 相邻数值的增幅。
     * @return 返回一个新数组。
     * @example range(0, 6) // [0, 1, 2, 3, 4, 5]
     * @example range(2, 11, 3) // [2, 5, 8]
     */
    function range(start, end, step) {
        if (step === void 0) { step = 1; }
        var r = [];
        for (; start < end; start += step) {
            r.push(start);
        }
        return r;
    }
    exports.range = range;
    /**
     * 如果数组中不存在项则添加到数组末尾。
     * @param arr 数组。
     * @param item 要添加的项。
     * @return 如果已添加到数组则返回 true，否则返回 false。
     * @example pushIf(1, 9, 0], 1) // 数组变成 [1, 9, 0]
     * @example pushIf([1, 9, 0], 2) // 数组变成 [1, 9, 0, 2]
     */
    function pushIf(arr, item) {
        return arr.indexOf(item) < 0 && arr.push(item) > 0;
    }
    exports.pushIf = pushIf;
    /**
     * 在数组的指定索引插入项。
     * @param arr 数组。
     * @param index 要插入的索引（从 0 开始）。如果索引超出数组的长度，则插入到末尾。
     * @param item 要插入的项。
     * @example insert(["I", "you"], 1, "love") // 数组变成 ["I", "love", "you"]
     */
    function insert(arr, index, item) {
        arr.splice(index, 0, item);
    }
    exports.insert = insert;
    /**
     * 删除数组中指定的项。如果有多个匹配则只删除第一项。
     * @param arr 数组。
     * @param item 要删除的项。
     * @param startIndex 开始搜索的索引（从 0 开始）。
     * @return 返回被删除的项在原数组中的索引。如果数组中找不到指定的项则返回 -1。
     * @example remove([1, 9, 9, 0], 9) // 1, 数组变成 [1, 9, 0]
     * @example while(remove(arr, "wow") >= 0) // 删除所有 "wow"。
     */
    function remove(arr, item, startIndex) {
        startIndex = arr.indexOf(item, startIndex);
        ~startIndex && arr.splice(startIndex, 1);
        return startIndex;
    }
    exports.remove = remove;
    /**
     * 删除数组中指定的项。如果有多个匹配则全部删除。
     * @param arr 数组。
     * @param item 要删除的项。
     * @param startIndex 开始搜索的索引（从 0 开始）。
     * @example removeAll([1, 9, 9, 0], 9) // 数组变成 [1, 0]
     */
    function removeAll(arr, item, startIndex) {
        var index = startIndex;
        while ((index = remove(arr, item, index)) >= 0)
            ;
    }
    exports.removeAll = removeAll;
    /**
     * 删除数组中转为布尔值后为 false 的项。
     * @param arr 数组。
     * @example clean(["", false, 0, undefined, null, {}]) // 数组变成 [{}]
     */
    function clean(arr) {
        for (var i = arr.length; --i >= 0;) {
            if (!arr[i]) {
                arr.splice(i, 1);
            }
        }
    }
    exports.clean = clean;
    /**
     * 清空数组的所有项。
     * @param arr 数组。
     * @example clear([1, 2]) // 数组变成 []
     */
    function clear(arr) {
        arr.length = 0;
    }
    exports.clear = clear;
    /**
     * 交换数组中的两个项。
     * @param arr 数组。
     * @param x 要交换的第一个项的索引。
     * @param y 要交换的第二个项的索引。
     * @example swap([1, 2, 3], 1, 2)
     */
    function swap(arr, x, y) {
        var t = arr[x];
        arr[x] = arr[y];
        arr[y] = t;
    }
    exports.swap = swap;
    /**
     * 根据指定的规则排序。
     * @param arr 数组。
     * @param keys 排序的所有规则。规则可以是一个键名或自定义取值的函数。
     * @example sortBy([{ "user": "fred" }, { "user": "bred" }], o => o.user) // [{ "user": "bred" }, { "user": "fred" }]
     * @example sortBy([{ "user": "fred" }, { "user": "bred" }], "user") // [{ "user": "bred" }, { "user": "fred" }]
     */
    function sortBy(arr) {
        var keys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            keys[_i - 1] = arguments[_i];
        }
        arr.sort(function (x, y) {
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var valueX = typeof key === "function" ? key(x) : x[key];
                var valueY = typeof key === "function" ? key(y) : y[key];
                if (valueX > valueY) {
                    return 1;
                }
                if (valueX < valueY) {
                    return -1;
                }
            }
            return 0;
        });
    }
    exports.sortBy = sortBy;
    /**
     * 根据指定的规则倒排。
     * @param arr 数组。
     * @param keys 排序的所有规则。规则可以是一个键名或自定义取值的函数。
     * @example sortByDesc([{ "user": "bred" }, { "user": "fred" }], o => o.user) // [{ "user": "fred" }, { "user": "bred" }]
     * @example sortByDesc([{ "user": "bred" }, { "user": "fred" }], "user") // [{ "user": "fred" }, { "user": "bred" }]
     */
    function sortByDesc(arr) {
        var keys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            keys[_i - 1] = arguments[_i];
        }
        return arr.sort(function (x, y) {
            for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                var item_1 = keys_2[_i];
                var valueX = typeof item_1 === "function" ? item_1(x) : x[item_1];
                var valueY = typeof item_1 === "function" ? item_1(y) : y[item_1];
                if (valueX > valueY) {
                    return -1;
                }
                if (valueX < valueY) {
                    return 1;
                }
            }
            return 0;
        });
    }
    exports.sortByDesc = sortByDesc;
    /**
     * 将数组的项按指定规则分组。
     * @param arr 数组。
     * @param key 分组的规则。规则可以是一个键名或自定义取值的函数。
     * @example groupBy([{a: 1}, {a: 1}, {a: 2}], "a") // [{key: 1, length: 2, 0: {a: 1}, 1: {a: 1}}, {key: 2, length: 1, 0: {a: 1}}]
     */
    function groupBy(arr, key) {
        var r = [];
        next: for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var item_2 = arr_1[_i];
            var groupKey = typeof key === "function" ? key(item_2) : item_2[key];
            for (var _a = 0, r_1 = r; _a < r_1.length; _a++) {
                var v = r_1[_a];
                if (v.key === groupKey) {
                    v.push(item_2);
                    continue next;
                }
            }
            var arr2 = [item_2];
            arr2.key = groupKey;
            r.push(arr2);
        }
        return r;
    }
    exports.groupBy = groupBy;
    /**
     * 将数组的项按指定规则分组然后统计每个分组的项数。
     * @param arr 数组。
     * @param key 分组的规则。规则可以是一个键名或自定义取值的函数。
     * @example countBy([{a: 1}, {a: 1}, {a: 2}], "a") // {1: 2, 2: 1}
     */
    function countBy(arr, key) {
        var r = {};
        for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
            var item_3 = arr_2[_i];
            var groupKey = typeof key === "function" ? key(item_3) : item_3[key];
            r[groupKey] = r[groupKey] + 1 || 1;
        }
        return r;
    }
    exports.countBy = countBy;
    /**
     * 将数组等分成多个子数组。
     * @param arr 数组。
     * @param count 每个子数组的长度。
     * @param maxCount 最多允许拆分的组数。如果超出限制后则剩余的项全部添加到最后一个子数组中。
     * @return 返回一个二维数组。
     * @example split([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
     */
    function split(arr, count, maxCount) {
        if (count === void 0) { count = 1; }
        var r = [];
        for (var i = 0; i < arr.length;) {
            if (maxCount > 0 && r.length >= maxCount) {
                r.push(arr.slice(i));
                break;
            }
            r.push(arr.slice(i, i += count));
        }
        return r;
    }
    exports.split = split;
    /**
     * 将数组中的项随机打乱。
     * @param arr 数组。
     * @example shuffle([1, 2, 3])
     */
    function shuffle(arr) {
        var index = arr.length;
        while (index > 0) {
            var target = Math.floor(Math.random() * index);
            var value = arr[--index];
            arr[index] = arr[target];
            arr[target] = value;
        }
    }
    exports.shuffle = shuffle;
    /**
     * 随机获取数组中的任一项。
     * @param arr 数组。
     * @return 返回某一项。如果数组为空则返回 undefined。
     * @example random([1, 2, 3])
     */
    function random(arr) {
        return arr[Math.floor(arr.length * Math.random())];
    }
    exports.random = random;
    /**
     * 获取数组中指定索引的项。
     * @param arr 数组。
     * @param index 要获取的索引（从 0 开始）。如果值为负数，则获取倒数的项。
     * @return 返回指定索引的项。
     * @example item(["a", "b"], -1) // "b"
     */
    function item(arr, index) {
        return arr[index < 0 ? arr.length + index : index];
    }
    exports.item = item;
    /**
     * 获取数组中第一个不为空的项。
     * @param arr 数组。
     * @return 返回第一个不为空的项，如果所有项都为空则返回 undefined。
     * @example pick([undefined, null, 1, 2]) // 1
     */
    function pick(arr) {
        for (var _i = 0, arr_3 = arr; _i < arr_3.length; _i++) {
            var value = arr_3[_i];
            if (value != undefined) {
                return value;
            }
        }
    }
    exports.pick = pick;
    /**
     * 计算指定项在数组中出现的次数。
     * @param arr 数组。
     * @param item 要查找的项。
     * @param startIndex 开始查找的索引（从 0 开始）。
     * @param endIndex 结束查找的索引（从 0 开始，不含）。
     * @return 返回项出现的次数。
     * @example count(["a", "b"], "a") // 1
     */
    function count(arr, item, startIndex, endIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        if (endIndex === void 0) { endIndex = arr.length; }
        var r = 0;
        for (; startIndex < endIndex; startIndex++) {
            if (arr[startIndex] === item) {
                r++;
            }
        }
        return r;
    }
    exports.count = count;
    /**
     * 判断数组中是否存在重复项。
     * @param arr 数组。
     * @return 若数组中存在重复项则返回 true，否则返回 false。
     * @example isUnique([1, 9, 0]) // true
     * @example isUnique([1, 9, 9, 0]) // false
     */
    function isUnique(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            if (~arr.indexOf(arr[i - 1], i)) {
                return false;
            }
        }
        return true;
    }
    exports.isUnique = isUnique;
    /**
     * 删除数组中的重复项并返回新数组。
     * @param arr 数组。
     * @return 返回过滤后的新数组。
     * @example [1, 9, 9, 0].unique() // [1, 9, 0]
     */
    function unique(arr) {
        var r = [];
        for (var _i = 0, arr_4 = arr; _i < arr_4.length; _i++) {
            var value = arr_4[_i];
            r.indexOf(value) < 0 && r.push(value);
        }
        return r;
    }
    exports.unique = unique;
    /**
     * 将多维数组合并为一维数组。
     * @param arr 数组。
     * @return 返回新数组。
     * @example flatten([[1, 2], [[[3]]]]) // [1, 2, 3]
     */
    function flatten(arr) {
        var r = [];
        for (var _i = 0, arr_5 = arr; _i < arr_5.length; _i++) {
            var value = arr_5[_i];
            value && value instanceof Array ? r.push.apply(r, flatten(value)) : r.push(value);
        }
        return r;
    }
    exports.flatten = flatten;
    /**
     * 从数组中删除另一个数组的所有项，返回剩下的项组成的新数组。
     * @param arr 数组。
     * @param other 需要被删除的项数组。
     * @return 返回新数组。
     * @example sub([1, 2], [1]) // [2]
     */
    function sub(arr, other) {
        var r = [];
        for (var i = arr.length; --i >= 0;) {
            ~other.indexOf(arr[i]) || r.push(arr[i]);
        }
        return r;
    }
    exports.sub = sub;
    /**
     * 计算所有数组的并集。
     * @param arrs 要合并的所有数组。
     * @return 返回所有数组中出现过的元素组成的无重复项的新数组。
     * @example union([1, 2], [1]) // [1, 2]
     */
    function union() {
        var arrs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arrs[_i] = arguments[_i];
        }
        var r = [];
        for (var _a = 0, arrs_1 = arrs; _a < arrs_1.length; _a++) {
            var arr = arrs_1[_a];
            for (var _b = 0, arr_6 = arr; _b < arr_6.length; _b++) {
                var item_4 = arr_6[_b];
                if (r.indexOf(item_4) < 0) {
                    r.push(item_4);
                }
            }
        }
        return r;
    }
    exports.union = union;
    /**
     * 计算所有数组的交集。
     * @param arrs 要取交集的所有数组。
     * @return 返回所有数组中公共元素组成的无重复项的新数组。
     * @example intersect([1, 2, 3], [101, 2, 1, 10], [2, 1]) // [1, 2]
     */
    function intersect() {
        var arrs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arrs[_i] = arguments[_i];
        }
        var r = [];
        if (arrs.length) {
            next: for (var _a = 0, _b = arrs[0]; _a < _b.length; _a++) {
                var item_5 = _b[_a];
                for (var j = 1; j < arrs.length; j++) {
                    if (arrs[j].indexOf(item_5) < 0) {
                        continue next;
                    }
                }
                r.push(item_5);
            }
        }
        return r;
    }
    exports.intersect = intersect;
    /**
     * 计算数组的全排列结果。
     * @param arr 数组。
     * @return 返回一个新数组，其每一项都是一种排列方式。
     * @example permute([1, 2, 3]) // [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
     */
    function permute(arr) {
        var r = [];
        var usedItems = [];
        var next = function (input) {
            for (var i = 0; i < input.length; i++) {
                var item_6 = input.splice(i, 1)[0];
                usedItems.push(item_6);
                if (input.length == 0) {
                    r.push(usedItems.slice(0));
                }
                next(input);
                input.splice(i, 0, item_6);
                usedItems.pop();
            }
        };
        next(arr);
        return r;
    }
    exports.permute = permute;
    /**
     * 根据指定的规则选择项。
     * @param arr 数组。
     * @param key 选择的规则。规则可以是一个键名或自定义取值的函数。
     * @return 返回选择的结果组成的新数组。
     * @example select([{"user": "fred"}, {"banch": "bred"}], o => o.user) // ["fred"]
     * @example select([{"user": "fred"}, {"banch": "bred"}], "user") // ["fred"]
     */
    function select(arr, key) {
        var r = [];
        for (var _i = 0, arr_7 = arr; _i < arr_7.length; _i++) {
            var item_7 = arr_7[_i];
            r.push(typeof key === "function" ? key(item_7) : item_7[key]);
        }
        return r;
    }
    exports.select = select;
    /**
     * 调用数组每一项的成员函数。
     * @param arr 数组。
     * @param fnName 要调用的成员函数名。
     * @param args 调用的所有参数。
     * @return 返回所有调用结果组成的新数组。
     * @example invoke(["Teal", "UI"], "length") // [4, 2]
     */
    function invoke(arr, fnName) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var r = [];
        for (var _a = 0, arr_8 = arr; _a < arr_8.length; _a++) {
            var value = arr_8[_a];
            var item_8 = value[fnName];
            if (typeof item_8 === "function") {
                item_8 = item_8.apply(value, args);
            }
            r.push(item_8);
        }
        return r;
    }
    exports.invoke = invoke;
    /**
     * 将数组中的项分别和指定的键组合为对象。
     * @param arr 数组。
     * @param keys 键列表。
     * @return 返回数组和指定键组成的键值对。
     * @example associate([1, 2], ["a", "b"]) // { a: 1, b: 2 }
     */
    function associate(arr, keys) {
        var r = {};
        var length = Math.min(arr.length, keys.length);
        for (var i = 0; i < length; i++) {
            r[keys[i]] = arr[i];
        }
        return r;
    }
    exports.associate = associate;
    /**
     * 在已排序的数组中二分查找指定的项。
     * @param arr 数组。
     * @param value 要查找的项。
     * @param compareFn 用于排序时确定优先级的函数。函数接收以下参数：
     * - x：要比较的第一个参数。
     * - y：要比较的第二个参数。
     *
     * 如果返回 true，则说明 *x* 应该排在 *y* 之前。否则 *x* 应该排在 *y* 之后。
     * @param start 开始查找的索引（从 0 开始）。
     * @param end 结束查找的索引（从 0 开始）。
     * @example binarySearch([1, 2, 3, 4, 5], 3) // 2
     */
    function binarySearch(arr, value, compareFn, start, end) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = arr.length; }
        while (start < end) {
            var middle = Math.floor((start + end) / 2);
            if (compareFn ? compareFn(arr[middle], value) < 0 : arr[middle] < value)
                start = middle + 1;
            else
                end = middle;
        }
        return start;
    }
    exports.binarySearch = binarySearch;
    /**
     * 计算数组中所有项的最小值。
     * @param arr 数组。
     * @return 返回数组中所有项的最小值。如果数组为空则返回 Infinity。
     * @example min([1, 2]) // 1
     */
    function min(arr) {
        return Math.min.apply(Math, arr);
    }
    exports.min = min;
    /**
     * 计算数组中所有项的最大值。
     * @param arr 数组。
     * @return 返回数组中所有项的最大值。如果数组为空则返回 -Infinity。
     * @example max([1, 2]) // 2
     */
    function max(arr) {
        return Math.max.apply(Math, arr);
    }
    exports.max = max;
    /**
     * 计算数组中所有项的和。
     * @param arr 数组。
     * @return 返回数组中所有数值的和。计算时将忽略非数字的项。如果数组为空则返回 0。
     * @example sum([1, 2]) // 3
     */
    function sum(arr) {
        var r = 0;
        var i = arr.length;
        while (--i >= 0) {
            r += +arr[i] || 0;
        }
        return r;
    }
    exports.sum = sum;
    /**
     * 计算数组中所有项的算术平均值。
     * @param arr 数组。
     * @return 返回数组中所有数值的算术平均值。计算时将忽略非数字的项。如果数组为空则返回 0。
     * @example avg([1, 2]) // 1.5
     */
    function avg(arr) {
        var sum = 0;
        var c = 0;
        var i = arr.length;
        while (--i >= 0) {
            if (arr[i] === 0 || +arr[i]) {
                sum += +arr[i];
                c++;
            }
        }
        return c ? sum / c : 0;
    }
    exports.avg = avg;
});
//# sourceMappingURL=array.js.map