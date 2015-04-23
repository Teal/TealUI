/**
 * @author xuld
 */

/**
 * 解析中国身份证号。
 * @param {String} idNumber 身份证号。
 */
function parseChineseId(idNumber) {

    var province = parseChineseId.provinces[parseInt(idNumber.substring(0, 2))], valid = !!province;

    var birthdayYear = parseInt(idNumber.substr(6, 4)),
        birthdayMonth = parseInt(idNumber.substr(10, 2)),
        birthdayDay = parseInt(idNumber.substr(12, 2)),
        date = new Date(birthdayYear, birthdayMonth - 1, birthdayDay);

    valid = valid && date.getFullYear() == birthdayYear &&
        date.getMonth() + 1 == birthdayMonth &&
        date.getDate() == birthdayDay;

    if (valid) {
        var sum = 0;
        for (var i = 17; i >= 0; i--)
            sum += ((1 << i) % 11) * parseInt(idNumber.charAt(17 - i), 11);
        valid = sum % 11 == 1;
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