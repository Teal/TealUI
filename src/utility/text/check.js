/**
 * @author xuld
 */

/**
 * 提供数据校验相关函数。
 */
var Check = {

    // #region @Check.isEmail

    /**
	 * 判断字符串是否为合法邮箱地址。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isEmail: function (value) {
        return /[\u4E00-\u9FA5\uFE30-\uFFA0\w][\u4E00-\u9FA5\uFE30-\uFFA0\w-+\.]*@[\u4E00-\u9FA5\uFE30-\uFFA0\w]+(\.[\u4E00-\u9FA5\uFE30-\uFFA0\w]+)+/.test(value);
    },

    // #endregion

    // #region @Check.isInteger

    /**
	 * 判断字符串是否为整数。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isInteger: function (value) {
        return /^[-]?\d+$/.test(value);
    },

    // #endregion

    // #region @Check.isNumber

    /**
	 * 判断字符串是否为数字。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isNumber: function (value) {
        return /^[-]?\d+(\.\d*)$/.test(value);
    },

    // #endregion

    // #region @Check.isDate

    /**
	 * 判断是否为日期。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isDate: function (value) {
        var result = value.match(/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (result == null) return false;
        var d = new Date(result[1], result[3] - 1, result[4]);
        return (d.getFullYear() == result[1] && d.getMonth() + 1 == result[3] && d.getDate() == result[4]);
    },

    // #endregion

    // #region @Check.isLetter

    /**
	 * 判断是否为字母。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isLetter: function (value) {
        return /^[a-zA-Z]+$/.test(value);
    },

    // #endregion

    // #region @Check.isDight

    /**
	 * 判断是否为数字。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isDight: function (value) {
        return /^\d+$/.test(value);
    },

    // #endregion

    // #region @Check.isLetterOrDight

    /**
	 * 判断是否为字母或数字。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isLetterOrDight: function (value) {
        return /^[a-zA-Z\d]+$/.test(value);
    },

    // #endregion

    // #region @Check.isIndentifier

    /**
	 * 判断是否为 JavaScript 标识符。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isIndentifier: function (value) {
        return /^[\u4E00-\u9FA5\uFE30-\uFFA0a-zA-Z_$][\u4E00-\u9FA5\uFE30-\uFFA0\w$]+$/.test(value);
    },

    // #endregion

    // #region @Check.isUrl

    /**
	 * 判断是否为网址。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isUrl: function (value) {
        return /^(\w+:)?\/\/.+$/.test(value);
    },

    // #endregion

    // #region @Check.isIP

    /**
	 * 判断是否为 IP 地址。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isIP: function (value) {
        return /::1|localhost/.test(value) || (/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g.test(value) && +RegExp.$1 < 256 && +RegExp.$2 < 256 && +RegExp.$3 < 256 && +RegExp.$4 < 256);
    },

    // #endregion

    // #region @Check.isMobile

    /**
	 * 判断是否为手机号。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isPhone: function (value) {
        return /^(\+\d\d)?1[358]\d{9}$/.test(value);
    },

    // #endregion

    // #region @Check.isChinese

    /**
	 * 判断是否为中文。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isChinese: function (value) {
        return /^[\u4E00-\u9FA5\uFE30-\uFFA0]+$/gi.test(value);
    },

    // #endregion

    // #region @Check.isPostCode

    /**
	 * 判断是否为邮编。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isPostCode: function (value) {
        return /^\d{6}$/.test(value);
    },

    // #endregion

    // #region @Check.isId

    /**
	 * 判断是否为身份证号。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isId: function (value) {
        return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
    },

    // #endregion

    // #region @Check.isQQ

    /**
	 * 判断是否为 QQ 号。
	 * @param {String} value 要判断的字符串。
	 * @returns {Boolean} 如果检验合法则返回 true，否则返回 false。
	 */
    isQQ: function (value) {
        return /^\d{5, 12}$/.test(value) || Check.isEmail(value) || Check.isPhone(value);
    }

    // #endregion

};
