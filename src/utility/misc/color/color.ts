// #todo

/**
 * @fileOverview 表示一个颜色对象。
 * @author xuld@vip.qq.com
 */

/**
 * 表示一个颜色对象。
 * @param {Number} [r] 颜色的 R 值。
 * @param {Number} [g] 颜色的 G 值。
 * @param {Number} [b] 颜色的 B 值。
 * @param {String} [color] 颜色字符串。支持的字符串颜色格式有：
 * - `"#FFFFFF"`
 * - `"#FFFFFFFF"`
 * - `"#FFF"`
 * - `"rgb(255, 255, 255)"`
 * - `"rgba(255, 255, 255, .7)"`
 * - `"hsl(360, 100%, 100%)"`
 * - `"hsla(360, 100%, 100%, .7)"`
 * - `"transparent"`/`"none"`/其它内置颜色名
 * @param {Number} [a=1.0] 
 * @class
 * @example 
 * new Color(255, 255, 255, 0.5)
 * 
 * new Color("#FFFFFF", 0.5)
 * 
 * new Color("rbga(255, 255, 255, 0.5)")
 */
function Color(r, g, b, a) {

    if (arguments.length < 3) {

        typeof console === "object" && console.assert(typeof r === "string", "new Color(rgb: 必须是字符串, [a])");

        // 转换系统内置颜色。
        r = Color.colors[r] || r;

        // 每部分格式：
        // 0：#FFF
        // 1：#FFFFFF
        // 2：rgb(255, 255, 255), rgba(255, 255, 255, .7)
        // 3：hsl(360, 100%, 100%), hsla(360, 100%, 100%, .7)
        // 4：其它

        function parsePercent(str) {
            if (str) {
                var val = parseFloat(str);
                return /%$/.test(str) ? val / 100 : val;
            }
        }

        if (/^[#0-9a-f]*$/i.test(r)) {
            if (r.length < 5) {
                r = r.replace(/([0-9a-f])/ig, "$1$1");
            }
            var match = r.match(/[0-9a-f]{2}/ig) || [];
            r = parseInt(match[0], 16);
            g = parseInt(match[1], 16);
            b = parseInt(match[2], 16);
            a = match[3] && parseInt(match[3], 16);
        } else {
            var match = r.match(/([\.\d]{1,3})%?/g) || [];
            if (/^hsl/i.test(r)) {
                return Color.fromHSL(parseInt(match[0]), parsePercent(match[1]), parsePercent(match[2]), parsePercent(match[3]));
            }
            r = parseInt(match[0]);
            g = parseInt(match[1]);
            b = parseInt(match[2]);
            a = parsePercent(match[3]);
        }
    }

    var me = this;
    me.r = Math.max(0, Math.min(256, r)) || 0;
    me.g = Math.max(0, Math.min(256, g)) || 0;
    me.b = Math.max(0, Math.min(256, b)) || 0;
    me.a = a != null ? Math.max(0, Math.min(1, a)) || 0 : 1;
}

Color.prototype = {
    constructor: Color,

    /**
     * 获取当前颜色的 R 值。
     */
    r: 0,

    /**
     * 获取当前颜色的 G 值。
     */
    g: 0,

    /**
     * 获取当前颜色的 B 值。
     */
    b: 0,

    /**
     * 获取当前颜色的透明度。
     */
    a: 0,

    /**
     * 获取当前颜色的 HSL 格式。
     * @returns {Object} 返回一个对象：
     * * @param {Number} h 当前颜色的色调。
     * * @param {Number} s 当前颜色的饱和度。
     * * @param {Number} l 当前颜色的亮度。
     * @example new Color("#fff").toHSL()
     */
    toHSL: function () {
        var me = this;
        var r = me.r / 255;
        var g = me.g / 255;
        var b = me.b / 255;

        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h;
        var s;
        var l = (max + min) / 2;
        var d = max - min;

        if (d) {
            h = (max === r ? (g - b) / d + (g < b ? 6 : 0) :
                max === g ? (b - r) / d + 2 :
            (r - g) / d + 4) * 60;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        } else {
            h = s = 0;
        }
        return { h: h, s: s, l: l, v: max, a: me.a };
    },

    /**
     * 获取当前颜色的 HSV 格式。
     * @returns {Object} 返回一个对象：
     * * @param {Number} h 当前颜色的色调。
     * * @param {Number} s 当前颜色的饱和度。
     * * @param {Number} l 当前颜色的亮度。
     * @example new Color("#fff").toHSV()
     */
    toHSV: function () {
        var me = this;
        var r = me.r / 255;
        var g = me.g / 255;
        var b = me.b / 255;

        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);

        var d = max - min;

        return {
            h: d ? (max === r ? (g - b) / d + (g < b ? 6 : 0) :
                    max === g ? (b - r) / d + 2 :
                (r - g) / d + 4) * 60 : 0,
            s: max ? d / max : 0,
            v: max,
            a: me.a
        };
    },

    /**
     * 获取当前颜色的 RGB 格式。
     * @returns {Object} 返回一个对象：
     * * @param {Number} r 当前颜色的 R 值。
     * * @param {Number} g 当前颜色的 G 值。
     * * @param {Number} b 当前颜色的 B 值。
     * @example new Color("#fff").toRGB()
     */
    toRGB: function () {
        return this;
    },

    /**
     * 获取当前颜色的哈希值表示形式。
     * @returns {String} 返回哈希值表示形式。如 "#FFFFFF"。
     * @example new Color("#fff").toHex()
     */
    toHex: function () {
        var me = this;
        function toHex(val) {
            val = Math.round(val).toString(16);
            return val.length < 2 ? '0' + val : val;
        }
        return '#' + (me.a < 1 ? toHex(me.a) : "") + toHex(me.r) + toHex(me.g) + toHex(me.b);
    },

    /**
     * 获取当前颜色的整数表示形式。
     * @returns {Number} 返回整数表示形式。
     * @example new Color("#fff").toInt()
     */
    toInt: function () {
        var me = this;
        return me.r << 16 | me.g << 8 | me.b | me.a << 24;
    },

    /**
     * 获取当前颜色的字符串形式。
     * @returns {String} 返回可以直接在 CSS 代码中使用的字符串形式。
     * @example new Color("#fff").toString()
     */
    toString: function () {
        var me = this;
        return me.a < 1 ? "rgba(" + me.r + "," + me.g + "," + me.b + "," + me.a + ")" : me.toHex();
    },

    /**
     * 计算当前颜色值增加指定饱和度后的颜色值。
     * @param {Number} value 增加的数值。范围应在 0-1 之间。
     * @returns {Color} 返回新颜色对象。
     * @example new Color("#fff").saturate(0.5)  
     */
    saturate: function (value) {
        var hsl = this.toHSL();
        hsl.s += value;
        return Color.fromHSL(hsl);
    },

    /**
     * 调整当前颜色的暗度。
     * @param {Number} value 调整的幅度。值在 0 到 1 之间。
     * @returns {Color} 返回新颜色。 
     * @example new Color("#fff").darken(0.5) 
     */
    darken: function (value) {
        var hsl = this.toHSL();
        hsl.l -= value;
        return Color.fromHSL(hsl);
    },

    /**
     * 调整当前颜色的透明度。
     * @param {Number} value 调整的幅度。值在 0 到 1 之间。
     * @returns {Color} 返回新颜色。
     * @example new Color("#fff").fadeBy(0.5) 
     */
    fadeBy: function (value) {
        return this.fadeTo(this.a + value);
    },

    /**
     * 设置当前颜色的透明度。
     * @param {Number} value 调整的幅度。值在 0 到 1 之间。
     * @returns {Color} 返回新颜色。 
     * @example new Color("#fff").fadeTo(0.5) 
     */
    fadeTo: function (value) {
        var me = this;
        return new Color(me.r, me.g, me.b, value);
    },

    /**
     * 调整当前颜色的色相。
     * @param {Number} value 调整的幅度。值在 0 到 360 之间。
     * @returns {Color} 返回新颜色。 
     * @example new Color("#fff").spin(100) 
     */
    spin: function (value) {
        var hsl = this.toHSL();
        hsl.h += value;
        return Color.fromHSL(hsl);
    },

    /**
     * 叠加当前颜色和目标颜色的值。
     * @param {Color} color 另一个颜色值。
     * @param {Number} [weight=0.5] 当前颜色叠加的透明度。
     * @returns {Color} 返回叠加后的新颜色。 
     * @example new Color("#0f0").mix(new Color("#f00")) 
     */
    mix: function (color, weight) {
        var me = this;
        if (weight == null) {
            weight = 0.5;
        }
        var w = weight * 2 - 1;
        var a = me.a - color.a;

        var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
        var w2 = 1 - w1;

        return new Color(me.r * w1 + color.r * w2, me.g * w1 + color.g * w2, me.b * w1 + color.b * w2, me.a * weight + color.a * (1 - weight));
    },

    /**
     * 获取当前颜色的亮度。
     * @returns {Number} 返回亮度。值在 0-1 之间。 
     * @example new Color("#fff").luma() 
     */
    luma: function () {
        var me = this;
        var r = me.r / 255;
        var g = me.g / 255;
        var b = me.b / 255;

        r = (r <= 0.03928) ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4);
        g = (g <= 0.03928) ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4);
        b = (b <= 0.03928) ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4);

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    },

    /**
     * 计算当前颜色的最合理反色。
     * @param {Color} [dark=new Color(0, 0, 0)] 深色使用色。
     * @param {Color} [light=new Color(255, 255, 255)] 浅色使用色。
     * @param {Number} [threshold=0.43] 区分度阀值。
     * @returns {Color} 返回 @dark 和 @light 中能用于区分的颜色。
     * @example new Color("#fff").contrast() 
     */
    contrast: function (dark, light, threshold) {

        if (!dark) {
            dark = new Color(0, 0, 0);
        }
        if (!light) {
            light = new Color(255, 255, 255);
        }
        if (threshold == null) {
            threshold = 0.43;
        }

        // 确保明暗颜色值。
        if (dark.luma() > light.luma()) {
            var t = light;
            light = dark;
            dark = t;
        }

        return this.luma() < threshold ? light : dark;
    },

    /**
     * 获取当前颜色的反色。
     * @returns {Color} 返回新颜色。
     * @example new Color("#fff").invert()
     */
    invert: function () {
        var me = this;
        return new Color(255 - me.r, 255 - me.g, 255 - me.b, me.a);
    }

};

