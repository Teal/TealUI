/**
 * 获取对象的所有值。
 * @param obj 对象。
 * @return 返回所有值组成的数组。
 * @example Object.values({a: 3, b: 5}) // [3, 5]
 * @example Object.values([0, 1]) // [0, 1]
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/values
 */
Object.values = Object.values || function <T>(obj: T) {
    const r: (T[keyof T])[] = [];
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            r.push(obj[key]);
        }
    }
    return r;
};

/**
 * 获取对象的所有键值对。
 * @param obj 对象。
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
 * 判断数组是否包含指定的项。
 * @param value 要查找的项。
 * @return 如果包含则返回 true，否则返回 false。
 * @example [1, 2].includes(1) // true
 * @example [1, 2].includes(0) // false
 * @example [1, 2, NaN].includes(NaN) // true
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
 * 将字符串扩展到指定长度，不够的部分在左边使用指定字符补齐。
 * @param totalLength 对齐之后的总长度。
 * @param paddingChar 用于填补空白的字符。
 * @return 返回新字符串。
 * @example "6".padStart(3, "0") // "006"
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
 */
String.prototype.padStart = String.prototype.padStart || function (this: string, totalLength: number, paddingChar = " ") {
    return new Array(totalLength - this.length + 1).join(paddingChar || " ") + this;
};

/**
 * 将字符串扩展到指定长度，不够的部分在右边使用指定字符补齐。
 * @param totalLength 对齐之后的总长度。
 * @param paddingChar 用于填补空白的字符。
 * @return 返回新字符串。
 * @example "6".padEnd(3, "0") // "600"
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
 */
String.prototype.padEnd = String.prototype.padEnd || function padEnd(this: string, totalLength: number, paddingChar = " ") {
    return this + new Array(totalLength - this.length + 1).join(paddingChar || " ");
};

interface String {
    trimLeft(): string;
}

/**
 * 去除当前字符串开始空格。
 * @return 返回新字符串。
 * @example "  a  ".trimLeft() // "a  "
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/trimLeft
 */
String.prototype.trimLeft = String.prototype.trimLeft || function (this: string) {
    return this.replace(/^\s+/, "");
};

interface String {
    trimRight(): string;
}

/**
 * 去除当前字符串结尾空格。
 * @return 返回新字符串。
 * @example "  a  ".trimRight() // "  a"
 * @since ES7
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/trimRight
 */
String.prototype.trimRight = String.prototype.trimRight || function (this: string) {
    return this.replace(/\s+$/, "");
};
