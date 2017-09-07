/**
 * 表示一个由 RGB 组成的颜色。
 */
export interface RGB {

    /**
     * 获取当前颜色的 R 值。取值范围为 0-255。
     */
    r: number;

    /**
     * 获取当前颜色的 G 值。取值范围为 0-255。
     */
    g: number;

    /**
     * 获取当前颜色的 B 值。取值范围为 0-255。
     */
    b: number;

    /**
     * 获取当前颜色的透明度。
     */
    a?: number;

}

/**
 * 表示一个由 HSL 组成的颜色。
 */
export interface HSL {

    /**
     * 获取当前颜色的色调。取值范围为 0-360。
     */
    h: number;

    /**
     * 获取当前颜色的饱和度。取值范围为 0-1。
     */
    s: number;

    /**
     * 获取当前颜色的亮度。取值范围为 0-1。
     */
    l: number;

    /**
     * 获取当前颜色的透明度。取值范围为 0-1。
     */
    a?: number;

}

/**
 * 表示一个颜色。
 */
export type Color = string | RGB | HSL;

/**
 * 将任意颜色转为 RGB 格式。
 * @param color 要处理的颜色。
 * @return 返回包含 RGB 信息的对象。
 * @example toRGB("#000") // {r: 0, g: 0, b: 0}
 * @example toRGB("#ff0000") // {r: 255, g: 0, b: 0}
 * @example toRGB("#ff0000ff") // {r: 255, g: 0, b: 0, a: 1}
 * @example toRGB("rgb(255,0,0)") // {r: 255, g: 0, b: 0, a: 1}
 * @example toRGB("rgba(255,0,0,0.9)") // {r: 255, g: 0, b: 0, a: 0.9}
 * @example toRGB("hsl(255,0,0)") // {r: 255, g: 0, b: 0, a: 0.9}
 * @example toRGB("hsla(255,0,0,0.9)") // {r: 255, g: 0, b: 0, a: 0.9}
 * @example toRGB({h:255, s: 0, l: 0}) // {r: 255, g: 0, b: 0}
 * @example toRGB({h:255, s: 0, l: 0, a: 0}) // {r: 255, g: 0, b: 0}
 */
export function toRGB(value: Color): RGB {
    if (typeof value === "string") {
        const hex = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/.exec(value);
        if (hex) {
            value = {
                r: parseInt(hex[1], 16),
                g: parseInt(hex[2], 16),
                b: parseInt(hex[3], 16),
                a: hex[4] ? parseInt(hex[4], 16) / 255 : undefined
            };
        } else {
            const hexSimple = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/.exec(value);
            if (hexSimple) {
                value = {
                    r: parseInt(hexSimple[1] + hexSimple[1], 16),
                    g: parseInt(hexSimple[2] + hexSimple[2], 16),
                    b: parseInt(hexSimple[3] + hexSimple[3], 16)
                };
            } else {
                const parsePercent = (value: string) => {
                    const val = parseFloat(value);
                    return /%$/.test(value) ? val / 100 : val;
                };
                const rgb = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d\.]+%?))?\)/.exec(value);
                if (rgb) {
                    value = {
                        r: parseInt(rgb[1]),
                        g: parseInt(rgb[2]),
                        b: parseInt(rgb[3]),
                        a: rgb[4] ? parsePercent(rgb[4]) : undefined
                    };
                } else {
                    const hsl = /hsla?\s*\(\s*(\d+)\s*,\s*([\d\.]+%?)\s*,\s*([\d\.]+%?)\s*(?:,\s*([\d\.]+%?))?\)/.exec(value);
                    if (hsl) {
                        return toRGB({
                            h: parseInt(hsl[1]),
                            s: parsePercent(hsl[2]),
                            l: parsePercent(hsl[3]),
                            a: hsl[4] ? parsePercent(hsl[4]) : undefined
                        });
                    } else {
                        return {
                            r: 0,
                            g: 0,
                            b: 0
                        };
                    }
                }
            }
        }
    } else if (typeof (value as HSL).l === "number") {
        value = {
            r: hue(value as HSL, 1 / 3),
            g: hue(value as HSL, 0),
            b: hue(value as HSL, -1 / 3),
            a: (value as HSL).a
        };
    }
    return value as RGB;
}

