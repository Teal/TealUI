/**
 * @author xuld
 */

// #region @isEmail

/**
 * 判断指定字符串是否为合法邮箱地址。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isEmail("work&#64;xuld.net") // true
 */
function isEmail(str) {
    return /^[\u4E00-\u9FA5\uFE30-\uFFA0\w][\u4E00-\u9FA5\uFE30-\uFFA0\w-+\.]*@[\u4E00-\u9FA5\uFE30-\uFFA0\w]+(\.[\u4E00-\u9FA5\uFE30-\uFFA0\w]+)+$/.test(str);
}

// #endregion

// #region @isInteger

/**
 * 判断指定字符串是否为整数。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isInt("-45") // true
 */
function isInt(str) {
    return /^[-]?\d+$/.test(str);
}

// #endregion

// #region @isNumber

/**
 * 判断指定字符串是否为数字。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isNumber("-45.35") // true
 */
function isNumber(str) {
    return /^[-]?\d+(\.\d*)$/.test(str);
}

// #endregion

// #region @isDate

/**
 * 判断指定字符串是否为日期。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isDate("2014/1/1") // true
 */
function isDate(str) {
    typeof console === "object" && console.assert(typeof str === "string", "isDate(str: 必须是字符串)");
    var result = str.match(/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (result == null) return false;
    var dt = new Date(result[1], result[3] - 1, result[4]);
    return (dt.getFullYear() == result[1] && dt.getMonth() + 1 == result[3] && dt.getDate() == result[4]);
}

// #endregion

// #region @isLetter

/**
 * 判断指定字符串是否为字母。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isLetter("abc") // true
 */
function isLetter(str) {
    return /^[a-zA-Z]+$/.test(str);
}

// #endregion

// #region @isDight

/**
 * 判断指定字符串是否为数字。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isLetter("1") // true
 */
function isDight(str) {
    return /^\d+$/.test(str);
}

// #endregion

// #region @isLetterOrDight

/**
 * 判断指定字符串是否为字母或数字。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isLetterOrDight("x09") // true
 */
function isLetterOrDight(str) {
    return /^[a-zA-Z\d]+$/.test(str);
}

// #endregion

// #region @isIndentifier

/**
 * 判断指定字符串是否为 JavaScript 标识符。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isIndentifier("x09") // true
 */
function isIndentifier(str) {
    return /^[\u4E00-\u9FA5\uFE30-\uFFA0a-zA-Z_$][\u4E00-\u9FA5\uFE30-\uFFA0\w$]+$/.test(str);
}

// #endregion

// #region @isUrl

/**
 * 判断指定字符串是否为网址。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isIndentifier("http://teal.github.io/") // true
 */
function isUrl(str) {
    return /^(\w+:)?\/\/.+$/.test(str);
}

// #endregion

// #region @isIP

/**
 * 判断指定字符串是否为 IP 地址。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isIP("127.0.0.1") // true
 */
function isIP(str) {
    return /::1|localhost/.test(str) || (/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g.test(str) && +RegExp.$1 < 256 && +RegExp.$2 < 256 && +RegExp.$3 < 256 && +RegExp.$4 < 256);
}

// #endregion

// #region @isMobile

/**
 * 判断指定字符串是否为手机号。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isPhone("+8613211111111") // true
 */
function isPhone(str) {
    return /^(\+\d\d)?1\d{10}$/.test(str);
}

// #endregion

// #region @isChinese

/**
 * 判断指定字符串是否为中文。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isChinese("你好") // true
 */
function isChinese(str) {
    return /^[\u4E00-\u9FA5\uFE30-\uFFA0]+$/gi.test(str);
}

// #endregion

// #region @isPostCode

/**
 * 判断指定字符串是否为邮编。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isPostCode("310000") // true
 */
function isPostCode(str) {
    return /^\d{6}$/.test(str);
}

// #endregion

// #region @isId

/**
 * 判断指定字符串是否为身份证号。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isId("152500198909267865") // true
 */
function isId(str) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
}

// #endregion

// #region @isQQ

/**
 * 判断指定字符串是否为 QQ 号。
 * @param {String} str 要判断的字符串。
 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
 * @example isQQ("10000") // true
 */
function isQQ(str) {
    return /^\d{5,12}$/.test(str);
}

// #endregion
