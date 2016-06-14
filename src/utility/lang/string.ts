/**
 * @fileOverview 字符串(String)扩展
 * @author xuld@vip.qq.com
 * @description 提供 JavaScript 内置对象 String 的扩展 API。
 * @namespace String
 */

/**
 * 格式化指定的字符串。
 * @param formatString 格式字符串。具体见下文。
 * @param args 格式化参数。
 * @returns 返回格式化后的字符串。
 * @remark
 * #### 格式化语法
 * 格式字符串中，以下内容会被替换：
 * 
 * 元字符   | 意义      | 示例
 * --------|-----------|--------
 * {数字}   | 替换为参数列表 | 如 `String.format("{0}年{1}月{2}日", 2012, 12, 3)` 中，{0} 被替换成 2012，{1} 被替换成 12 ，依次类推。
 * {字符串} | 替换为参数对象 | 如 `String.format("{year}年{month} 月 ", {year: 2012, month:12})`。
 * {{      | 被替换为 { |
 * }}      | 被替换为 } |
 * 
 * @example String.format("我是{0}，不是{1}", "小黑", "大白"); // "我是小黑，不是大白"
 * @example String.format("我是{xiaohei}，不是{dabai}", {xiaohei: "小黑", dabai: "大白"}); // "我是小黑，不是大白"
 * @example String.format("在字符串内使用两个{{和}}避免被转换"); //  "在字符串内使用两个{和}避免被转换"
 */
export function format(formatString: string, ...args: any[]) {
    let arg = arguments;
    // 如果第二个参数是数组，则认为是数组本身。
    if (arg.length === 2 && arg[1] && typeof arg[1].length === "number") {
        Array.prototype.unshift.call(arg = arg[1], formatString);
    }
    return formatString ? formatString.replace(/\{\{|\{(\w+)\}|\}\}/g, (matched: any, argName: any) => argName ? (matched = +argName + 1) ? arg[matched] : arg[1][argName] : matched[0]) : "";
}

/**
 * 判断当前字符串是否以某个特定字符串开头。
 * @param str 开头的字符串。
 * @returns 返回符合要求则返回 true，否则返回 false。
 * @example "1234567".startsWith("123") // true
 */
export function startsWith(_this: string, value: string) {
    return _this.substr(0, value.length) === value;
}

/**
 * 判断当前字符串是否以某个特定字符串结尾。
 * @param value 开头的字符串。
 * @returns 返回符合要求则返回 true，否则返回 false。
 * @example "1234567".endsWith("67") // true
 */
export function endsWith(_this: string, value: string) {
    return _this.substr(_this.length - value.length) === value;
}

/**
 * 判断一个对象是否是字符串。
 * @param obj 要判断的对象。
 * @returns 如果 obj 是字符串则返回 true，否则返回 false。
 * @example String.isString("") // true
 */
export function isString(obj: any): obj is string {
    return typeof obj === 'string';
}

/**
 * 将字符串限定在指定长度内，超出部分用 ... 代替。
 * @param str 要处理的字符串。
 * @param length 最终期望的最大长度。
 * @example String.ellipsis("1234567", 6) // "123..."
 * @example String.ellipsis("1234567", 9) // "1234567"
 */
export function ellipsis(value: string, length: number) {
    return value ? value.length > length ? value.substr(0, length - 3) + "..." : value : "";
}

/**
 * 将字符串限定在指定长度内，超出部分用 ... 代替。同时确保不强制分割单词。
 * @param value 要处理的字符串。
 * @param length 最终期望的最大长度。
 * @example String.ellipsisByWord("abc def", 8) //   "abc..."
 */
export function ellipsisByWord(value: string, length: number) {
    if (value && value.length > length) {
        length -= 3;
        if (/[\x00-\xff]/.test(value.charAt(length))) {
            const p = value.lastIndexOf(' ', length);
            if (p !== -1) {
                length = p;
            }
        }
        value = value.substr(0, length) + '...';
    }
    return value || '';
}

/**
 * 判断字符串是否包含指定单词。
 * @param value 要判断的字符串。
 * @param separator 指定单词的分割符，默认为空格。
 * @returns 如果包含指定的单词则返回 true，否则返回 false。
 * @example String.containsWord("abc ab", "ab")
 */
export function containsWord(_this: string, value: string, separator = " ") {
    separator = separator || ' ';
    return (separator ? (separator + _this + separator) : _this).indexOf(value) >= 0;
}

/**
 * 删除字符串的公共缩进部分。
 * @param value 要处理的字符串。
 * @returns 返回处理后的字符串。
 * @example String.removeLeadingWhiteSpaces("  a") // "a"
 */
