
/**
 * 检查一个密码的复杂度。 
 * @param {String} str 要检查的密码。
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
function checkPassword(str) {
    typeof console === "object" && console.assert(typeof str === "string", "checkPassword(str: 必须是字符串)");

    var complexLevel = 0;
    var equalCount = 0;
    var chainCount = 0;
    var oldCharCode;
    var oldCharType;
    for (var i = 0; i < str.length; i++) {
        var newCharCode = str.charCodeAt(i);
        var newCharType = newCharCode >= 48 && newCharCode <= 57 ? 0 : newCharCode >= 97 && newCharCode <= 122 ? 1 : newCharCode >= 65 && newCharCode <= 90 ? 2 : 3;
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

    return complexLevel - (str.length - equalCount <= 1 ? 2 : str.length - chainCount <= 1 ? 1 : 0);
}
