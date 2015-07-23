/**
 * @fileOverview 数字扩展。
 * @author xuld
 */

// #region @Number#format

/** 
 * 格式化当前数字。
 * @param {String} [format] 数字的格式，其中的元字符会被替换。支持的元字符见下表：
 * 
 * 元字符 | 意义      | 实例
 * 0     | 空位补0   | 000:012, 0.00: 2.00
 * +     | 补为正负号 | +0: +0
 * .     | 补为小数点 | 0.00: 0.00
 * 
 * @returns {String} 返回格式化后的字符串。
 * @example 1..format("000.00") // 001.00
 */
Number.prototype.format = function (format) {
    if (!format) {
        return this.toString();
    }

    var me = this,
        result = '',
        p = format.indexOf('.'),
        intPart = p < 0 ? format : format.substr(0, p),
        floatPart = p < 0 ? '' : format.substr(p),
        appendNegative = intPart.indexOf('+') >= 0;

    intPart = intPart.replace(/(0+)/g, function (n) {
        var s = (me < 0 ? -me : me).toFixed(0);
        return (!appendNegative && me < 0 ? '-' : '') + new Array(n.length - s.length + 1).join('0') + s;
    });

    if (appendNegative && me < 0) {
        intPart = intPart.replace(/\+/g, '-');
    }

    floatPart = floatPart.replace(/(0+)/g, function (n) {
        var s = me.toFixed(n.length);
        return s.substr(s.indexOf('.') + 1);
    });

    return intPart + floatPart;
}

// #endregion