export function removeLeadingWhiteSpaces(value: string) {
    value = value.replace(/^[\r\n]+/, "").replace(/\s+$/, "");
    const match = /^\s+/.exec(value);
    if (match) {
        const space = match[0];
        let t = value.split(/[\r\n]/);
        for (let i = t.length - 1; i >= 0; i--) {
            t[i] = t[i].replace(space, "");
        }
        value = t.join('\r\n');
    }
    return value;
}

/**
 * 替换当前字符串内全部子字符串。
 * @param from 替换的源字符串。
 * @param to 替换的目标字符串。
 * @returns 返回替换后的字符串。
 * @example "1121".replaceAll("1", "3") // "3323"
 */
export function replaceAll(_this: string, from: string, to: string) {
    let str = _this;
    let p = 0;
    while ((p = str.indexOf(from), p) >= 0) {
        str = str.replace(from, to);
        p += to.length + 1;
    }
    return str;
}

/**
 * 去除当前字符串开始空格。
 * @returns 返回新字符串。
 * @example "  a".trimStart() // "a"
 * @since ES6
 */
export function trimLeft(_this: string) {
    return _this.replace(/^\s+/, '');
}

/**
 * 去除当前字符串结尾空格。
 * @returns 返回新字符串。
 * @example "a  ".trimStart() // "a"
 * @since ES6
 */
export function trimRight(_this: string) {
    return _this.replace(/\s+$/, '');
}

/**
 * 删除当前字符串内所有空格。
 * @returns 返回新字符串。
 * @example " a b   ".clean() // "ab"
 */
export function clean(_this: string) {
    return _this.replace(/\s+/g, ' ');
}

/**
 * 获得当前字符串按字节计算的长度（英文算一个字符，中文算两个个字符）。
 * @returns 返回长度值。
 * @example "a中文".byteLength() // 5
 */
export function byteLength(_this: string) {
    const arr = _this.match(/[^\x00-\xff]/g);
    return _this.length + (arr ? arr.length : 0);
}

/**
 * 删除字符串内的重复字符。
 * @returns 返回新字符串。
 * @example "aabbcc".unique() // "abc"
 */
export function unique(_this: string) {
    return _this.replace(/(^|\s)(\S+)(?=\s(?:\S+\s)*\2(?:\s|$))/g, '');
}

/**
 * 重复当前字符串内容指定次数。
 * @returns 返回新字符串。
 * @example "a".repeat(4) // "aaaa"
 * @since ES6
 */
export function repeat(_this: string, count: number) {
    return new Array(count + 1).join(_this);
}

/**
 * 将字符串首字母大写。
 * @returns 返回新字符串。
 * @example "qwert".capitalize() // "Qwert"
 */
export function capitalize(_this: string) {
    return _this.replace(/(\b[a-z])/g, function (w) {
        return w.toUpperCase();
    });
}

/**
 * 将字符串首字母小写。
 * @returns 返回新字符串。
 * @example "Qwert".uncapitalize() // "qwert"
 */
export function uncapitalize(_this: string) {
    return _this.replace(/(\b[A-Z])/g, function (w) {
        return w.toLowerCase();
    });
}

/**
 * 将字符串转为骆驼规则（如 fontSize）。
 * @returns 处理后的字符串。
 * @example "font-size".toCamelCase() // "fontSize"
 */
export function toCamelCase(_this: string) {
    return _this.replace(/-(\w)/g, w => w.toUpperCase());
}

/**
 * 获取字符串左边指定长度的子字符串。
 * @param length 要获取的子字符串长度。
 * @returns 返回字符串左边 length 长度的子字符串。
 * @example "abcde".left(3) // "abc"
 */
export function left(_this: string, length: number) {
    return _this.substr(0, length);
}

/**
 * 获取字符串右边指定长度的子字符串。
 * @param length 要获取的子字符串长度。
 * @returns 返回字符串右边 length 长度的子字符串。
 * @example "abcde".right(3); // "cde"
 */
export function right(_this: string, length: number) {
    return _this.substr(_this.length - length, length);
}

/**
 * 将字符串扩展到指定长度，不够的部分在左边使用 @paddingChar 补齐。
 * @param totalLength 对齐之后的总长度。
 * @param paddingChar 填补空白的字符。
 * @returns 返回处理后的字符串。
 * @example "6".padLeft(3, '0'); // "006"
 */
export function padLeft(_this: string, totalLength: number, paddingChar = " ") {
    return new Array(totalLength - _this.length + 1).join(paddingChar || " ") + _this;
}

/**
 * 将字符串扩展到指定长度，不够的部分在右边使用@paddingChar 补齐。
 * @param totalLength 对齐之后的总长度。
 * @param paddingChar 填补空白的字符。
 * @returns 返回处理后的字符串。
 * @example "6".padRight(3, '0'); // "600"
 */
export function padRight(_this: string, totalLength: number, paddingChar = " ") {
    return _this + new Array(totalLength - _this.length + 1).join(paddingChar || " ");
}

// #endregion
