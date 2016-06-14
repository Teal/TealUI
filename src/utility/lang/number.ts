/**
 * @fileOverview 数字(Number)扩展
 */

declare global {

    interface NumberConstructor {

        /**
         * 判断一个对象是否是数字。
         * @param obj 要判断的对象。
         * @returns 如果是数字则返回 @true，否则返回 @false。
         * @example Number.isNumber(7) // true
         */
        isNumber(obj: any): boolean;

        /**
         * 确保指定数值在指定区间内。
         * @param num 要判断的值。
         * @param min 允许的最小值。
         * @param max 允许的最大值。
         * @returns 如果 *num* 超过 *min* 和 *max*，则返回临界值，否则返回 *num*。
         * @example Number.limit(1, 2, 6) // 2
         */
        limit(num: number, min: number, max: number): number;

        /**
         * 返回指定范围的随机整数值。
         * @param min 最小的整数值。
         * @param max 最大的整数值。
         * @returns 返回结果值。其值满足 *min* <= 返回值 < *max*。
         * @example Number.random(2, 6)
         */
        random(min: number, max: number): number;

    }

    interface Number {

        /**
         * 获取当前数字的精度。
         * @returns 返回精度。
         */
        getPrecision(): number;

        /** 
         * 格式化当前数字为字符串。
         * @param format 格式字符串。具体见下文。
         * @returns 返回格式化后的字符串。
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
         * @example 1..format("000.00") // 001.00
         * @example 1.2.format("0.00") // 1.20
         * @example 1.2.format("#.##") // 1.2
         * @example 1.235.format("#.##") // 1.24
         * @example 1235..format("###,###") // 1,235
         */
        format(format: string): string;

    }

}

export module isNumber {

    /**
     * 判断一个对象是否是数字。
     * @param obj 要判断的对象。
     * @returns 如果是数字则返回 @true，否则返回 @false。
     * @example Number.isNumber(7) // true
     */
    Number.isNumber = function (obj: any) {
        return typeof obj === 'number' && !isNaN(obj);
    };

}

export module limit {

    /**
     * 确保指定数值在指定区间内。
     * @param num 要判断的值。
     * @param min 允许的最小值。
     * @param max 允许的最大值。
     * @returns 如果 *num* 超过 *min* 和 *max*，则返回临界值，否则返回 *num*。
     * @example Number.limit(1, 2, 6) // 2
     */
    Number.limit = function (num: number, min: number, max: number) {
        return Math.min(max, Math.max(min, num));
    };

}

export module random {

    /**
     * 返回指定范围的随机整数值。
     * @param min 最小的整数值。
     * @param max 最大的整数值。
     * @returns 返回结果值。其值满足 *min* <= 返回值 < *max*。
     * @example Number.random(2, 6)
     */
    Number.random = function (min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

}

export module format {

    /** 
     * 格式化当前数字为字符串。
     * @param format 格式字符串。具体见下文。
     * @returns 返回格式化后的字符串。
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
     * @example 1..format("000.00") // 001.00
     * @example 1.2.format("0.00") // 1.20
     * @example 1.2.format("#.##") // 1.2
     * @example 1.235.format("#.##") // 1.24
     * @example 1235..format("###,###") // 1,235
     */
    Number.prototype.format = function (format: string) {
        if (!format) {
            return this.toString();
        }

        let result = splitPart(format);

        // 处理逗号。
        let comma = result[0].lastIndexOf(',');
        if (comma >= 0) {
            comma = result[0].length - comma - 1;
            result[0] = result[0].replace(/,/g, "");
        }

        let val = this < 0 ? -this : this;

        // 处理小数部分。
        result[1] = result[1].replace(/^(0*)(#*)/, (all: string, zero: string, sharp: string) => {
            val = splitPart(val.toFixed(all.length));
            all = val[1];

            // 删除 #。
            return sharp ? all.substr(0, zero.length) + all.substr(zero.length).replace(/0+$/, '') : all;
        });

        // 处理整数部分。
        result[0] = result[0].replace(/(\+?)(#*)(0*)$/, (all: string, plus: string, sharp: string, zero: string) => {

            // 前缀补 0。
            if (val[0].length < zero.length) {
                val[0] = new Array(zero.length - val[0].length + 1).join('0') + val[0];
            }

            // 追加 ,。
            if (comma > 0) {
                // 给 val[0] 的所有数字追加逗号。
                let allParts = val[0].split('').reverse();
                for (var i = comma; i < all.length; i += comma) {
                    allParts.splice(i++, 0, ',');
                }
                val[0] = allParts.reverse().join('');
            }

            // 追加正负号。
            return (this < 0 ? '-' : (plus ? '+' : '')) + val[0];

        });

        return result[0] + (result[1] ? '.' + result[1] : result[1]);

        function splitPart(value: string) {
            const p = value.indexOf('.');
            return [p < 0 ? value : value.substr(0, p), p < 0 ? '' : value.substr(p + 1)];
        }

    };

}

export module getPrecision {

    /**
     * 获取当前数字的精度。
     * @returns 返回精度。
     */
    Number.prototype.getPrecision = function () {
        const s = this + "";
        const d = s.indexOf('.') + 1;
        return !d ? 0 : s.length - d;
    };

}