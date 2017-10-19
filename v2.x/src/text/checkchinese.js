/**
 * @author xuld
 */


//#include text/base.js

Object.extend(Text, {

	isQQ: function (value) {

	},

	//�����Ƿ�Ϊ����
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
	 * ��֤�Ƿ��Ϸ�������֤��
	 * @param {Object} value
	 */
	isId: function (value) {

	},

	isPhone: function (value) {

	},

	isTelNumber: function (value) {

	},

	/**
	 * �Ƿ�Ϊ�������롣
	 * @param {Object} value
	 */
	isPostCode: function (value) {

	}



});
