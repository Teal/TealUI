
/**
 * 检查一个密码的复杂度。 
 * @param {Object} value
 * @returns {Number} 数字越大，复杂度越高。如果复杂度 < 0，认为是简单， = 0，认为是普通， > 0，认为是复杂， > 2，认为是安全。
 * @remark
 * 密码检验策略：
 * 1. 将字符分为四类：数字，小写字母，大写字母，特殊字符。种类转换次数越多越复杂。
 * 2. 重复字符、连续字符越多越简单。
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

    if (value.length - equalCount <= 1) {
        complexLevel -= 2;
    } else if (value.length - chainCount <= 1) {
        complexLevel--;
    }

    return complexLevel;
}
