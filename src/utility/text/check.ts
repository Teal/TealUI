/**
 * @fileOverview 数据检验。
 * @description 提供数据校验的功能。
 */

// #region 字符

/**
 * 判断指定字符串是否为数字。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isDight("1") // true
 */
export function isDight(value: string) {
    return /^\d+$/.test(value);
}

/**
 * 判断指定字符串是否为数字。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isNumber("-45.35") // true
 */
export function isNumber(value: string) {
    return /^[-]?\d+(\.\d*)$/.test(value);
}

/**
 * 判断指定字符串是否为字母。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isLetter("abc") // true
 */
export function isLetter(value: string) {
    return /^[a-zA-Z]+$/.test(value);
}

/**
 * 判断指定字符串是否为字母或数字。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isLetterOrDight("x09") // true
 */
export function isLetterOrDight(value: string) {
    return /^[a-zA-Z\d]+$/.test(value);
}

/**
 * 判断指定字符串是否为整数。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isInt("-45") // true
 */
export function isInt(value: string) {
    return /^[-]?\d+$/.test(value);
}

// #endregion

// #region 格式

/**
 * 判断指定字符串是否为合法的邮箱地址。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true；否则返回 false。
 * @example isEmail("work&#64;xuld.net") // true
 */
export function isEmail(value: string) {
    return /^[\u4E00-\u9FA5\uFE30-\uFFA0\w][\u4E00-\u9FA5\uFE30-\uFFA0\w-+\.]*@[\u4E00-\u9FA5\uFE30-\uFFA0\w]+(\.[\u4E00-\u9FA5\uFE30-\uFFA0\w]+)+$/.test(value);
}

/**
 * 判断指定字符串是否为日期。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isDate("2014/1/1") // true
 */
export function isDate(value: string) {
    return !!+new Date(value.replace(/(\d{4})\D*(\d\d?)\D*(\d\d?)/, "$1/$2/$3"));
}

/**
 * 判断指定年月日对应的日期是否存在。
 * @param year 要判断的年。
 * @param month 要判断的月。
 * @param day 要判断的日。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isValidDate(2015, 2, 29) // false
 * @example isValidDate(2016, 2, 29) // true
 */
export function isValidDate(year: number, month: number, day: number) {
    const date = new Date(year, --month, day);
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}

/**
 * 判断指定字符串是否为 JavaScript 标识符。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isIndentifier("x09") // true
 */
export function isIndentifier(value: string) {
    return /^[\u4E00-\u9FA5\uFE30-\uFFA0a-zA-Z_$][\u4E00-\u9FA5\uFE30-\uFFA0\w$]+$/.test(value);
}

/**
 * 判断指定字符串是否为 IP 地址。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isIP("127.0.0.1") // true
 */
export function isIP(value: string) {
    return /^(?:localhost|::1|(?:[01]?\d?\d|2[0-4]\d|25[0-5])(\.(?:[01]?\d?\d|2[0-4]\d|25[0-5])){3})$/.test(value);
}

/**
 * 判断指定字符串是否为手机号。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isPhone("+8613211111111") // true
 */
export function isPhone(value: string) {
    return /^(\+\d\d)?1\d{10}$/.test(value);
}

/**
 * 判断指定字符串是否为邮编号码。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isPostCode("310000") // true
 */
export function isPostCode(value: string) {
    return /^\d{6}$/.test(value);
}

/**
 * 判断指定字符串是否为网址。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isUrl("http://teal.github.io/") // true
 */
export function isUrl(value: string) {
    return /^(\w+:)?\/\/.+$/.test(value);
}

/**
 * 检查密码的复杂度。 
 * @param value 要检查的密码。
 * @returns 返回一个整数。值越大表示复杂度越高。具体范围如下：        
 * - 复杂度 < 0：简单密码。
 * - 复杂度 = 0：普通密码。
 * - 复杂度 > 0：复杂密码。
 * - 复杂度 > 2：安全密码。
 * @remark
 * 密码检验策略：       
 * 1. 将字符分为四类：数字，小写字母，大写字母，特殊字符。种类转换次数越多越复杂。
 * 2. 重复字符、连续字符越多越简单。
 * @example checkPassword("123456") // -1
 */
