/**
 * 创建一个等差数列组成的数组。
 * @param start 开始的数值。
 * @param end 结束的数值（不包含此数值）。
 * @param step 相邻数值的增幅。
 * @return 返回一个新数组。
 * @example range(0, 6) // [0, 1, 2, 3, 4, 5]
 * @example range(2, 11, 3) // [2, 5, 8]
 */
export function range(start: number, end: number, step = 1) {
    const r: number[] = [];
    for (; start < end; start += step) {
        r.push(start);
    }
    return r;
}

/**
 * 如果数组中不存在项则添加到数组末尾。
 * @param arr 数组。
 * @param item 要添加的项。
 * @return 如果已添加到数组则返回 true，否则返回 false。
 * @example pushIf(1, 9, 0], 1) // 数组变成 [1, 9, 0]
 * @example pushIf([1, 9, 0], 2) // 数组变成 [1, 9, 0, 2]
 */
export function pushIf<T>(arr: T[], item: T) {
    return arr.indexOf(item) < 0 && arr.push(item) > 0;
}

/**
 * 在数组的指定索引插入项。
 * @param arr 数组。
 * @param index 要插入的索引（从 0 开始）。如果索引超出数组的长度，则插入到末尾。
 * @param item 要插入的项。
 * @example insert(["I", "you"], 1, "love") // 数组变成 ["I", "love", "you"]
 */
export function insert<T>(arr: T[], index: number, item: T) {
    arr.splice(index, 0, item);
}

/**
 * 删除数组中指定的项。如果有多个匹配则只删除第一项。
 * @param arr 数组。
 * @param item 要删除的项。
 * @param startIndex 开始搜索的索引（从 0 开始）。
 * @return 返回被删除的项在原数组中的索引。如果数组中找不到指定的项则返回 -1。
 * @example remove([1, 9, 9, 0], 9) // 1, 数组变成 [1, 9, 0]
 * @example while(remove(arr, "wow") >= 0) // 删除所有 "wow"。
 */
export function remove<T>(arr: T[], item: T, startIndex?: number) {
    startIndex = arr.indexOf(item, startIndex);
    ~startIndex && arr.splice(startIndex, 1);
    return startIndex;
}

/**
 * 删除数组中指定的项。如果有多个匹配则全部删除。
 * @param arr 数组。
 * @param item 要删除的项。
 * @param startIndex 开始搜索的索引（从 0 开始）。
 * @example removeAll([1, 9, 9, 0], 9) // 数组变成 [1, 0]
 */
export function removeAll<T>(arr: T[], item: T, startIndex?: number) {
    let index = startIndex;
    while ((index = remove(arr, item, index)) >= 0);
}

/**
 * 删除数组中转为布尔值后为 false 的项。
 * @param arr 数组。
 * @example clean(["", false, 0, undefined, null, {}]) // 数组变成 [{}]
 */
export function clean<T>(arr: T[]) {
    for (let i = arr.length; --i >= 0;) {
        if (!arr[i]) {
            arr.splice(i, 1);
        }
    }
}

/**
 * 清空数组的所有项。
 * @param arr 数组。
 * @example clear([1, 2]) // 数组变成 []
 */
export function clear<T>(arr: T[]) {
    arr.length = 0;
}

/**
 * 交换数组中的两个项。
 * @param arr 数组。
 * @param x 要交换的第一个项的索引。
 * @param y 要交换的第二个项的索引。
 * @example swap([1, 2, 3], 1, 2)
 */
export function swap<T>(arr: T[], x: number, y: number) {
    const t = arr[x];
    arr[x] = arr[y];
    arr[y] = t;
}

/**
 * 根据指定的规则排序。
 * @param arr 数组。
 * @param keys 排序的所有规则。规则可以是一个键名或自定义取值的函数。
 * @example sortBy([{ "user": "fred" }, { "user": "bred" }], o => o.user) // [{ "user": "bred" }, { "user": "fred" }]
 * @example sortBy([{ "user": "fred" }, { "user": "bred" }], "user") // [{ "user": "bred" }, { "user": "fred" }]
 */
