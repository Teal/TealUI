
/**
 * 将日期对象格式化为字符串。
 * @param {String} [format="yyyy/MM/dd HH:mm:ss"] 格式字符串。具体见下文。
 * @returns {String} 格式化后的字符串。
 * @example new Date().format("yyyy/MM/dd HH:mm:ss")
 * @remark
 * #### 格式化语法
 * 格式字符串中，以下元字符会被替换：
 * 
 * 元字符 | 意义 | 实例
 * ------|-----|--------------------
 * y     | 年  | yyyy:2014, yy:14
 * M     | 月  | MM:09, M:9
 * d     | 日  | dd:09, d:9
 * H     | 小时 | HH:13, h:13
 * y     | 分钟 | mm:06, m:6
 * y     | 秒  | ss:06, s:6
 * e     | 星期 | e:天, ee:周日, eee: 星期天
 * 
 * > #### !注意
 * > 元字符区分大小写。
 */
Date.prototype.format = function (format) {
    typeof console === "object" && console.assert(!format || typeof format === "string", "date.format([format: 必须是字符串])");
    var me = this, formators = Date._formators;
    if (!formators) {
        Date._formators = formators = {

            y: function (date, length) {
                date = date.getFullYear();
                return date < 0 ? 'BC' + (-date) : length < 3 ? date % 100 : date;
            },

            M: function (date) {
                return date.getMonth() + 1;
            },

            d: function (date) {
                return date.getDate();
            },

            H: function (date) {
                return date.getHours();
            },

            m: function (date) {
                return date.getMinutes();
            },

            s: function (date) {
                return date.getSeconds();
            },

            e: function (date, length) {
                return (length === 1 ? '' : length === 2 ? '周' : '星期') + [length === 2 ? '日' : '天', '一', '二', '三', '四', '五', '六'][date.getDay()];
            }

        };
    }
    return (format || 'yyyy/MM/dd HH:mm:ss').replace(/(\w)\1*/g, function (all, key) {
        if (key in formators) {
            key = String(formators[key](me, all.length));
            while (key.length < all.length) {
                key = '0' + key;
            }
            all = key;
        }
        return all;
    });
};
