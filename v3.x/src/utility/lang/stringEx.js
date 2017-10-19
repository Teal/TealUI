/**
 * @fileOverview 字符串扩展。
 * @author xuld
 */

// #region @String.isString

/**
 * 判断一个对象是否是字符串。
 * @param {Object} obj 要判断的对象。
 * @returns {Boolean} 如果 @obj 是字符串则返回 @true，否则返回 @false。
 * @example String.isString("") // true
 */
String.isString = function (obj) {
    return typeof obj === 'string';
};

// #endregion

// #region @String.ellipsis

/**
 * 将字符串限定在指定长度内，超出部分用 ... 代替。
 * @param {String} str 要处理的字符串。
 * @param {Number} length 最终期望的最大长度。
 * @example 
 * String.ellipsis("1234567", 6) //   "123..."
 * 
 * String.ellipsis("1234567", 9) //   "1234567"
 */
String.ellipsis = function (str, length) {
    typeof console === "object" && console.assert(!str || typeof str === "string", "String.ellipsis(str: 必须是字符串, length)");
    return str ? str.length > length ? str.substr(0, length - 3) + "..." : str : "";
};

// #endregion

// #region @String.ellipsis

/**
 * 将字符串限定在指定长度内，超出部分用 ... 代替。同时确保不强制分割单词。
 * @param {String} str 要处理的字符串。
 * @param {Number} length 最终期望的最大长度。
 * @example String.ellipsisByWord("abc def", 8) //   "abc..."
 */
String.ellipsisByWord = function (str, length) {
    typeof console === "object" && console.assert(!str || typeof str === "string", "String.ellipsisByWord(str: 必须是字符串, length)");
    if (str && str.length > length) {
        length -= 3;
        if (/[\x00-\xff]/.test(str.charAt(length))) {
            var p = str.lastIndexOf(' ', length);
            if (p !== -1) {
                length = p;
            }
        }
        str = str.substr(0, length) + '...';
    }
    return str || '';
};

// #endregion

// #region @String.containsWord

/**
 * 判断字符串是否包含指定单词。
 * @param {String} str 要判断的字符串。
 * @param {String} [separator=' '] 指定单词的分割符，默认为空格。
 * @returns {Boolean} 如果包含指定的单词则返回 @true，否则返回 @false。
 * @example String.containsWord("abc ab", "ab")
 */
String.containsWord = function (str, separator) {
    separator = separator || ' ';
    return (separator ? (separator + this + separator) : this).indexOf(str) >= 0;
};

// #endregion

// #region @String.removeLeadingWhiteSpaces

/**
 * 删除字符串的公共缩进部分。
 * @param {String} str 要处理的字符串。
 * @returns {String} 返回处理后的字符串。
 * @example String.removeLeadingWhiteSpaces("  a") // "a"
 */
String.removeLeadingWhiteSpaces = function (str) {
    typeof console === "object" && console.assert(typeof str === "string", "String.removeLeadingWhiteSpaces(str: 必须是字符串)");
    str = str.replace(/^[\r\n]+/, "").replace(/\s+$/, "");
    var space = /^\s+/.exec(str), i;
    if (space) {
        space = space[0];
        str = str.split(/[\r\n]/);
        for (i = str.length - 1; i >= 0; i--) {
            str[i] = str[i].replace(space, "");
        }
        str = str.join('\r\n');
    }
    return str;
}

// #endregion

// #region @String#replaceAll

/**
 * 替换当前字符串内全部子字符串。
 * @param {String} from 替换的源字符串。
 * @param {String} to 替换的目标字符串。
 * @returns {String} 返回替换后的字符串。
 * @example "1121".replaceAll("1", "3") // "3323"
 */
String.prototype.replaceAll = function (from, to) {
    var str = this, p = 0;
    while ((p = str.indexOf(from), p) >= 0) {
        str = str.replace(from, to);
        p += to.length + 1;
    }
    return str;
};

// #endregion

// #region @String#trimLeft/String#trimRight

/**
 * 去除当前字符串开始空格。
 * @returns {String} 返回新字符串。
 * @example "  a".trimStart() // "a"
 * @since ES6
 */
String.prototype.trimLeft = String.prototype.trimLeft || function () {
    return this.replace(/^\s+/, '');
};

/**
 * 去除当前字符串结尾空格。
 * @returns {String} 返回新字符串。
 * @example "a  ".trimStart() // "a"
 * @since ES6
 */
String.prototype.trimRight = String.prototype.trimRight || function () {
    return this.replace(/\s+$/, '');
};

// #endregion

// #region @String#startsWith/String#endsWith

/**
 * 判断当前字符串是否以某个特定字符串开头。
 * @param {String} str 开头的字符串。
 * @returns {Boolean} 返回符合要求则返回 @true，否则返回 @false。
 * @example "1234567".startsWith("123") // true
 */