export function sortBy<T>(arr: T[], ...keys: (((item: T) => any) | keyof T)[]) {
    arr.sort((x, y) => {
        for (const key of keys) {
            const valueX = typeof key === "function" ? (key as (item: T) => any)(x) : x[key];
            const valueY = typeof key === "function" ? (key as (item: T) => any)(y) : y[key];
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

/**
 * 根据指定的规则倒排。
 * @param arr 数组。
 * @param keys 排序的所有规则。规则可以是一个键名或自定义取值的函数。
 * @example sortByDesc([{ "user": "bred" }, { "user": "fred" }], o => o.user) // [{ "user": "fred" }, { "user": "bred" }]
 * @example sortByDesc([{ "user": "bred" }, { "user": "fred" }], "user") // [{ "user": "fred" }, { "user": "bred" }]
 */
export function sortByDesc<T>(arr: T[], ...keys: (((item: T) => any) | keyof T)[]) {
    return arr.sort((x, y) => {
        for (const item of keys) {
            const valueX = typeof item === "function" ? (item as (item: T) => any)(x) : x[item];
            const valueY = typeof item === "function" ? (item as (item: T) => any)(y) : y[item];
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

/**
 * 将数组的项按指定规则分组。
 * @param arr 数组。
 * @param key 分组的规则。规则可以是一个键名或自定义取值的函数。
 * @example groupBy([{a: 1}, {a: 1}, {a: 2}], "a") // [{key: 1, length: 2, 0: {a: 1}, 1: {a: 1}}, {key: 2, length: 1, 0: {a: 1}}]
 */
export function groupBy<T>(arr: T[], key: ((item: T) => any) | keyof T) {
    const r: (T[] & { key: any })[] = [];
    next: for (const item of arr) {
        const groupKey = typeof key === "function" ? (key as ((item: T) => any))(item) : item[key];
        for (const v of r) {
            if (v.key === groupKey) {
                v.push(item);
                continue next;
            }
        }
        const arr2 = [item] as typeof r[0];
        arr2.key = groupKey;
        r.push(arr2);
    }
    return r;
}

/**
 * 将数组的项按指定规则分组然后统计每个分组的项数。
 * @param arr 数组。
 * @param key 分组的规则。规则可以是一个键名或自定义取值的函数。
 * @example countBy([{a: 1}, {a: 1}, {a: 2}], "a") // {1: 2, 2: 1}
 */
export function countBy<T>(arr: T[], key: ((item: T) => any) | keyof T) {
    const r: { [key: string]: number } = {};
    for (const item of arr) {
        const groupKey = typeof key === "function" ? (key as ((item: T) => any))(item) : item[key];
        r[groupKey] = r[groupKey] + 1 || 1;
    }
    return r;
}

/**
 * 将数组等分成多个子数组。
 * @param arr 数组。
 * @param count 每个子数组的长度。
 * @param maxCount 最多允许拆分的组数。如果超出限制后则剩余的项全部添加到最后一个子数组中。
 * @return 返回一个二维数组。
 * @example split([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export function split<T>(arr: T[], count = 1, maxCount?: number) {
    const r: T[][] = [];
    for (let i = 0; i < arr.length;) {
        if (maxCount! > 0 && r.length >= maxCount!) {
            r.push(arr.slice(i));
            break;
        }
        r.push(arr.slice(i, i += count));
    }
    return r;
}

/**
 * 将数组中的项随机打乱。
 * @param arr 数组。
 * @example shuffle([1, 2, 3])
 */
export function shuffle<T>(arr: T[]) {
    let index = arr.length;
    while (index > 0) {
        const target = Math.floor(Math.random() * index);
        const value = arr[--index];
        arr[index] = arr[target];
        arr[target] = value;
    }
}

/**
 * 随机获取数组中的任一项。
 * @param arr 数组。
 * @return 返回某一项。如果数组为空则返回 undefined。
 * @example random([1, 2, 3])
 */
export function random<T>(arr: T[]) {
    return arr[Math.floor(arr.length * Math.random())];
}

/**
 * 获取数组中指定索引的项。
 * @param arr 数组。
 * @param index 要获取的索引（从 0 开始）。如果值为负数，则获取倒数的项。
 * @return 返回指定索引的项。
 * @example item(["a", "b"], -1) // "b"
 */
export function item<T>(arr: T[], index: number) {
    return arr[index < 0 ? arr.length + index : index];
}

/**
 * 获取数组中第一个不为空的项。
 * @param arr 数组。
 * @return 返回第一个不为空的项，如果所有项都为空则返回 undefined。
 * @example pick([undefined, null, 1, 2]) // 1
 */
export function pick<T>(arr: T[]) {
    for (const value of arr) {
        if (value != undefined) {
            return value;
        }
    }
}

/**
 * 计算指定项在数组中出现的次数。
 * @param arr 数组。
 * @param item 要查找的项。
 * @param startIndex 开始查找的索引（从 0 开始）。
 * @param endIndex 结束查找的索引（从 0 开始，不含）。
 * @return 返回项出现的次数。
 * @example count(["a", "b"], "a") // 1
 */
export function count<T>(arr: T[], item: T, startIndex = 0, endIndex = arr.length) {
    let r = 0;
    for (; startIndex < endIndex; startIndex++) {
        if (arr[startIndex] === item) {
            r++;
        }
    }
    return r;
}

/**
 * 判断数组中是否存在重复项。
 * @param arr 数组。
 * @return 若数组中存在重复项则返回 true，否则返回 false。
 * @example isUnique([1, 9, 0]) // true
 * @example isUnique([1, 9, 9, 0]) // false
 */
export function isUnique<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
        if (~arr.indexOf(arr[i - 1], i)) {
            return false;
        }
    }
    return true;
}

/**
 * 删除数组中的重复项并返回新数组。
 * @param arr 数组。
 * @return 返回过滤后的新数组。
 * @example [1, 9, 9, 0].unique() // [1, 9, 0]
 */
export function unique<T>(arr: T[]) {
    const r: T[] = [];
    for (const value of arr) {
        r.indexOf(value) < 0 && r.push(value);
    }
    return r;
}

/**
 * 将多维数组合并为一维数组。
 * @param arr 数组。
 * @return 返回新数组。
 * @example flatten([[1, 2], [[[3]]]]) // [1, 2, 3]
 */
export function flatten(arr: any[]) {
    const r: any[] = [];
    for (const value of arr) {
        value && value instanceof Array ? r.push(...flatten(value)) : r.push(value);
    }
    return r;
}

/**
 * 从数组中删除另一个数组的所有项，返回剩下的项组成的新数组。
 * @param arr 数组。
 * @param other 需要被删除的项数组。
 * @return 返回新数组。
 * @example sub([1, 2], [1]) // [2]
 */
export function sub<T>(arr: T[], other: T[]) {
    const r: T[] = [];
    for (let i = arr.length; --i >= 0;) {
        ~other.indexOf(arr[i]) || r.push(arr[i]);
    }
    return r;
}

/**
 * 计算所有数组的并集。
 * @param arrs 要合并的所有数组。
 * @return 返回所有数组中出现过的元素组成的无重复项的新数组。
 * @example union([1, 2], [1]) // [1, 2]
 */
export function union<T>(...arrs: T[][]) {
    const r: T[] = [];
    for (const arr of arrs) {
        for (const item of arr) {
            if (r.indexOf(item) < 0) {
                r.push(item);
            }
        }
    }
    return r;
}

/**
 * 计算所有数组的交集。
 * @param arrs 要取交集的所有数组。
 * @return 返回所有数组中公共元素组成的无重复项的新数组。
 * @example intersect([1, 2, 3], [101, 2, 1, 10], [2, 1]) // [1, 2]
 */
export function intersect<T>(...arrs: T[][]) {
    const r: T[] = [];
    if (arrs.length) {
        next: for (const item of arrs[0]) {
            for (let j = 1; j < arrs.length; j++) {
                if (arrs[j].indexOf(item) < 0) {
                    continue next;
                }
            }
            r.push(item);
        }
    }
    return r;
}

/**
 * 计算数组的全排列结果。
 * @param arr 数组。
 * @return 返回一个新数组，其每一项都是一种排列方式。
 * @example permute([1, 2, 3]) // [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
 */
export function permute<T>(arr: T[]) {
    const r: T[][] = [];
    const usedItems: T[] = [];
    const next = (input: any) => {
        for (let i = 0; i < input.length; i++) {
            const item = input.splice(i, 1)[0];
            usedItems.push(item);
            if (input.length == 0) {
                r.push(usedItems.slice(0));
            }
            next(input);
            input.splice(i, 0, item);
            usedItems.pop();
        }
    };
    next(arr);
    return r;
}

/**
 * 根据指定的规则选择项。
 * @param arr 数组。
 * @param key 选择的规则。规则可以是一个键名或自定义取值的函数。
 * @return 返回选择的结果组成的新数组。
 * @example select([{"user": "fred"}, {"banch": "bred"}], o => o.user) // ["fred"]
 * @example select([{"user": "fred"}, {"banch": "bred"}], "user") // ["fred"]
 */
export function select<T, R>(arr: T[], key: ((item: T) => R) | keyof T) {
    const r: R[] = [];
    for (const item of arr) {
        r.push(typeof key === "function" ? (key as (item: T) => R)(item) : item[key] as any);
    }
    return r;
}

/**
 * 调用数组每一项的成员函数。
 * @param arr 数组。
 * @param fnName 要调用的成员函数名。
 * @param args 调用的所有参数。
 * @return 返回所有调用结果组成的新数组。
 * @example invoke(["Teal", "UI"], "length") // [4, 2]
 */
export function invoke<T>(arr: T[], fnName: string, ...args: any[]) {
    const r: T[] = [];
    for (const value of arr) {
        let item = (value as any)[fnName];
        if (typeof item === "function") {
            item = item.apply(value, args);
        }
        r.push(item);
    }
    return r;
}

/**
 * 将数组中的项分别和指定的键组合为对象。
 * @param arr 数组。
 * @param keys 键列表。
 * @return 返回数组和指定键组成的键值对。
 * @example associate([1, 2], ["a", "b"]) // { a: 1, b: 2 }
 */
export function associate<T>(arr: T[], keys: string[]) {
    const r: { [key: string]: T; } = {};
    const length = Math.min(arr.length, keys.length);
    for (let i = 0; i < length; i++) {
        r[keys[i]] = arr[i];
    }
    return r;
}

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
export function binarySearch<T>(arr: T[], value: T, compareFn?: (item1: T, item2: T) => any, start = 0, end = arr.length) {
    while (start < end) {
        const middle = Math.floor((start + end) / 2);
        if (compareFn ? compareFn(arr[middle], value) < 0 : arr[middle] < value) start = middle + 1;
        else end = middle;
    }
    return start;
}

/**
 * 计算数组中所有项的最小值。
 * @param arr 数组。
 * @return 返回数组中所有项的最小值。如果数组为空则返回 Infinity。
 * @example min([1, 2]) // 1
 */
export function min(arr: number[]) {
    return Math.min(...arr);
}

/**
 * 计算数组中所有项的最大值。
 * @param arr 数组。
 * @return 返回数组中所有项的最大值。如果数组为空则返回 -Infinity。
 * @example max([1, 2]) // 2
 */
export function max(arr: number[]) {
    return Math.max(...arr);
}

/**
 * 计算数组中所有项的和。
 * @param arr 数组。
 * @return 返回数组中所有数值的和。计算时将忽略非数字的项。如果数组为空则返回 0。
 * @example sum([1, 2]) // 3
 */
export function sum(arr: number[]) {
    let r = 0;
    let i = arr.length;
    while (--i >= 0) {
        r += +arr[i] || 0;
    }
    return r;
}

/**
 * 计算数组中所有项的算术平均值。
 * @param arr 数组。
 * @return 返回数组中所有数值的算术平均值。计算时将忽略非数字的项。如果数组为空则返回 0。
 * @example avg([1, 2]) // 1.5
 */
export function avg(arr: number[]) {
    let sum = 0;
    let c = 0;
    let i = arr.length;
    while (--i >= 0) {
        if (arr[i] === 0 || +arr[i]) {
            sum += +arr[i];
            c++;
        }
    }
    return c ? sum / c : 0;
}
