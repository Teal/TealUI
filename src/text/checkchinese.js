/**
 * @author xuld
 */


using("System.Text.Base");

Object.extend(Text, {

	isQQ: function (value) {

	},

	//检查是否为中文
	isChinese: function (value) {
		return /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])+$/gi.test(value);
	},

	isMobile: function (value) {
		return /^1[358]\d{9}$/.test(value);
	},

	isPhone: function (value) {
		return /^(\d{3,4}-)?\d{7,8}$/.test(value);
	},

	/**
	 * 验证是否合法的身份证。
	 * @param {Object} value
	 */
	isId: function (value) {

	},

	isPhone: function (value) {

	},

	isTelNumber: function (value) {

	},

	/**
	 * 是否为邮政编码。
	 * @param {Object} value
	 */
	isPostCode: function (value) {

	}



});
