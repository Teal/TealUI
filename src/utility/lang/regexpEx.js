/**
 * @author xuld@vip.qq.com
 */

// #region @RegExp.isRegExp

/**
 * 判断一个对象是否是正则。
 * @param {Object} obj 要判断的对象。
 * @returns {Boolean} 如果 @obj 是正则则返回 @true，否则返回 @false。
 * @example RegExp.isRegExp("") // true
 */
RegExp.isRegExp = function (obj) {
    return Object.prototype.toString.call(obj) === "[object RegExp]";
};

// #endregion

// #region @RegExp.parseWildCard

/**
 * 将一个通配符表达式转为等效正则表达式。
 * @param {String} str 要转换的通配符表达式。
 * @returns {RegExp} 返回转换后的等效正则表达式。
 * @remark 通配符表达式意义：
 * 其中 * 表示匹配任意字符。
 * 其中 ? 表示匹配一个字符。
 * 如果路径以 / 开头则匹配跟目录。否则匹配任意路径部分。
 */
RegExp.parseWildCard = function(str){
	typeof console === "object" && console.assert(typeof value === "string", "RegExp.parseWildCard(str: 必须是字符串)");
	return new RegExp("(^|\/)" + str.replace(/([-.+^${}()|[\]\/\\])/g, '\\$1').replace(/\*/g, "(.*)").replace(/\?/g, "(.)") + "(\/|$)", "i");
};

// #endregion
