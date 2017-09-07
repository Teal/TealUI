/**
 * 获取对象的所有值。
 * @param obj 要获取的对象。
 * @return 返回所有值组成的数组。
 * @example Object.values({a: 3, b: 5}) // [3, 5]
 * @example Object.values([0, 1]) // [0, 1]
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/values
 */
Object.values = Object.values || function <T>(obj: T) {
    const result: (T[keyof T])[] = [];
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result.push(obj[key]);
        }
    }
    return result;
};

/**
 * 获取对象的所有键值对。
 * @param obj 要获取的对象。
 * @return 返回所有键值对组成的数组。
 * @example Object.entries({a: 3, b: 5}) // [["a", 3], ["b", 5]]
 * @example Object.entries([0, 1]) // [[0, 0], [1, 1]]
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
 */
Object.entries = Object.entries || function <T>(obj: T) {
    return Object.keys(obj).map(key => [key, (obj as any)[key]]);
};

/**
 * 判断当前数组是否包含指定值。
 * @param value 要判断的值。
 * @return 如果包含则返回 true，否则返回 false。
 * @example includes([1, 2], 1) // true
 * @example includes([1, 2], 0) // false
 * @example includes([1, 2, NaN], NaN) // true
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
 */
Array.prototype.includes = Array.prototype.includes || function <T>(this: T[], value: T) {
    for (const item of this) {
        if (item === value || (value !== value && item !== item)) {
            return true;
        }
    }
    return false;
};

/**
 * 将字符串扩展到指定长度，不够的部分在左边使用 @paddingChar 补齐。
 * @param totalLength 对齐之后的总长度。
 * @param paddingChar 填补空白的字符。
 * @return 返回处理后的字符串。
 * @example padStart("6", 3, "0") // "006"
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
 */
String.prototype.padStart = String.prototype.padStart || function (this: string, totalLength: number, paddingChar = " ") {
    return new Array(totalLength - this.length + 1).join(paddingChar || " ") + this;
};

/**
 * 将字符串扩展到指定长度，不够的部分在右边使用@paddingChar 补齐。
 * @param totalLength 对齐之后的总长度。
 * @param paddingChar 填补空白的字符。
 * @return 返回处理后的字符串。
 * @example padEnd("6", 3, "0") // "600"
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
 */
String.prototype.padEnd = String.prototype.padEnd || function padEnd(this: string, totalLength: number, paddingChar = " ") {
    return this + new Array(totalLength - this.length + 1).join(paddingChar || " ");
};

interface String {
    trimLeft(): String;
}

/**
 * 去除当前字符串开始空格。
 * @return 返回新字符串。
 * @example trimLeft("  a") // "a"
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/trimLeft
 */
String.prototype.trimLeft = String.prototype.trimLeft || function (this: string) {
    return this.replace(/^\s+/, "");
};

interface String {
    trimRight(): String;
}

/**
 * 去除当前字符串结尾空格。
 * @return 返回新字符串。
 * @example trimRight("a  ") // "a"
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/trimRight
 */
String.prototype.trimRight = String.prototype.trimRight || function (this: string) {
    return this.replace(/\s+$/, "");
};
