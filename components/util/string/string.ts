/**
 * 格式化指定的字符串。
 * @param formatString 格式字符串。具体见下文。
 * @param args 格式化参数。
 * @return 返回格式化后的字符串。
 * @desc
 * 格式字符串中，以下内容会被替换：
 *
 * 元字符   | 意义      | 示例
 * --------|-----------|--------
 * {数字}   | 替换为参数列表 | 如 `String.format("{0}年{1}月{2}日", 2012, 12, 3)` 中，{0} 被替换成 2012，{1} 被替换成 12 ，依次类推。
 * {字符串} | 替换为参数对象 | 如 `String.format("{year}年{month} 月 ", {year: 2012, month:12})`。
 * {{      | 被替换为 { |
 * }}      | 被替换为 } |
 *
 * @example format("我是{0}，不是{1}", "小黑", "大白") // "我是小黑，不是大白"
 * @example format("我是{xiaohei}，不是{dabai}", {xiaohei: "小黑", dabai: "大白"}) // "我是小黑，不是大白"
 * @example format("在字符串内使用两个{{和}}避免被转换") //  "在字符串内使用两个{和}避免被转换"
 */
export function format(formatString: string, ...args: any[]) {
    return formatString ? formatString.replace(/\{\{|\{(.+?)\}|\}\}/g, (source: string, argName: string) => {
        if (argName == undefined) {
            return source.charAt(0);
        }
        argName = +argName >= 0 ? args[argName as any] : args[0][argName];
        return argName == undefined ? "" : argName;
    }) : "";
}

/**
 * 判断一个对象是否是字符串。
 * @param obj 要判断的对象。
 * @return 如果 obj 是字符串则返回 true，否则返回 false。
 * @example isString("") // true
 */
export function isString(obj: any): obj is string {
    return typeof obj === "string";
}

/**
 * 将字符串限定在指定长度内，超出部分用 ... 代替。
 * @param str 要处理的字符串。
 * @param length 最终期望的最大长度。
 * @return 返回处理后的字符串。
 * @example ellipsis("1234567", 6) // "123..."
 * @example ellipsis("1234567", 9) // "1234567"
 */
export function ellipsis(str: string, length: number) {
    return str ? str.length > length ? str.substr(0, length - 3) + "..." : str : "";
}

/**
 * 将字符串限定在指定长度内，超出部分用 ... 代替。同时确保不强制分割单词。
 * @param str 要处理的字符串。
 * @param length 最终期望的最大长度。
 * @return 返回处理后的字符串。
 * @example ellipsisByWord("abc def", 6) //   "abc..."
 */
export function ellipsisByWord(str: string, length: number) {
    if (str && str.length > length) {
        length -= 3;
        if (/[\x00-\xff]/.test(str.charAt(length))) {
            const p = str.lastIndexOf(" ", length);
            if (p !== -1) {
                length = p;
            }
        }
        str = str.substr(0, length) + "...";
    }
    return str || "";
}

/**
 * 判断字符串是否包含指定单词。
 * @param value 要判断的字符串。
 * @param separator 指定单词的分割符，默认为空格。
 * @return 如果包含指定的单词则返回 true，否则返回 false。
 * @example containsWord("abc ab", "ab")
 */
export function containsWord(str: string, value: string, separator = " ") {
    separator = separator || " ";
    return (separator ? (separator + str + separator) : str).indexOf(value) >= 0;
}

/**
 * 删除字符串的公共缩进部分。
 * @param str 要处理的字符串。
 * @return 返回处理后的字符串。
 * @example removeLeadingWhiteSpaces("  a") // "a"
 */
export function removeLeadingWhiteSpaces(str: string) {
    str = str.replace(/^[\r\n]+/, "").replace(/\s+$/, "");
    const match = /^\s+/.exec(str);
    if (match) {
        const space = match[0];
        const t = str.split(/[\r\n]/);
        for (let i = t.length - 1; i >= 0; i--) {
            t[i] = t[i].replace(space, "");
        }
        str = t.join("\n");
    }
    return str;
}

/**
 * 替换当前字符串内全部子字符串。
 * @param from 替换的源字符串。
 * @param to 替换的目标字符串。
 * @return 返回替换后的字符串。
 * @example replaceAll("1121", "1", "3") // "3323"
 */
export function replaceAll(str: string, from: string, to: string) {
    for (let p = 0; (p = str.indexOf(from, p)) >= 0; p += to.length) {
        str = str.replace(from, to);
    }
    return str;
}

/**
 * 删除当前字符串内所有空格。
 * @return 返回新字符串。
 * @example clean(" a b   ") // "ab"
 */
export function clean(str: string) {
    return str.replace(/\s+/g, "");
}

/**
 * 获得当前字符串按字节计算的长度（英文算一个字符，中文算两个个字符）。
 * @return 返回长度值。
 * @example byteLength("a中文") // 5
 */
export function byteLength(str: string) {
    const arr = str.match(/[^\x00-\xff]/g);
    return str.length + (arr ? arr.length : 0);
}

/**
 * 删除字符串内的重复字符。
 * @return 返回新字符串。
 * @example unique("aabbcc") // "abc"
 */
export function unique(str: string) {
    let result = "";
    for (const char of str) {
        if (result.indexOf(char) < 0) {
            result += char;
        }
    }
    return result;
}

/**
 * 将字符串首字母大写。
 * @return 返回新字符串。
 * @example capitalize("qwert") // "Qwert"
 */
export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 将字符串首字母小写。
 * @return 返回新字符串。
 * @example uncapitalize("Qwert") // "qwert"
 */
export function uncapitalize(str: string) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * 将字符串转为骆驼规则（如 fontSize）。
 * @return 处理后的字符串。
 * @example toCamelCase("font-size") // "fontSize"
 */
export function toCamelCase(str: string) {
    return str.replace(/-(\w)/g, (all, word: string) => word.toUpperCase());
}

/**
 * 获取字符串左边指定长度的子字符串。
 * @param length 要获取的子字符串长度。
 * @return 返回字符串左边 length 长度的子字符串。
 * @example left("abcde", 3) // "abc"
 */
export function left(str: string, length: number) {
    return str.substr(0, length);
}

/**
 * 获取字符串右边指定长度的子字符串。
 * @param length 要获取的子字符串长度。
 * @return 返回字符串右边 length 长度的子字符串。
 * @example right("abcde", 3) // "cde"
 */
export function right(str: string, length: number) {
    return str.substr(str.length - length, length);
}
