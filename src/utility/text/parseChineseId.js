/**
 * @fileOverview 解析中国身份证号的信息。
 * @author xuld
 */

/**
 * 解析中国身份证号。
 * @param {String} idNumber 身份证号。
 * @returns {Object} 返回一个 JSON，其中，valid: true 表示身份证信息合法。province: '北京' 表示省份。birthday: new Date(2000,1,1) 表示生日。sex: '男' 表示性别。
 */
function parseChineseId(idNumber) {

    var province = parseChineseId.provinces[idNumber.substring(0, 2)],
        birthdayYear = +idNumber.substr(6, 4),
        birthdayMonth = +idNumber.substr(10, 2),
        birthdayDay = +idNumber.substr(12, 2),
        date = new Date(birthdayYear, birthdayMonth - 1, birthdayDay),
        valid = province && date.getFullYear() == birthdayYear &&
        date.getMonth() + 1 == birthdayMonth &&
        date.getDate() == birthdayDay,
        i;

    // 检验身份证号。
    if (valid) {
        valid = 0;
        for (i = 0; i < 18; i++)
            valid += ((1 << i) % 11) * (/^x$/i.test(idNumber.charAt(17 - i)) ? 10 : parseInt(idNumber.charAt(17 - i), 11));
        valid = valid % 11 == 1;
    }

    return {
        valid: valid,
        province: province,
        birthday: date,
        sex: (+idNumber.substr(16, 1) % 2) === 1 ? '男' : '女'
    };

};

parseChineseId.provinces = {
    '11': '北京',
    '12': '天津',
    '13': '河北',
    '14': '山西',
    '15': '内蒙古',
    '21': '辽宁',
    '22': '吉林',
    '23': '黑龙江',
    '31': '上海',
    '32': '江苏',
    '33': '浙江',
    '34': '安徽',
    '35': '福建',
    '36': '江西',
    '37': '山东',
    '41': '河南',
    '42': '湖北',
    '43': '湖南',
    '44': '广东',
    '45': '广西',
    '46': '海南',
    '50': '重庆',
    '51': '四川',
    '52': '贵州',
    '53': '云南',
    '54': '西藏',
    '61': '陕西',
    '62': '甘肃',
    '63': '青海',
    '64': '宁夏',
    '65': '新疆',
    '71': '台湾',
    '81': '香港',
    '82': '澳门',
    '91': '国外'
};