// hsl转rgb公式
function hue(v, cv) {
    const h = v.h;
    const s = parseFloat((v.s / 255).toFixed(10));
    const l = parseFloat((v.l / 255).toFixed(10));
    let t1, t2, color;
    if (s == 0) {
        return l;
    } else {
        if (l < 0.5) {
            t2 = l * (1.0 + s);
        } else {
            t2 = l + s - l * s;
        }
        t1 = 2.0 * l - t2;
    }
    let t3 = parseFloat((h / 360 + cv).toFixed(10));
    if (t3 < 0) {
        t3 += 1.0;
    } else if (t3 > 1) {
        t3 -= 1.0;
    }
    if (t3 * 6.0 < 1) {
        color = t1 + (t2 - t1) * 6.0 * t3;
    } else if (2.0 * t3 < 1) {
        color = t2;
    } else if (3.0 * t3 < 2) {
        color = t1 + (t2 - t1) * ((2.0 / 3.0) - t3) * 6.0;
    } else {
        color = t1;
    }
    color *= 255;
    return Math.floor(color);
}

/**
 * 将任意颜色转为 HSL 格式。
 * @param color 要处理的颜色。
 * @return 返回包含 HSL 信息的对象。
 * @example toHSL("#000") // {h: 0, s: 0, l: 0}
 * @example toHSL("#ff0000") // {h: 0, s: 255, l: 128}
 * @example toHSL("#ff0000ff") // {h: 0, s: 255, l: 128, a: 1}
 * @example toHSL("rgb(255,0,0)") // {h: 0, s: 255, l: 128}
 * @example toHSL("rgba(255,0,0,1)") // {h: 0, s: 255, l: 128, a: 1}
 * @example toHSL("hsl(0, 255, 128)") // {h: 0, s: 255, l: 128}
 * @example toHSL("hsla(0, 255, 128, 1)") // {h: 0, s: 255, l: 128, a: 1}
 * @example toHSL({r:255, g: 0, b: 0}) // {h: 0, s: 255, l: 128}
 * @example toHSL({r:255, g: 0, b: 0, a: 1}) // {h: 0, s: 255, l: 128, a: 1}
 */
export function toHSL(value: Color) {

}

function convert<T extends Color>(value: HSL, type: T) {

}

/**
 * 调整当前颜色的饱和度。
 * @param color 要处理的颜色。
 * @param value 要增加的数值。范围应在 0-1 之间。
 * @return 返回新颜色。
 * @example saturate("#fff", 0.5)
 */
export function saturate<T extends Color>(color: T, value: number) {
    const hsl = toHSL(color);
    hsl.s += value;
    return convert(hsl, type);
}

/**
 * 调整当前颜色的暗度。
 * @param color 要处理的颜色。
 * @param value 要减少的数值。范围应在 0-1 之间。
 * @return 返回新颜色。
 * @example darken("#fff", 0.5)
 */
export function darken<T extends Color>(color: T, value: number) {
    const hsl = toHSL(color);
    hsl.l -= value;
    return convert(hsl, type);
}

/**
 * 调整当前颜色的暗度。
 * @param color 要处理的颜色。
 * @param value 要增加的数值。范围应在 0-1 之间。
 * @return 返回新颜色。
 * @example darken("#fff", 0.5)
 */
export function lighten<T extends Color>(color: T, value: number) {
    const hsl = toHSL(color);
    hsl.l += value;
    return convert(hsl, type);
}

/**
 * 调整当前颜色的透明度。
 * @param color 要处理的颜色。
 * @param {Number} value 调整的幅度。值在 0 到 1 之间。
 * @return {Color} 返回新颜色。
 * @example new Color("#fff").fadeBy(0.5) 
 */
export function fadeBy(value) {
    return this.fadeTo(this.a + value);
}

