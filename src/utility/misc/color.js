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
 * - #FFFFFF
 * - #FFFFFFFF
 * - #FFF
 * - rgb(255, 255, 255)
 * - rgba(255, 255, 255, .7)
 * - hsl(360, 100%, 100%)
 * - hsla(360, 100%, 100%, .7)
 * - transparent/none/其它内置颜色名
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
                var val = parseInt(str);
                return /%$/.test(str) ? val / 100 : val;
            }
            return 1;
        }

        var rgba = [];
        if (/^#/.test(r)) {
            if (r.length < 5) {
                r = r.replace(/([0-9a-f])/ig, "$1$1");
            }
            var match = r.match(/[0-9a-f]{2}/ig);
            if (match) {
                r = parseInt(match[0], 16);
                g = parseInt(match[1], 16);
                b = parseInt(match[2], 16);
                a = match[3] ? parseInt(match[3], 16) : 1;
            }
        } else if (/^rgb/i.test(r)) {
            var match = r.match(/([\.\d]{1,3})%?/g);
            r = parseInt(match[0]);
            g = parseInt(match[1]);
            b = parseInt(match[2]);
            a = parsePercent(match[3]);
        } else if (/^hsl/i.test(r)) {
            var match = r.match(/([\.\d]{1,3})%?/g);
            return Color.fromHSL(parseInt(match[0]), parsePercent(match[1]), parsePercent(match[2]), parsePercent(match[3]));
        }
    }

    var me = this;
    me.r = Math.max(0, Math.min(256, r)) || 0;
    me.g = Math.max(0, Math.min(256, g)) || 0;
    me.b = Math.max(0, Math.min(256, b)) || 0;
    a = +a;
    me.a = a >= 0 && a <= 1 ? a : 1;

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
            (r - g) / d + 4) / 6;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        } else {
            h = s = 0;
        }
        return { h: h * 360, s: s, l: l, a: me.a };
    },

    toARGB: function () {
        var me = this;
        function toHex(val) {
            val = Math.round(val).toString(16);
            return val.length < 2 ? '0' + val : val;
        }
        return '#' + (me.a < 1 ? toHex(me.a) : "") + toHex(me.r) + toHex(me.g) + toHex(me.b);
    },

    toInt: function () {
        var me = this;
        return me.r << 16 | me.g << 8 | me.b | me.a << 24;
    },

    /**
     * 获取当前颜色的字符串形式。
     * @returns {} 
     */
    toString: function () {
        var me = this;
        return me.a < 1 ? "rgba(" + me.r + "," + me.g + "," + me.b + "," + me.a + ")" : me.toARGB();
    },

    /**
     * 计算当前颜色值增加指定饱和度后的颜色值。
     * @param {Number} value 增加的数值。范围应在 0-1 之间。
     * @returns {Color} 返回新颜色对象。 
     */
    saturate: function (value) {
        var hsl = this.toHSL();
        hsl.s += value;
        return Color.fromHSL(hsl);
    },

    darken: function (value) {
        var hsl = this.toHSL();
        hsl.l -= value;
        return Color.fromHSL(hsl);
    },

    fadeBy: function (value) {
        return this.fade(this.a + value);
    },

    fadeTo: function (value) {
        return new Color(this.r, this.g, this.b, value);
    },

    spin: function (value) {
        var hsl = this.toHSL();
        hsl.h += value;
        return Color.fromHSL(hsl);
    },

    mix: function (color, weight) {
        var w = weight * 2 - 1;
        var a = this.a - color.a;

        var w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
        var w2 = 1 - w1;
        
        return new Color(this.r * w1 + color.r * w2, this.g * w1 + color.g * w2, this.b * w1 + color.b * w2, color1.a * weight + color2.a * (1 - weight));
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
 */
Color.colors = {
    'transparent': "rgba(255, 255, 255, 0)",
    'none': "rgba(0, 0, 0, 0)"
};