/**
 * 从已有的 HSL 格式颜色值创造新的颜色值。
 * @param {Number} [h] 当前颜色的色调。
 * @param {Number} [s] 当前颜色的饱和度。
 * @param {Number} [l] 当前颜色的亮度。
 * @param {Object} [hsl] 当前颜色的 HSL 对象。
 * @param {Number} [a=1] 当前颜色的透明度。
 * @returns {Color} 返回新颜色对象。 
 * @example 
 * Color.fromHSL(0, 0, 1, 1)
 * 
 * Color.fromHSL({h: 0, s:0, l:1, a:1})
 */
Color.fromHSL = function (h, s, l, a) {

    // 支持传递对象。
    if (arguments.length < 2) {
        a = h.a;
        l = h.l;
        s = h.s;
        h = h.h;
    }

    h = (h % 360) / 360;
    s = Math.max(0, Math.min(1, s)) || 0;
    l = Math.max(0, Math.min(1, l)) || 0;

    var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
    var m1 = l * 2 - m2;

    function hue(h) {
        h = h < 0 ? h + 1 : (h > 1 ? h - 1 : h);
        return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 :
            h * 2 < 1 ? m2 :
            h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 :
            m1) * 255;
    }
    return new Color(hue(h + 1 / 3), hue(h), hue(h - 1 / 3), a);
};

/**
 * 系统预定义颜色。
 * @inner
 */
Color.colors = {
    'transparent': "rgba(255, 255, 255, 0)",
    'none': "rgba(0, 0, 0, 0)"
};