/**
 * 设置当前颜色的透明度。
 * @param {Number} value 调整的幅度。值在 0 到 1 之间。
 * @return {Color} 返回新颜色。 
 * @example new Color("#fff").fadeTo(0.5) 
 */
export function fadeTo(value) {
    var me = this;
    return new Color(me.r, me.g, me.b, value);
}

/**
 * 调整当前颜色的色相。
 * @param {Number} value 调整的幅度。值在 0 到 360 之间。
 * @return {Color} 返回新颜色。 
 * @example new Color("#fff").spin(100) 
 */
export function spin(value) {
    var hsl = this.toHSL();
    hsl.h += value;
    return Color.fromHSL(hsl);
}

/**
 * 叠加当前颜色和目标颜色的值。
 * @param {Color} color 另一个颜色值。
 * @param {Number} [weight=0.5] 当前颜色叠加的透明度。
 * @return {Color} 返回叠加后的新颜色。 
 * @example new Color("#0f0").mix(new Color("#f00")) 
 */
export function mix(color, weight) {
    var me = this;
    if (weight == null) {
        weight = 0.5;
    }
    var w = weight * 2 - 1;
    var a = me.a - color.a;

    var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
    var w2 = 1 - w1;

    return new Color(me.r * w1 + color.r * w2, me.g * w1 + color.g * w2, me.b * w1 + color.b * w2, me.a * weight + color.a * (1 - weight));
}

/**
 * 获取当前颜色的亮度。
 * @return {Number} 返回亮度。值在 0-1 之间。 
 * @example new Color("#fff").luma() 
 */
export function luma() {
    var me = this;
    var r = me.r / 255;
    var g = me.g / 255;
    var b = me.b / 255;

    r = (r <= 0.03928) ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4);
    g = (g <= 0.03928) ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4);
    b = (b <= 0.03928) ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * 计算当前颜色的最合理反色。
 * @param {Color} [dark=new Color(0, 0, 0)] 深色使用色。
 * @param {Color} [light=new Color(255, 255, 255)] 浅色使用色。
 * @param {Number} [threshold=0.43] 区分度阀值。
 * @return {Color} 返回 @dark 和 @light 中能用于区分的颜色。
 * @example new Color("#fff").contrast() 
 */
export function contrast(dark, light, threshold) {

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
}

/**
 * 获取当前颜色的反色。
 * @return {Color} 返回新颜色。
 * @example new Color("#fff").invert()
 */
export function invert() {
    var me = this;
    return new Color(255 - me.r, 255 - me.g, 255 - me.b, me.a);
}

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
     * 获取当前颜色的 HSL 格式。
     * @return {Object} 返回一个对象：
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
     * @return {Object} 返回一个对象：
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
     * @return {Object} 返回一个对象：
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
     * @return {String} 返回哈希值表示形式。如 "#FFFFFF"。
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
     * @return {Number} 返回整数表示形式。
     * @example new Color("#fff").toInt()
     */
    toInt: function () {
        var me = this;
        return me.r << 16 | me.g << 8 | me.b | me.a << 24;
    },

    /**
     * 获取当前颜色的字符串形式。
     * @return {String} 返回可以直接在 CSS 代码中使用的字符串形式。
     * @example new Color("#fff").toString()
     */
    toString: function () {
        var me = this;
        return me.a < 1 ? "rgba(" + me.r + "," + me.g + "," + me.b + "," + me.a + ")" : me.toHex();
    },

};

/**
 * 从已有的 HSL 格式颜色值创造新的颜色值。
 * @param {Number} [h] 当前颜色的色调。
 * @param {Number} [s] 当前颜色的饱和度。
 * @param {Number} [l] 当前颜色的亮度。
 * @param {Object} [hsl] 当前颜色的 HSL 对象。
 * @param {Number} [a=1] 当前颜色的透明度。
 * @return {Color} 返回新颜色对象。 
 * @example 
 * Color.fromHSL(0, 0, 1, 1)
 * Color.fromHSL({h: 0, s:0, l:1, a:1})
 */
Color.fromHSL = function (h, s, l, a) {

};