String.prototype.startsWith = function (str) {
    typeof console === "object" && console.assert(typeof str === "string", "string.startsWith(str: 必须是字符串)");
    return this.substr(0, str.length) === str;
};

/**
 * 判断当前字符串是否以某个特定字符串结尾。
 * @param {String} str 开头的字符串。
 * @returns {Boolean} 返回符合要求则返回 @true，否则返回 @false。
 * @example "1234567".endsWith("67") // true
 */
String.prototype.endsWith = function (str) {
    typeof console === "object" && console.assert(typeof str === "string", "string.endsWith(str: 必须是字符串)");
    return this.substr(this.length - str.length) === str;
};

// #endregion

// #region @String#clean

/**
 * 删除当前字符串内所有空格。
 * @returns {String} 返回新字符串。
 * @example " a b   ".clean() // "ab"
 */
String.prototype.clean = function () {
    return this.replace(/\s+/g, ' ');
};

// #endregion

// #region @String#byteLength

/**
 * 获得当前字符串按字节计算的长度（英文算一个字符，中文算两个个字符）。
 * @returns {Number} 返回长度值。
 * @example "a中文".byteLength() // 5
 */
String.prototype.byteLength = function () {
    var arr = this.match(/[^\x00-\xff]/g);
    return this.length + (arr ? arr.length : 0);
};

// #endregion

// #region @String#unique

/**
 * 删除字符串内的重复字符。
 * @returns {String} 返回新字符串。
 * @example "aabbcc".unique() // "abc"
 */
String.prototype.unique = function () {
    return this.replace(/(^|\s)(\S+)(?=\s(?:\S+\s)*\2(?:\s|$))/g, '');
};

// #endregion

// #region @String#repeat

/**
 * 重复当前字符串内容指定次数。
 * @returns {String} 返回新字符串。
 * @example "a".repeat(4) // "aaaa"
 */
String.prototype.repeat = function (count) {
    return new Array(count + 1).join(this);
};

// #endregion

// #region @String#capitalize

/**
 * 将字符串首字母大写。
 * @returns {String} 返回新字符串。
 * @example "qwert".capitalize() // "Qwert"
 */
String.prototype.capitalize = function () {
    return this.replace(/(\b[a-z])/g, function (w) {
        return w.toUpperCase();
    });
};

// #endregion

// #region @String#uncapitalize

/**
 * 将字符串首字母小写。
 * @returns {String} 返回新字符串。
 * @example "Qwert".uncapitalize() // "qwert"
 */
String.prototype.uncapitalize = function () {
    return this.replace(/(\b[A-Z])/g, function (w) {
        return w.toLowerCase();
    });
};

// #endregion

// #region @String#toCamelCase

/**
 * 将字符串转为骆驼规则（如 fontSize）。
 * @returns {String} 处理后的字符串。
 * @example
 * <pre>
 * "font-size".toCamelCase() // "fontSize"
 * </pre>
 */
String.prototype.toCamelCase = function () {
    return this.replace(/-(\w)/g, function (w) {
        return w.toUpperCase();
    });
};

// #endregion

// #region @String#left/String#right

/**
 * 获取字符串左边指定长度的子字符串。
 * @param {Number} length 要获取的子字符串长度。
 * @returns {String} 返回字符串左边 @length 长度的子字符串。
 * @example "abcde".left(3) // "abc"
 */
String.prototype.left = function (length) {
    return this.substr(0, length);
};

/**
 * 获取字符串右边指定长度的子字符串。
 * @param {Number} length 要获取的子字符串长度。
 * @returns {String} 返回字符串右边 @length 长度的子字符串。
 * @example "abcde".right(3); // "cde"
 */
String.prototype.right = function (length) {
    return this.substr(this.length - length, length);
};

// #endregion

// #region @String#padLeft/String#padRight

/**
 * 将字符串扩展到指定长度，不够的部分在左边使用 @paddingChar 补齐。
 * @param {Number} totalLength 对齐之后的总长度。
 * @param {String} [paddingChar=" "] 填补空白的字符。
 * @returns {String} 返回处理后的字符串。
 * @example "6".padLeft(3, '0'); // "006"
 */
String.prototype.padLeft = function (totalLength, paddingChar) {
    return new Array(totalLength - this.length + 1).join(paddingChar || " ") + this;
};

/**
 * 将字符串扩展到指定长度，不够的部分在右边使用@paddingChar 补齐。
 * @param {Number} totalLength 对齐之后的总长度。
 * @param {String} [paddingChar=" "] 填补空白的字符。
 * @returns {String} 返回处理后的字符串。
 * @example "6".padRight(3, '0'); // "600"
 */
String.prototype.padRight = function (totalLength, paddingChar) {
    return this + new Array(totalLength - this.length + 1).join(paddingChar || " ");
};

// #endregion
