/**
 * 首尾空格。
 */
export const space = /^\s*|\s*$/g;

/**
 * 空白行。
 */
export const blankLine = /\r?\n\s*\r?\n/;

/**
 * 包含双字节字符。
 */
export const wideChar = /[\x00-\xff]/;

/**
 * 字母。
 */
export const letter = /^[A-Za-z]*$/;

/**
 * 小写字母。
 */
export const letterLowerCase = /^[a-z]*$/;

/**
 * 大写字母。
 */
export const letterUpperCase = /^[A-Z]*$/;

/**
 * 字母或数字。
 */
export const letterOrDight = /^[A-Za-z\d]*$/;

/**
 * 含有特殊符号。
 */
export const symbol = /[%&',;=?$\x22]/;

/**
 * 数字。
 */
export const number = /^[+-]?\d+(\.\d+)?$/;

/**
 * 零或正整数。
 */
export const integer = /^(0|[1-9]\d*)$/;

/**
 * 全数字。
 */
export const digit = /^\d*$/;

/**
 * 十六进制数字。
 */
export const hex = /^[\da-fA-F]*$/;

/**
 * 八进制数字。
 */
export const octal = /^[0-7]*$/;

/**
 * 二进制数字。
 */
export const binary = /^[01]*$/;

/**
 * 合法标志名（字母、数字或下划线，但不允许数字开头）。
 */
export const identifier = /^[a-zA-Z_]\w*$/;

/**
 * 金额。
 */
export const currency = /^(0|[1-9]\d*)+(.\d\d?)?$/;

/**
 * 合法路径。
 */
export const path = /^[^<>;:/\\?*"|]+$/;

/**
 * 是否是地址。
 */
export const url = /^[a-zA-z]+:\/\//;

/**
 * 邮箱。
 */
export const email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

/**
 * IP地址。
 */
export const ip = /^((25[0-5]|2[0-4]\\d|[01]?\\d?\\d)(\\.25[0-5]|2[0-4]\\d|[01]?\\d?\\d)){3}$/;

/**
 * 域名。
 */
export const domain = /[a-zA-Z\d][-a-zA-Z\d]{0,62}(\/.[a-zA-Z\d][-a-zA-Z\d]{0,62})+/;

/**
 * 日期时间。
 */
export const datetime = /^\d{4}[-/]\d\d?[-/]\d\d?\s+\d\d?:\d\d?:\d\d?$/;

/**
 * 日期。
 */
export const date = /^\d{4}[-/]\d\d?[-/]\d\d?$/;

/**
 * 时间。
 */
export const time = /^\d\d?:\d\d?:\d\d?$/;

/**
 * 年。
 */
export const year = /^\d{4}$/;

/**
 * 月份。
 */
export const month = /^(0?[1-9]|1[0-2])$/;

/**
 * 天。
 */
export const day = /^((0?[1-9])|((1|2)[0-9])|30|31)$/;

/**
 * 小时。
 */
export const hour = /^\d|1\d|2[0-3]$/;

/**
 * 分钟或秒。
 */
export const minute = /^\d|[1-5]\d$/;

/**
 * 包含 HTML 片段。
 */
export const html = /<(\S*?)[^>]*>/;

/**
 * XML 文档。
 */
export const xmlDocument = /^([a-zA-Z]+-?)+[a-zA-Z0-9]+\\.[x|X][m|M][l|L]$/;

/**
 * 合法账号。
 */
export const userName = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;

/**
 * 密码（以字母开头，长度在6~18之间，只能包含字母、数字和下划线）。
 */
export const password = /^[a-zA-Z]\w{5,17}$/;

/**
 * 强密码（必须包含大小写字母和数字的组合，不能使用特殊字符，长度在 8-10 之间）。
 */
export const passwordSafe = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/;

/**
 * 包含中文。
 */
export const chinese = /[\u4e00-\u9fa5]/;

/**
 * 中国身份证。
 */
export const chineseId = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$/;

/**
 * 中国邮政编码。
 */
export const chinesePostCode = /^[1-9]\d{5}(?!\d)$/;

/**
 * 腾讯 QQ 号。
 */
export const qq = /^[1-9][0-9]{4,}$/;

/**
 * 手机号。
 */
export const phone = /^(13\d|14[5|7]|15\d|18\d)\d{8}$/;

/**
 * 手机号。
 */
export const tel = /^(\(\d{3,4}-)|\d{3.4}-)?\d{7,8}$/;