export function checkPassword(value: string) {

    let complexLevel = 0;
    let equalCount = 0;
    let chainCount = 0;
    let oldCharCode;
    let oldCharType;
    for (let i = 0; i < value.length; i++) {
        const newCharCode = value.charCodeAt(i);
        const newCharType = newCharCode >= 48 && newCharCode <= 57 ? 0 : newCharCode >= 97 && newCharCode <= 122 ? 1 : newCharCode >= 65 && newCharCode <= 90 ? 2 : 3;
        if (i) {
            if (oldCharType !== newCharType) {
                complexLevel++;
            } else if (Math.abs(newCharCode - oldCharCode) <= 1) {
                if (newCharCode === oldCharCode) {
                    equalCount++;
                } else {
                    chainCount++;
                }
            }
        }
        oldCharCode = newCharCode;
        oldCharType = newCharType;
    }

    return complexLevel - (value.length - equalCount <= 1 ? 2 : value.length - chainCount <= 1 ? 1 : 0);
}

/**
 * 判断指定字符串是否为英文。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isEnglish("Hello") // true
 */
export function isEnglish(value: string) {
    return /^[-\w ]+$/gi.test(value);
}

// #endregion

// #region 中文

/**
 * 判断指定字符串是否为 QQ 号。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isQQ("10000") // true
 */
export function isQQ(value: string) {
    return /^\d{5,12}$/.test(value);
}

/**
 * 判断指定字符串是否为中文。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isChinese("你好") // true
 */
export function isChinese(value: string) {
    return /^[\u4E00-\u9FA5\uFE30-\uFFA0]+$/gi.test(value);
}

/**
 * 判断指定字符串是否为身份证号。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isId("152500198909267865") // true
 */
export function isChineseId(value: string) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
}

/**
 * 解析中国身份证号的信息。
 * @param value 要解析的身份证号。
 * @returns 返回一个 JSON，其格式为：
 * 
 *      {
 *           "valid": true,      // 表示身份证信息合法。
 *           "province": "北京", // 表示省份。
 *           "birthday": Date(), // 表示生日。
 *           "sex": "男"         // 表示性别。
 *      }
 * 
 * @example parseChineseId("152500198909267865")
 * @remark > 注意：本函数只检验身份证的数值特征，本函数认为非法的身份证必然是非法的，本函数认为合法的身份证可能实际是不存在的。
 */
export function parseChineseId(value: string) {

    // 身份证 0 - 1 表示省份(省,自治区,直辖市)。
    const province = ({
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    })[value.substr(0, 2)];

    // 身份证 2 - 3 表示地区(市,州, 盟)。
    // 身份证 4 - 5 表示县(旗,镇,区)。
    // FIXME: 限于代码篇幅，此处不作校验。

    // 身份证 6 - 13 表示生日。
    const birthdayYear = +value.substr(6, 4);
    const birthdayMonth = +value.substr(10, 2) - 1;
    const birthdayDay = +value.substr(12, 2);
    const birthday = new Date(birthdayYear, birthdayMonth, birthdayDay);

    // 身份证 17 表示检验码。
    let valid = province &&
        birthday.getFullYear() === birthdayYear &&
        birthday.getMonth() === birthdayMonth &&
        birthday.getDate() === birthdayDay;
    if (valid) {
        let code = 0;
        for (let i = 0; i < 18; i++) {
            const bit = value.charCodeAt(17 - i);
            code += ((1 << i) % 11) * (!i && (bit | 32) === 120/*x*/ ? 10 : bit > 47 && bit < 58 ? bit - 48 : NaN);
        }
        valid = code % 11 === 1;
    }

    // 身份证 16 表示性别。
    return {

        /**
         * 判断当前身份证是否合法。
         */
        valid,

        /**
         * 获取当前身份证的省份名。
         */
        province,

        /**
         * 获取当前身份证的生日。
         */
        birthday,

        /**
         * 获取当前身份证的性别。true 表示 '男', false 表示 '女'。
         */
        sex: value.charCodeAt(16) % 2 === 1

    };
};

// #endregion
