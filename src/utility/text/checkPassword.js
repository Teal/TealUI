
/**
 * 检查一个密码的复杂度。 
 * @param {Object} value 要检查的密码。
 * @returns {Number} 数字越大，复杂度越高。
 * 
 * - 复杂度 < 0：简单密码。
 * - 复杂度 = 0：普通密码。
 * - 复杂度 > 0：复杂密码。
 * - 复杂度 > 2：安全密码。
 * 
 * @remark
 * 密码检验策略：
 * 1. 将字符分为四类：数字，小写字母，大写字母，特殊字符。种类转换次数越多越复杂。
 * 2. 重复字符、连续字符越多越简单。
 * @example checkPassword("123456") // -1
 */
function checkPassword(value) {

    var complexLevel = 0,
        i,
        equalCount = 0,
        chainCount = 0,
        oldCharCode,
        oldCharType,
        newCharCode,
        newCharType;
    for (i = 0; i < value.length; i++) {
        newCharCode = value.charCodeAt(i);
        newCharType = newCharCode >= 48 && newCharCode <= 57 ? 0 : newCharCode >= 97 && newCharCode <= 122 ? 1 : newCharCode >= 65 && newCharCode <= 90 ? 2 : 3;
        if (i) {
            if (oldCharType != newCharType) {
                complexLevel++;
            } else if (Math.abs(newCharCode - oldCharCode) <= 1) {
                if (newCharCode == oldCharCode) equalCount++;
                else chainCount++;
            }
        }
        oldCharCode = newCharCode;
        oldCharType = newCharType;
    }

    if (value.length - equalCount <= 1) 
        complexLevel -= 2;
    else if (value.length - chainCount <= 1)
        complexLevel--;

    return complexLevel;
}
