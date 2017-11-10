define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 判断字符串是否只包含英文字母（a-z）。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isLetter("abc") // true
     * @example isLetter("ab0") // false
     */
    function isLetter(value) {
        return /^[a-zA-Z]+$/.test(value);
    }
    exports.isLetter = isLetter;
    /**
     * 判断字符串是否只包含数字（0-9）。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isDight("1") // true
     * @example isDight("a") // false
     */
    function isDight(value) {
        return /^\d+$/.test(value);
    }
    exports.isDight = isDight;
    /**
     * 判断字符串是否只包含数字（0-9）或英文字母（a-z）。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isLetterOrDight("x09") // true
     * @example isLetterOrDight("1.2f") // false
     */
    function isLetterOrDight(value) {
        return /^[a-zA-Z\d]+$/.test(value);
    }
    exports.isLetterOrDight = isLetterOrDight;
    /**
     * 判断字符串是否表示一个整数。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isInteger("-45") // true
     * @example isInteger("-45.0") // false
     * @desc 要判断字符串能否转换为整数，可以使用 `!!parseInt("0x00")`。
     */
    function isInteger(value) {
        return /^[-+]?\d+$/.test(value);
    }
    exports.isInteger = isInteger;
    /**
     * 判断字符串是否表示一个数字。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isNumber("-45.35") // true
     * @example isNumber("0x00") // false
     * @desc 要判断字符串能否转换为数字，可以使用 `!!parseFloat("0x00")`。
     */
    function isNumber(value) {
        return /^[-+]?\d+(?:\.\d*)?$/.test(value);
    }
    exports.isNumber = isNumber;
    /**
     * 判断字符串是否表示一个日期。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isDate("2014/1/1") // true
     * @example isDate("hello") // false
     * @example isDate("2014年1月1日") // false
     */
    function isDate(value) {
        return !!+new Date(value.replace(/(\d{4})\D*(\d\d?)\D*(\d\d?)/, "$1/$2/$3"));
    }
    exports.isDate = isDate;
    /**
     * 判断字符串是否表示一个时间。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isTime("10:00:00") // true
     */
    function isTime(value) {
        return /^([0-1]?\d|2[0-3]):(\d|[0-5]\d):(\d|[0-5]\d)$/.test(value);
    }
    exports.isTime = isTime;
    /**
     * 判断字符串是否表示一个电子邮箱地址。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isEmail("bug@tealui.com") // true
     * @example isEmail("bug@@tealui.com") // false
     */
    function isEmail(value) {
        return /^[\u4E00-\u9FA5\uFE30-\uFFA0\w\-+\.]+@[\u4E00-\u9FA5\uFE30-\uFFA0\w\-]+(?:\.[\u4E00-\u9FA5\uFE30-\uFFA0\w\-]+)*$/.test(value);
    }
    exports.isEmail = isEmail;
    /**
     * 判断字符串是否表示一个 IP 地址。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isIp("127.0.0.1") // true
     */
    function isIp(value) {
        return /^(?:localhost|::1|(?:[01]?\d?\d|2[0-4]\d|25[0-5])(\.(?:[01]?\d?\d|2[0-4]\d|25[0-5])){3})$/.test(value);
    }
    exports.isIp = isIp;
    /**
     * 判断字符串是否表示一个网址。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isUrl("http://tealui.com/") // true
     */
    function isUrl(value) {
        return /^(?:\w+:)?\/\/./.test(value);
    }
    exports.isUrl = isUrl;
    /**
     * 判断字符串是否表示一个 JavaScript 标识符。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isIndentifier("x09") // true
     */
    function isIndentifier(value) {
        return /^[\u4E00-\u9FA5\uFE30-\uFFA0a-zA-Z_$][\u4E00-\u9FA5\uFE30-\uFFA0\w$]+$/.test(value);
    }
    exports.isIndentifier = isIndentifier;
    /**
     * 判断字符串是否表示一个金额（必须是正数）。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isCurrency("1") // true
     */
    function isCurrency(value) {
        return /^[1-9]\d*(\.\d\d?)?$/.test(value) || /^0?\.\d\d?$/.test(value);
    }
    exports.isCurrency = isCurrency;
    /**
     * 判断字符串是否表示一个手机号码。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isPhone("+8613211111111") // true
     */
    function isPhone(value) {
        return /^(?:\+\d\d)?1\d{10}$/.test(value);
    }
    exports.isPhone = isPhone;
    /**
     * 判断字符串是否表示一个电话号码（400 电话和国际电话除外）。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isTelephone("010-86000000") // true
     */
    function isTelephone(value) {
        return /^(?:\d{3,4}\-)?8?\d{7}$/.test(value);
    }
    exports.isTelephone = isTelephone;
    /**
     * 判断字符串是否只包含英文。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isEnglish("Hello") // true
     */
    function isEnglish(value) {
        return /^[\-a-zA-Z\s]+$/.test(value);
    }
    exports.isEnglish = isEnglish;
    /**
     * 判断字符串是否表示一个邮编号码。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isPostCode("310000") // true
     */
    function isPostCode(value) {
        return /^\d{6}$/.test(value);
    }
    exports.isPostCode = isPostCode;
    /**
     * 判断字符串是否表示一个 QQ 号。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isQQ("10000") // true
     */
    function isQQ(value) {
        return /^\d{5,13}$/.test(value);
    }
    exports.isQQ = isQQ;
    /**
     * 判断字符串是否只包含中文。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isChinese("你好") // true
     */
    function isChinese(value) {
        return /^[\u4E00-\u9FA5\uFE30-\uFFA0]+$/gi.test(value);
    }
    exports.isChinese = isChinese;
    /**
     * 判断字符串是否表示一个身份证号。
     * @param value 要判断的字符串。
     * @return 如果符合条件则返回 true，否则返回 false。
     * @example isChineseId("152500198909267865") // true
     */
    function isChineseId(value) {
        return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
    }
    exports.isChineseId = isChineseId;
});
//# sourceMappingURL=check.js.map