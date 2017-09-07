/**
 * 判断指定字符串是否只包含英文字母（a-z）。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isLetter("abc") // true
 * @example isLetter("ab0") // false
 */
export function isLetter(value: string) {
    return /^[a-zA-Z]+$/.test(value);
}

/**
 * 判断指定字符串是否只包含数字（0-9）。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isDight("1") // true
 * @example isDight("a") // false
 */
export function isDight(value: string) {
    return /^\d+$/.test(value);
}

/**
 * 判断指定字符串是否只包含数字（0-9）或英文字母（a-z）。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isLetterOrDight("x09") // true
 * @example isLetterOrDight("1.2f") // false
 */
export function isLetterOrDight(value: string) {
    return /^[a-zA-Z\d]+$/.test(value);
}

/**
 * 判断指定字符串是否表示一个整数。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isInteger("-45") // true
 * @example isInteger("-45.0") // false
 * @desc 要判断字符串能否转换为整数，可以使用 `!!parseInt("0x00")`。
 */
export function isInteger(value: string) {
    return /^[-+]?\d+$/.test(value);
}

/**
 * 判断指定字符串是否表示一个数字。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isNumber("-45.35") // true
 * @example isNumber("0x00") // false
 * @desc 要判断字符串能否转换为数字，可以使用 `!!parseFloat("0x00")`。
 */
export function isNumber(value: string) {
    return /^[-+]?\d+(?:\.\d*)?$/.test(value);
}

/**
 * 判断指定字符串是否表示一个电子邮箱地址。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isEmail("bug@tealui.com") // true
 * @example isEmail("bug@@tealui.com") // false
 */
export function isEmail(value: string) {
    return /^[\u4E00-\u9FA5\uFE30-\uFFA0\w\-+\.]+@[\u4E00-\u9FA5\uFE30-\uFFA0\w\-]+(?:\.[\u4E00-\u9FA5\uFE30-\uFFA0\w\-]+)*$/.test(value);
}

/**
 * 判断指定字符串是否表示一个日期。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isDate("2014/1/1") // true
 * @example isDate("hello") // false
 * @example isDate("2014年1月1日") // false
 */
export function isDate(value: string) {
    return !!+new Date(value.replace(/(\d{4})\D*(\d\d?)\D*(\d\d?)/, "$1/$2/$3"));
}

/**
 * 判断指定字符串是否表示一个 IP 地址。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isIp("127.0.0.1") // true
 */
export function isIp(value: string) {
    return /^(?:localhost|::1|(?:[01]?\d?\d|2[0-4]\d|25[0-5])(\.(?:[01]?\d?\d|2[0-4]\d|25[0-5])){3})$/.test(value);
}

/**
 * 判断指定字符串是否表示一个手机号码。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isPhone("+8613211111111") // true
 */
export function isPhone(value: string) {
    return /^(?:\+\d\d)?1\d{10}$/.test(value);
}

/**
 * 判断指定字符串是否表示一个电话号码（400 电话和国际电话除外）。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isTelephone("010-86000000") // true
 */
export function isTelephone(value: string) {
    return /^(?:\d{3,4}\-)?8?\d{7}$/.test(value);
}

/**
 * 判断指定字符串是否表示一个网址。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isUrl("http://tealui.com/") // true
 */
export function isUrl(value: string) {
    return /^(?:\w+:)?\/\/./.test(value);
}

/**
 * 判断指定字符串是否表示一个 JavaScript 标识符。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isIndentifier("x09") // true
 */
export function isIndentifier(value: string) {
    return /^[\u4E00-\u9FA5\uFE30-\uFFA0a-zA-Z_$][\u4E00-\u9FA5\uFE30-\uFFA0\w$]+$/.test(value);
}

/**
 * 判断指定字符串是否只包含英文。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isEnglish("Hello") // true
 */
export function isEnglish(value: string) {
    return /^[\-a-zA-Z\s]+$/.test(value);
}

/**
 * 判断指定字符串是否表示一个邮编号码。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isPostCode("310000") // true
 */
export function isPostCode(value: string) {
    return /^\d{6}$/.test(value);
}

/**
 * 判断指定字符串是否表示一个 QQ 号。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isQQ("10000") // true
 */
export function isQQ(value: string) {
    return /^\d{5,13}$/.test(value);
}

/**
 * 判断指定字符串是否只包含中文。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isChinese("你好") // true
 */
export function isChinese(value: string) {
    return /^[\u4E00-\u9FA5\uFE30-\uFFA0]+$/gi.test(value);
}

/**
 * 判断指定字符串是否表示一个身份证号。
 * @param value 要判断的字符串。
 * @return 如果符合条件则返回 true，否则返回 false。
 * @example isChineseId("152500198909267865") // true
 */
export function isChineseId(value: string) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
}
