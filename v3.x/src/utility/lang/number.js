/**
 * @fileOverview 数字扩展。
 * @author xuld
 */

// #region @Number#format

/** 
 * 格式化当前数字为字符串。
 * @param {String} [format] 格式字符串。具体见下文。
 * @returns {String} 返回格式化后的字符串。
 * @remark
 * #### 格式化语法
 * 格式字符串中的元字符会被替换，支持的元字符有：
 * 
 * 元字符 | 意义      | 实例
 * ------|-----------|--------------------
 * 0     | 补0       | 000:012, 0.00: 2.00
 * \#    | 补空      | \#\#\#:12, 0.\#\#: 2
 * +     | 补正负号  | +0: +0
 * .     | 小数点    | 0.00: 0.00
 * ,     | 追加逗号  | 0.00: 0.00
 * 
 * @example 
 * 1..format("000.00") // 001.00
 * 
 * 1.2.format("0.00") // 1.20
 * 
 * 1.2.format("#.##") // 1.2
 * 
 * 1.235.format("#.##") // 1.24
 * 
 * 1235..format("###,###") // 1,235
 */
Number.prototype.format = function (format) {
    if (!format) {
        return this.toString();
    }

    typeof console === "object" && console.assert(typeof format === "string", "number.format(format: 必须是字符串)");
    function splitPart(str) {
        var p = str.indexOf('.');
        return [p < 0 ? str : str.substr(0, p), p < 0 ? '' : str.substr(p + 1)];
    }

    var result = splitPart(format);

    // 处理逗号。
    var comma = result[0].lastIndexOf(',');
    if (comma >= 0) {
        comma = result[0].length - comma - 1;
        result[0] = result[0].replace(/,/g, "");
    }

    var me = this, val = me < 0 ? -me : me;

    // 处理小数部分。
    result[1] = result[1].replace(/^(0*)(#*)/, function(all, zero, sharp) {
        val = splitPart(val.toFixed(all.length));
        all = val[1];
        
        // 删除 #。
        return sharp ? all.substr(0, zero.length) + all.substr(zero.length).replace(/0+$/, '') : all;
    });

    // 处理整数部分。
    result[0] = result[0].replace(/(\+?)(#*)(0*)$/, function (all, plus, sharp, zero) {
        
        // 前缀补 0。
        if (val[0].length < zero.length) {
            val[0] = new Array(zero.length - val[0].length + 1).join('0') + val[0];
        }

        // 追加 ,。
        if (comma > 0) {
            // 给 val[0] 的所有数字追加逗号。
            all = val[0].split('').reverse();
            for (var i = comma; i < all.length; i += comma) {
                all.splice(i++, 0, ',');
            }
            val[0] = all.reverse().join('');
        }

        // 追加正负号。
        return (me < 0 ? '-' : (plus ? '+' : '')) + val[0];

    });

    return result[0] + (result[1] ? '.' + result[1] : result[1]);
}

// #endregion
