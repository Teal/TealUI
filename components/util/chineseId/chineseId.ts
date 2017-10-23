import { compareYear } from "util/date";

/**
 * 解析 18 位中国身份证号的信息。
 * @param idNumber 要解析的身份证号。
 * @return 返回一个对象，包含以下字段：
 * - valid：身份证是否合法。
 * - province：省份（自治区、直辖市）编码。
 * - city：地级市（州、盟）编码。
 * - county：县级市（区、旗）编码。
 * - birthday：生日。
 * - sex：性别。true 表示男, false 表示女。
 * @desc 本函数只验证身份证的数值特征，并不能判定身份证是否真实存在。
 * @example parseChineseId("152500198909267865")
 */
export function parseChineseId(idNumber: string) {

    const province = +idNumber.substr(0, 2);
    const city = +idNumber.substr(2, 2);
    const county = +idNumber.substr(4, 2);

    // 身份证 6 - 13 表示生日。
    const birthdayYear = +idNumber.substr(6, 4);
    const birthdayMonth = +idNumber.substr(10, 2) - 1;
    const birthdayDay = +idNumber.substr(12, 2);
    const birthday = new Date(birthdayYear, birthdayMonth, birthdayDay);

    // 身份证 17 表示检验码。
    let valid = province > 10 && city >= 0 && county >= 0 &&
        birthday.getFullYear() === birthdayYear &&
        birthday.getMonth() === birthdayMonth &&
        birthday.getDate() === birthdayDay;
    if (valid) {
        let code = 0;
        for (let i = 0; i < 18; i++) {
            const bit = idNumber.charCodeAt(17 - i);
            code += ((1 << i) % 11) * (!i && (bit | 32) === 120 /*x*/ ? 10 : bit > 47 && bit < 58 ? bit - 48 : NaN);
        }
        valid = code % 11 === 1;
    }

    // 身份证 16 表示性别。
    return {

        /**
         * 判断身份证是否合法。
         */
        valid,

        /**
         * 获取身份证的省份（自治区、直辖市）编码。
         */
        province,

        /**
         * 获取身份证的地级市（州、盟）编码。
         */
        city,

        /**
         * 获取身份证的县级市（区、旗）编码。
         */
        county,

        /**
         * 获取身份证的生日。
         */
        birthday,

        /**
         * 获取身份证的性别。true 表示男, false 表示女。
         */
        sex: idNumber.charCodeAt(16) % 2 === 1

    };
}

/**
 * 从 18 位身份证号提取周岁。
 * @param idNumber 要解析的身份证号。
 * @param now 当前时间。
 * @return 返回周岁。如果无法读取身份证号的生日信息则返回 NaN。
 * @example getAgeFromChineseId("152500198909267865")
 */
export function getAgeFromChineseId(idNumber: string, now = new Date()) {
    return compareYear(now, new Date(idNumber.slice(6, 14).replace(/(\d{4})(\d\d)(\d\d)/, "$1/$2/$3")));
}
