/**
 * @fileOverview 字符串扩展。
 * @author xuld
 */

// #region @String.isString

/**
 * 判断一个变量是否是字符串。
 * @param {Object} obj 要判断的变量。
 * @return {Boolean} 如果是字符串，返回 true， 否则返回 false。
 */
String.isString = function (obj) {
    return typeof obj === 'string';
}

// #endregion

// #region @String.ellipsis

/**
 * 将字符串限定在指定长度内，超出部分用 ... 代替。
 * @param {String} str 要处理的字符串。
 * @param {Number} length 需要的最大长度。
 * @example 
 * <pre>
 * String.ellipsis("1234567", 6); //   "123..."
 * String.ellipsis("1234567", 9); //   "1234567"
 * </pre>
 */
String.ellipsis = function (str, length) {
    return str ? str.length > length ? str.substr(0, length - 3) + "..." : str : "";
};

// #endregion

// #region @String.ellipsis

/**
 * 将字符串限定在指定长度内，超出部分用 ... 代替。不强制分割单词。
 * @param {String} value 要处理的字符串。
 * @param {Number} length 需要的最大长度。
 * @example 
 * <pre>
 * String.ellipsisByWord("1234567", 6); //   "123..."
 * String.ellipsisByWord("1234567", 9); //   "1234567"
 * </pre>
 */
String.ellipsisByWord = function (str, length) {
    if (str && str.length > length) {
        length -= 3;
        if (/[\x00-\xff]/.test(str.charAt(length))) {
            var p = str.lastIndexOf(' ', length);
            if (p !== -1) length = p;
        }
        str = str.substr(0, length) + '...';
    }
    return str || '';
};

// #endregion

// #region @String.containsWord

/**
 * 判断字符串是否包含指定单词。
 * @param {String} str 要测试的字符串。
 * @param {String} [separator=' '] 指定单词的分割符，默认为空格。
 * @return {Boolean} 返回判断结果。
 */
String.containsWord = function (str, separator) {
    separator = separator || ' ';
    return (separator ? (separator + this + separator) : this).indexOf(str) >= 0;
};

// #endregion

// #region @String#byteLength

/**
 * 替换字符串内全部子字符串。
 * @param {String} from 替换的源字符串。
 * @param {String} to 替换的目标字符串。
 * @return {String} 返回替换后的字符串。
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

// #region @String#trimStart/String#trimEnd

/**
 * 去除字符串开始空格。
 * @return {String} 格式化后的字符串。
 */
String.prototype.trimStart = function () {
    return this.replace(/^\s+/, '');
};

/**
 * 去除字符串结尾空格。
 * @return {String} 格式化后的字符串。
 */
String.prototype.trimEnd = function () {
    return this.replace(/\s+$/, '');
};

// #endregion

// #region @String#startsWith/String#endsWith

/**
 * 判断字符串是否以某个特定字符串开头。
 * @param {String} str 开头的字符串。
 * @return {Boolean} 返回是否匹配结果。
 */
String.prototype.startsWith = function (str) {
    return this.substr(0, str.length) === str;
};

/**
 * 判断字符串是否以某个特定字符串结尾。
 * @param {String} str 开头的字符串。
 * @return {Boolean} 返回是否匹配结果。
 */
String.prototype.endsWith = function (str) {
    return this.substr(this.length - str.length) === str;
};

// #endregion

// #region @String#clean

/**
 * 删除字符串内所有空格。
 * @return {String} 处理后的字符串。
 */
String.prototype.clean = function () {
    return this.replace(/\s+/g, ' ');
};

// #endregion

// #region @String#byteLength

/**
 * 获得字符字节长度，中文算 2 个字符。
 * @return {Number} 长度值。
 */
String.prototype.byteLength = function () {
    var arr = this.match(/[^\x00-\xff]/g);
    return this.length + (arr ? arr.length : 0);
};

// #endregion

// #region @String#unique

/**
 * 删除字符串的重复字符。
 * @return {String} 返回处理后的字符串。
 */
String.prototype.unique = function () {
    return this.replace(/(^|\s)(\S+)(?=\s(?:\S+\s)*\2(?:\s|$))/g, '');
};

// #endregion

// #region @String#repeat

/**
 * 重复当前字符串内容指定次数。
 * @return {String} 返回处理后的字符串。
 */
String.prototype.repeat = function (count) {
    return new Array(count + 1).join(this);
};

// #endregion

// #region @String#capitalize

/**
 * 将字符串首字母大写。
 * @return {String} 处理后的字符串。
 * @example
 * <pre>
 * "a".capitalize(); //     "A"
 * </pre>
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
 * @return {String} 处理后的字符串。
 * @example
 * <pre>
 * "A".uncapitalize(); //     "a"
 * </pre>
 */
String.prototype.uncapitalize = function () {
    return this.replace(/(\b[A-Z])/g, function (w) {
        return w.toLowerCase();
    });
};

// #endregion

// #region @String#toCamelCase

/**
 * 将字符串转为骆驼规则。
 * @return {String} 处理后的字符串。
 * @example
 * <pre>
 * "A".uncapitalize(); //     "a"
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
 * @return {String} 返回字符串左边 length 长度的子字符串。
 */
String.prototype.left = function (length) {
    return this.substr(0, length);
};

/**
 * 获取字符串右边指定长度的子字符串。
 * @param {Number} length 要获取的子字符串长度。
 * @return {String} 返回字符串右边 length 长度的子字符串。
 */
String.prototype.right = function (length) {
    return this.substr(this.length - length, length);
};

// #endregion

// #region @String#padLeft/String#padRight

/**
 * 对齐字符串左边内容。
 * @param {Number} totalLength 对齐之后的总长度。
 * @param {String} paddingChar 填补空白的字符。
 * @return {String} 返回处理后的字符串。
 */
String.prototype.padLeft = function (totalLength, paddingChar) {
    return new Array(totalLength - this.length + 1).join(paddingChar || " ") + this;
};

/**
 * 对齐字符串右边内容。
 * @param {Number} totalLength 对齐之后的总长度。
 * @param {String} paddingChar 填补空白的字符。
 * @return {String} 返回处理后的字符串。
 */
String.prototype.padRight = function (totalLength, paddingChar) {
    return this + new Array(totalLength - this.length + 1).join(paddingChar || " ");
};

// #endregion
