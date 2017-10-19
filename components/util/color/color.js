define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 将任意颜色格式转为 RGB 对象格式。
     * @param color 要转换的颜色。
     * @return 返回包含 RGB 信息的对象。如果原对象已经是 RGB 格式则返回原对象。
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
    function toRGB(color) {
        if (typeof color === "string") {
            // #ff0000，ff0000ff
            var match = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/.exec(color);
            if (match) {
                return {
                    r: parseInt(match[1], 16),
                    g: parseInt(match[2], 16),
                    b: parseInt(match[3], 16),
                    a: match[4] ? parseInt(match[4], 16) / 255 : undefined
                };
            }
            // #ff0
            match = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/.exec(color);
            if (match) {
                return {
                    r: parseInt(match[1] + match[1], 16),
                    g: parseInt(match[2] + match[2], 16),
                    b: parseInt(match[3] + match[3], 16)
                };
            }
            // rgb(255,0,0)，rgba(255,0,0,0.9)
            match = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d\.]+%?))?\)/.exec(color);
            if (match) {
                return {
                    r: parseInt(match[1]),
                    g: parseInt(match[2]),
                    b: parseInt(match[3]),
                    a: match[4] ? parsePercent(match[4]) : undefined
                };
            }
            // hsl(255,0,0)，hsla(255,0,0,0.9)
            match = /hsla?\s*\(\s*(\d+)\s*,\s*([\d\.]+%?)\s*,\s*([\d\.]+%?)\s*(?:,\s*([\d\.]+%?))?\)/.exec(color);
            if (!match) {
                return {
                    r: 0,
                    g: 0,
                    b: 0
                };
            }
            color = {
                h: parseInt(match[1]),
                s: parsePercent(match[2]),
                l: parsePercent(match[3]),
                a: match[4] ? parsePercent(match[4]) : undefined
            };
        }
        if (typeof color === "number") {
            return intToRGB(color);
        }
        if (typeof color.l === "number") {
            return hslToRGB(color.h, color.s, color.l, color.a);
        }
        if (typeof color.v === "number") {
            return hsvToRGB(color.h, color.s, color.v, color.a);
        }
        return color;
    }
    exports.toRGB = toRGB;
    /**
     * 将任意颜色格式转为 HSL 对象格式。
     * @param color 要转换的颜色。
     * @return 返回包含 HSL 信息的对象。如果原对象已经是 HSL 格式则返回原对象。
     * @example toHSL("#000") // {h: 0, s: 0, l: 0}
     */
    function toHSL(color) {
        if (typeof color === "string") {
            // hsl(255,0,0)，hsla(255,0,0,0.9)
            var match = /hsla?\s*\(\s*(\d+)\s*,\s*([\d\.]+%?)\s*,\s*([\d\.]+%?)\s*(?:,\s*([\d\.]+%?))?\)/.exec(color);
            if (match) {
                return {
                    h: parseInt(match[1]),
                    s: parsePercent(match[2]),
                    l: parsePercent(match[3]),
                    a: match[4] ? parsePercent(match[4]) : undefined
                };
            }
            if ((match = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/.exec(color))) {
                // #ff0000，ff0000ff
                color = {
                    r: parseInt(match[1], 16),
                    g: parseInt(match[2], 16),
                    b: parseInt(match[3], 16),
                    a: match[4] ? parseInt(match[4], 16) / 255 : undefined
                };
            }
            else if ((match = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/.exec(color))) {
                // #ff0
                color = {
                    r: parseInt(match[1] + match[1], 16),
                    g: parseInt(match[2] + match[2], 16),
                    b: parseInt(match[3] + match[3], 16)
                };
            }
            else if ((match = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d\.]+%?))?\)/.exec(color))) {
                // rgb(255,0,0)，rgba(255,0,0,0.9)
                color = {
                    r: parseInt(match[1]),
                    g: parseInt(match[2]),
                    b: parseInt(match[3]),
                    a: match[4] ? parsePercent(match[4]) : undefined
                };
            }
            else {
                return {
                    h: 0,
                    s: 0,
                    l: 0
                };
            }
        }
        if (typeof color.v === "number") {
            color = toRGB(color);
        }
        if (typeof color.r === "number") {
            return rgbToHSL(color.r, color.g, color.b, color.a);
        }
        return color;
    }
    exports.toHSL = toHSL;
    /**
     * 将任意颜色格式转为 HSV 对象格式。
     * @param color 要转换的颜色。
     * @return 返回包含 HSV 信息的对象。
     * @example toHSV("#000") // {h: 0, s: 0, v: 0}
     */
    function toHSV(color) {
        color = toRGB(color);
        return rgbToHSV(color.r, color.g, color.b, color.a);
    }
    exports.toHSV = toHSV;
    /**
     * 将任意格式的颜色转为 32 位整数。
     * @param color 要转换的颜色。
     * @return 返回 32 位整数，从高位到地位分别是：1 - 透明度、红值、绿值、蓝值。
     * @example toInt("#000") // {h: 0, s: 0, v: 0}
     */
    function toInt(color) {
        var rgb = toRGB(color);
        return rgbToInt(rgb.r, rgb.g, rgb.b, rgb.a);
    }
    exports.toInt = toInt;
    function parsePercent(value) {
        var num = parseFloat(value);
        return /%$/.test(value) ? num / 100 : num;
    }
    function hslToRGB(h, s, l, a) {
        var r;
        var g;
        var b;
        if (s === 0) {
            r = g = b = l;
        }
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            h /= 360;
            r = hueToRGB(p, q, h + 1 / 3);
            g = hueToRGB(p, q, h);
            b = hueToRGB(p, q, h - 1 / 3);
        }
        return {
            r: r * 255,
            g: g * 255,
            b: b * 255,
            a: a
        };
    }
    function hueToRGB(p, q, t) {
        if (t < 0)
            t++;
        if (t > 1)
            t--;
        if (t * 6 < 1)
            return p + (q - p) * 6 * t;
        if (t * 2 < 1)
            return q;
        if (t * 3 < 2)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
    function rgbToHSL(r, g, b, a) {
        r /= 255;
        g /= 255;
        b /= 255;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h;
        var s;
        var l = (max + min) / 2;
        if (max == min) {
            h = s = 0;
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                default:
                    h = (r - g) / d + 4;
                    break;
            }
            h *= 60;
        }
        return { h: h, s: s, l: l, a: a };
    }
    function rgbToHSV(r, g, b, a) {
        r /= 255;
        g /= 255;
        b /= 255;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h;
        var s;
        var v = max;
        var d = max - min;
        s = max == 0 ? 0 : d / max;
        if (max == min) {
            h = 0;
        }
        else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                default:
                    h = (r - g) / d + 4;
                    break;
            }
            h *= 60;
        }
        return { h: h, s: s, v: v, a: a };
    }
    function hsvToRGB(h, s, v, a) {
        var r;
        var g;
        var b;
        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            default:
                r = v;
                g = p;
                b = q;
                break;
        }
        return {
            r: r * 255,
            g: g * 255,
            b: b * 255,
            a: a
        };
    }
    function rgbToInt(r, g, b, a) {
        return r << 16 | g << 8 | b | (a == undefined ? 0 : 1 - a) << 24;
    }
    function intToRGB(v) {
        return {
            r: (v >> 16) & 255,
            g: (v >> 8) & 255,
            b: v & 255,
            a: 1 - ((v >> 24) & 255),
        };
    }
    /**
     * 格式化颜色为字符串。
     * @param color 颜色。
     * @param format 颜色格式，可以使用以下值之一：
     * - `auto`：`#000000` 或 `rgba(0, 0, 0, 1)` 取最短的格式。
     * - `hex`：`#000` 或 `#000000` 或 `#000000ff` 取最短的格式。
     * - `hex6`：`#000000` 或 `#000000ff` 取最短的格式。
     * - `hex8`：`#000000ff`。
     * - `rgb`：`rgb(0, 0, 0)` 或 `rgba(0, 0, 0, 1)` 取最短的格式。
     * - `rgba`：`rgba(0, 0, 0, 1)`。
     * - `hsl`：`hsl(0, 0, 0)` 或 `hsla(0, 0, 0, 1)` 取最短的格式。
     * - `hsla`：`hsla(0, 0, 0, 1)`。
     * @return 返回格式化后的字符串。
     * @example format("rgb(0, 0, 0)") // "#000000"
     */
    function format(color, format) {
        if (format === void 0) { format = "auto"; }
        if (format === "hsl" || format === "hsla") {
            color = toHSL(color);
            if (color.a < 1 || format === "hsla") {
                return "hsla(" + color.h + "," + color.s + "," + color.l + "," + (color.a == undefined ? 1 : color.a) + ")";
            }
            else {
                return "hsl(" + color.h + "," + color.s + "," + color.l + ")";
            }
        }
        else {
            color = toRGB(color);
            if (color.a < 1 && (format === "auto" || format === "rgb") || format === "rgba") {
                return "rgba(" + color.r + "," + color.g + "," + color.b + "," + (color.a == undefined ? 1 : color.a) + ")";
            }
            if (format === "rgb") {
                return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
            }
            var r = "#" + hex(color.r) + hex(color.g) + hex(color.b);
            if (color.a < 1) {
                r += hex(Math.round(color.a * 255));
            }
            else if (format === "hex") {
                r = r.replace(/#(.)\1(.)\2(.)\3/, "#$1$2$3");
            }
            return r;
        }
    }
    exports.format = format;
    function hex(num) {
        if (num <= 0)
            return "00";
        if (num > 255)
            return "ff";
        var str = Math.round(num).toString(16);
        return str.length < 2 ? "0" + str : str;
    }
    /**
     * 调整颜色的色相。
     * @param color 颜色。
     * @param value 要增加的色相值。范围为 -359 到 359。
     * @return 返回新颜色，格式同原颜色。
     * @example spin("#666", 50) // "#666666"
     */
    function spin(color, value) {
        var hsl = toHSL(color);
        hsl.h += value;
        return convert(hsl, color);
    }
    exports.spin = spin;
    /**
     * 调整颜色的饱和度。
     * @param color 颜色。
     * @param value 要增加的饱和度。范围为 -1 到 1。
     * @return 返回新颜色，格式同原颜色。
     * @example saturate("#666", 0.5) // "#993333"
     */
    function saturate(color, value) {
        var hsl = toHSL(color);
        hsl.s += value;
        return convert(hsl, color);
    }
    exports.saturate = saturate;
    /**
     * 减少颜色的亮度。
     * @param color 颜色。
     * @param value 要减少的亮度。范围为 0 到 1。
     * @return 返回新颜色，格式同原颜色。
     * @example darken("#666", 0.5) // "#000000"
     */
    function darken(color, value) {
        var hsl = toHSL(color);
        hsl.l -= value;
        return convert(hsl, color);
    }
    exports.darken = darken;
    /**
     * 增加颜色的亮度。
     * @param color 颜色。
     * @param value 要增加的亮度。范围为 0 到 1。
     * @return 返回新颜色，格式同原颜色。
     * @example lighten("#666", 0.5) // "#e6e6e6"
     */
    function lighten(color, value) {
        var hsl = toHSL(color);
        hsl.l += value;
        return convert(hsl, color);
    }
    exports.lighten = lighten;
    /**
     * 调整颜色的透明度。
     * @param color 颜色。
     * @param value 要增加的透明度。范围为 -1 到 1。
     * @return 返回新颜色，格式同原颜色。
     * @example fade("#666", 0.5) // "rgba(102,102,102,0.5)"
     */
    function fade(color, value) {
        var hsl = toHSL(color);
        hsl.a = (hsl.a == undefined ? 1 : 0) - value;
        return convert(hsl, color);
    }
    exports.fade = fade;
    /**
     * 设置颜色的透明度。
     * @param color 颜色。
     * @param value 要设置的透明度。范围为 -1 到 1。
     * @return 返回新颜色，格式同原颜色。
     * @example alpha("#666", 0.5) // "rgba(102,102,102,0.5)"
     */
    function alpha(color, value) {
        var rgb = toRGB(color);
        rgb.a = value;
        return convert(rgb, color);
    }
    exports.alpha = alpha;
    /**
     * 获取颜色的反色。
     * @param color 颜色。
     * @return 返回新颜色，格式同原颜色。
     * @example invert("#666") // "#999999"
     */
    function invert(color) {
        var rgb = toRGB(color);
        return convert({
            r: 255 - rgb.r,
            g: 255 - rgb.g,
            b: 255 - rgb.b,
            a: rgb.a
        }, color);
    }
    exports.invert = invert;
    /**
     * 叠加两个颜色并返回新颜色。
     * @param color1 要叠加的第一个颜色。
     * @param color2 要叠加的第二个颜色。
     * @param weight 第二个颜色的透明度。
     * @return 返回新颜色，格式同第一个颜色。
     * @example mix("#0f0", "#f00") // "#808000"
     */
    function mix(color1, color2, weight) {
        if (weight === void 0) { weight = 0.5; }
        var rgb1 = toRGB(color1);
        var rgb2 = toRGB(color2);
        var w = weight * 2 - 1;
        var alpha1 = rgb1.a == undefined ? 1 : rgb1.a;
        var alpha2 = rgb2.a == undefined ? 1 : rgb2.a;
        var a = alpha1 - alpha2;
        var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
        var w2 = 1 - w1;
        return convert({
            r: rgb1.r * w1 + rgb2.r * w2,
            g: rgb1.g * w1 + rgb2.g * w2,
            b: rgb1.b * w1 + rgb2.b * w2,
            a: alpha1 * weight + alpha2 * (1 - weight)
        }, color1);
    }
    exports.mix = mix;
    /**
     * 获取颜色的亮度。
     * @param color 颜色。
     * @return 返回亮度，值越大亮度越高（越接近白色），范围为 0 到 1（含）。
     * @example luma("#666") // 0.13286832155381795
     */
    function luma(color) {
        color = toRGB(color);
        var r = color.r / 255;
        var g = color.g / 255;
        var b = color.b / 255;
        r = (r <= 0.03928) ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4);
        g = (g <= 0.03928) ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4);
        b = (b <= 0.03928) ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    exports.luma = luma;
    /**
     * 计算和指定颜色对比度最大的颜色。
     * @param color 颜色。
     * @param color1 要比较的第一个颜色。
     * @param color2 要比较的第二个颜色。
     * @param threshold 对比度阀值。将优先选择亮度高于此值的颜色。
     * @return 返回给定两个颜色中的其中一个。
     * @example contrast("#666", "#000", "#fff") // "#ffffff"
     */
    function contrast(color, color1, color2, threshold) {
        if (threshold === void 0) { threshold = 0.43; }
        return (luma(color) < threshold) === (luma(color1) <= luma(color2)) ? color2 : color1;
    }
    exports.contrast = contrast;
    /**
     * 将一个 HSL 或 RGB 颜色对象转为和指定颜色格式相同的格式。
     * @param color HSL 或 RGB 颜色对象。
     * @param type 目标颜色格式。
     * @return 返回指定格式的颜色。
     */
    function convert(color, type) {
        if (typeof type !== "string") {
            if (typeof type === "number") {
                return toInt(color);
            }
            var isRGB = typeof color.r === "number";
            if ((typeof type.r === "number") === isRGB) {
                return color;
            }
            return isRGB ? toRGB(color) : toHSL(color);
        }
        return format(color, /^#/.test(type) ? "auto" : /^hsl/.test(type) ? "hsl" : "rgb");
    }
});
//# sourceMappingURL=color.js.map