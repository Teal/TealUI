// #todo


interface String {

    replaceAll(): string;

}

/**
 * 替换当前字符串内全部子字符串。
 * @param {String} from 替换的源字符串。
 * @param {String} to 替换的目标字符串。
 * @returns {String} 返回替换后的字符串。
 * @example "1121".replaceAll("1", "3") // "3323"
 */
String.prototype.replaceAll = function (from, to) {
    var str = this, p = 0;
    while ((p = str.indexOf(from), p) >= 0) {
        str = str.replace(from, to);
        p += to.length + 1;
    }
    return str;
};
