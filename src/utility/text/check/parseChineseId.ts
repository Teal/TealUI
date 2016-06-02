/**
 * @fileOverview 解析中国身份证号。
 * @author xuld@vip.qq.com
 */

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
export default function parseChineseId(value: string) {

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
