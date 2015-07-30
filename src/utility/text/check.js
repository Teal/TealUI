/**
 * @author xuld
 */

/**
 * 提供数据校验相关函数。
 */
var Check = {

    // #region @Check.isEmail

    /**
	 * 判断指定字符串是否为合法邮箱地址。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isEmail("work&#64;xuld.net") // true
	 */
    isEmail: function (value) {
        return /^[\u4E00-\u9FA5\uFE30-\uFFA0\w][\u4E00-\u9FA5\uFE30-\uFFA0\w-+\.]*@[\u4E00-\u9FA5\uFE30-\uFFA0\w]+(\.[\u4E00-\u9FA5\uFE30-\uFFA0\w]+)+$/.test(value);
    },

    // #endregion

    // #region @Check.isInteger

    /**
	 * 判断指定字符串是否为整数。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isInt("-45") // true
	 */
    isInt: function (value) {
        return /^[-]?\d+$/.test(value);
    },

    // #endregion

    // #region @Check.isNumber

    /**
	 * 判断指定字符串是否为数字。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isNumber("-45.35") // true
	 */
    isNumber: function (value) {
        return /^[-]?\d+(\.\d*)$/.test(value);
    },

    // #endregion

    // #region @Check.isDate

    /**
	 * 判断指定字符串是否为日期。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isDate("2014/1/1") // true
	 */
    isDate: function (value) {
        var result = value.match(/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (result == null) return false;
        var dt = new Date(result[1], result[3] - 1, result[4]);
        return (dt.getFullYear() == result[1] && dt.getMonth() + 1 == result[3] && dt.getDate() == result[4]);
    },

    // #endregion

    // #region @Check.isLetter

    /**
	 * 判断指定字符串是否为字母。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isLetter("abc") // true
	 */
    isLetter: function (value) {
        return /^[a-zA-Z]+$/.test(value);
    },

    // #endregion

    // #region @Check.isDight

    /**
	 * 判断指定字符串是否为数字。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isLetter("1") // true
	 */
    isDight: function (value) {
        return /^\d+$/.test(value);
    },

    // #endregion

    // #region @Check.isLetterOrDight

    /**
	 * 判断指定字符串是否为字母或数字。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isLetterOrDight("x09") // true
	 */
    isLetterOrDight: function (value) {
        return /^[a-zA-Z\d]+$/.test(value);
    },

    // #endregion

    // #region @Check.isIndentifier

    /**
	 * 判断指定字符串是否为 JavaScript 标识符。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isIndentifier("x09") // true
	 */
    isIndentifier: function (value) {
        return /^[\u4E00-\u9FA5\uFE30-\uFFA0a-zA-Z_$][\u4E00-\u9FA5\uFE30-\uFFA0\w$]+$/.test(value);
    },

    // #endregion

    // #region @Check.isUrl

    /**
	 * 判断指定字符串是否为网址。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isIndentifier("http://teal.github.io/") // true
	 */
    isUrl: function (value) {
        return /^(\w+:)?\/\/.+$/.test(value);
    },

    // #endregion

    // #region @Check.isIP

    /**
	 * 判断指定字符串是否为 IP 地址。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isIP("127.0.0.1") // true
	 */
    isIP: function (value) {
        return /::1|localhost/.test(value) || (/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g.test(value) && +RegExp.$1 < 256 && +RegExp.$2 < 256 && +RegExp.$3 < 256 && +RegExp.$4 < 256);
    },

    // #endregion

    // #region @Check.isMobile

    /**
	 * 判断指定字符串是否为手机号。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isPhone("+8613211111111") // true
	 */
    isPhone: function (value) {
        return /^(\+\d\d)?1\d{10}$/.test(value);
    },

    // #endregion

    // #region @Check.isChinese

    /**
	 * 判断指定字符串是否为中文。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isChinese("你好") // true
	 */
    isChinese: function (value) {
        return /^[\u4E00-\u9FA5\uFE30-\uFFA0]+$/gi.test(value);
    },

    // #endregion

    // #region @Check.isPostCode

    /**
	 * 判断指定字符串是否为邮编。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isPostCode("310000") // true
	 */
    isPostCode: function (value) {
        return /^\d{6}$/.test(value);
    },

    // #endregion

    // #region @Check.isId

    /**
	 * 判断指定字符串是否为身份证号。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isId("152500198909267865") // true
	 */
    isId: function (value) {
        return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
    },

    // #endregion

    // #region @Check.isQQ

    /**
	 * 判断指定字符串是否为 QQ 号。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 @true，否则返回 @false。
	 * @example Check.isQQ("10000") // true
	 */
    isQQ: function (value) {
        return /^\d{5,12}$/.test(value);
    }

    // #endregion

};
