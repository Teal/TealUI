define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 匹配首尾空格的正则表达式。
     */
    exports.space = /^\s*|\s*$/g;
    /**
     * 匹配空白行的正则表达式。
     */
    exports.blankLine = /\r?\n\s*\r?\n/;
    /**
     * 包含双字节字符的正则表达式。
     */
    exports.wideChar = /[\x00-\xff]/;
    /**
     * 匹配字母的正则表达式。
     */
    exports.letter = /^[A-Za-z]*$/;
    /**
     * 匹配小写字母的正则表达式。
     */
    exports.letterLowerCase = /^[a-z]*$/;
    /**
     * 匹配大写字母的正则表达式。
     */
    exports.letterUpperCase = /^[A-Z]*$/;
    /**
     * 匹配字母或数字的正则表达式。
     */
    exports.letterOrDight = /^[A-Za-z\d]*$/;
    /**
     * 含有特殊符号的正则表达式。
     */
    exports.symbol = /[%&',;=?$\x22]/;
    /**
     * 匹配数字的正则表达式。
     */
    exports.number = /^[+-]?\d+(\.\d+)?$/;
    /**
     * 匹配零或正整数的正则表达式。
     */
    exports.integer = /^(0|[1-9]\d*)$/;
    /**
     * 匹配全数字的正则表达式。
     */
    exports.digit = /^\d*$/;
    /**
     * 匹配十六进制数字的正则表达式。
     */
    exports.hex = /^[\da-fA-F]*$/;
    /**
     * 匹配八进制数字的正则表达式。
     */
    exports.octal = /^[0-7]*$/;
    /**
     * 匹配二进制数字的正则表达式。
     */
    exports.binary = /^[01]*$/;
    /**
     * 匹配合法标志名（字母、数字或下划线，但不允许数字开头）的正则表达式。
     */
    exports.identifier = /^[a-zA-Z_]\w*$/;
    /**
     * 匹配金额的正则表达式。
     */
    exports.currency = /^(0|[1-9]\d*)(\.\d\d?)?$/;
    /**
     * 匹配合法路径的正则表达式。
     */
    exports.path = /^[^<>;:/\\?*"|]+$/;
    /**
     * 匹配是否是地址的正则表达式。
     */
    exports.url = /^[a-zA-z]+:\/\//;
    /**
     * 匹配邮箱的正则表达式。
     */
    exports.email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    /**
     * 匹配IP地址的正则表达式。
     */
    exports.ip = /^((25[0-5]|2[0-4]\\d|[01]?\\d?\\d)(\\.25[0-5]|2[0-4]\\d|[01]?\\d?\\d)){3}$/;
    /**
     * 匹配域名的正则表达式。
     */
    exports.domain = /[a-zA-Z\d][-a-zA-Z\d]{0,62}(\/.[a-zA-Z\d][-a-zA-Z\d]{0,62})+/;
    /**
     * 匹配日期时间的正则表达式。
     */
    exports.datetime = /^\d{4}[-/]\d\d?[-/]\d\d?\s+\d\d?:\d\d?:\d\d?$/;
    /**
     * 匹配日期的正则表达式。
     */
    exports.date = /^\d{4}[-/]\d\d?[-/]\d\d?$/;
    /**
     * 匹配时间的正则表达式。
     */
    exports.time = /^\d\d?:\d\d?:\d\d?$/;
    /**
     * 匹配年的正则表达式。
     */
    exports.year = /^\d{4}$/;
    /**
     * 匹配月份的正则表达式。
     */
    exports.month = /^(0?[1-9]|1[0-2])$/;
    /**
     * 匹配天的正则表达式。
     */
    exports.day = /^((0?[1-9])|((1|2)[0-9])|30|31)$/;
    /**
     * 匹配小时的正则表达式。
     */
    exports.hour = /^\d|1\d|2[0-3]$/;
    /**
     * 匹配分钟或秒的正则表达式。
     */
    exports.minute = /^\d|[1-5]\d$/;
    /**
     * 包含 HTML 片段的正则表达式。
     */
    exports.html = /<(\S*?)[^>]*>/;
    /**
     * 匹配 XML 文档的正则表达式。
     */
    exports.xmlDocument = /^([a-zA-Z]+-?)+[a-zA-Z0-9]+\\.[x|X][m|M][l|L]$/;
    /**
     * 匹配合法账号的正则表达式。
     */
    exports.userName = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
    /**
     * 匹配密码（以字母开头，长度在6~18之间，只能包含字母、数字和下划线）的正则表达式。
     */
    exports.password = /^[a-zA-Z]\w{5,17}$/;
    /**
     * 匹配强密码（必须包含大小写字母和数字的组合，不能使用特殊字符，长度在 8-10 之间）的正则表达式。
     */
    exports.passwordSafe = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/;
    /**
     * 匹配手机号的正则表达式。
     */
    exports.phone = /^(13\d|14[5|7]|15\d|18\d)\d{8}$/;
    /**
     * 匹配电话号码的正则表达式。
     */
    exports.telephone = /^(\(\d{3,4}-)|\d{3.4}-)?\d{7,8}$/;
    /**
     * 匹配腾讯 QQ 号的正则表达式。
     */
    exports.qq = /^[1-9][0-9]{4,}$/;
    /**
     * 包含中文的正则表达式。
     */
    exports.chinese = /[\u4e00-\u9fa5]/;
    /**
     * 匹配中国身份证的正则表达式。
     */
    exports.chineseId = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$/;
    /**
     * 匹配中国邮政编码的正则表达式。
     */
    exports.chinesePostCode = /^[1-9]\d{5}(?!\d)$/;
});
//# sourceMappingURL=regexp-lib.js.map