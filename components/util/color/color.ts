/**
 * 表示一个由红、绿、蓝三原色组成的颜色。
 */
export interface RGB {

    /**
     * 红值（Red）。范围为 0 到 255（含）。
     */
    r: number;

    /**
     * 绿值（Green）。范围为 0 到 255（含）。
     */
    g: number;

    /**
     * 蓝值（Blue）。范围为 0 到 255（含）。
     */
    b: number;

    /**
     * 透明度（Alpha）。范围为 0 到 1（含）。
     */
    a?: number;

}

/**
 * 表示一个由色调、饱和度、亮度组成的颜色。
 */
export interface HSL {

    /**
     * 色调（Hue）。范围为 0 到 359（含）。
     */
    h: number;

    /**
     * 饱和度（Saturation）。范围为 0 到 1（含）。
     */
    s: number;

    /**
     * 亮度（Lightness）。范围为 0 到 1（含）。
     */
    l: number;

    /**
     * 透明度（Alpha）。范围为 0 到 1（含）。
     */
    a?: number;

}

/**
 * 表示一个由色调、饱和度、明度组成的颜色。
 */
export interface HSV {

    /**
     * 色调（Hue）。范围为 0 到 359（含）。
     */
    h: number;

    /**
     * 饱和度（Saturation）。范围为 0 到 1（含）。
     */
    s: number;

    /**
     * 明度（Value）。范围为 0 到 1（含）。
     */
    v: number;

    /**
     * 透明度（Alpha）。范围为 0 到 1（含）。
     */
    a?: number;

}

/**
 * 表示一个颜色。
 * @desc
 * 颜色有以下格式：
 * - `{r: 0, g: 0, b: 0, a: 1}`
 * - `{h: 0, s: 0, l: 0, a: 1}`
 * - `{h: 0, s: 0, v: 0, a: 1}`
 * - `"#000"`
 * - `"#000000"`
 * - `"#000000ff"`
 * - `"rgb(0, 0, 0)"`
 * - `"rgba(0, 0, 0, 1)"`
 * - `"hsl(0, 0, 0)"`
 * - `"hsla(0, 0, 0, 1)"`
 * - 0x000000
 */
export type Color = string | RGB | HSL | HSV | number;

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
export function toRGB(color: Color): RGB {
    if (typeof color === "string") {
        // #ff0000，ff0000ff
        let match = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/.exec(color);
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

    if (typeof (color as HSL).l === "number") {
        return hslToRGB((color as HSL).h, (color as HSL).s, (color as HSL).l, (color as HSL).a);
    }

    if (typeof (color as HSV).v === "number") {
        return hsvToRGB((color as HSV).h, (color as HSV).s, (color as HSV).v, (color as HSV).a);
    }

    return color as RGB;
}

/**
 * 将任意颜色格式转为 HSL 对象格式。
 * @param color 要转换的颜色。
 * @return 返回包含 HSL 信息的对象。如果原对象已经是 HSL 格式则返回原对象。
 * @example toHSL("#000") // {h: 0, s: 0, l: 0}
 */
export function toHSL(color: Color): HSL {
    if (typeof color === "string") {
        // hsl(255,0,0)，hsla(255,0,0,0.9)
        let match = /hsla?\s*\(\s*(\d+)\s*,\s*([\d\.]+%?)\s*,\s*([\d\.]+%?)\s*(?:,\s*([\d\.]+%?))?\)/.exec(color);
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
        } else if ((match = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/.exec(color))) {
            // #ff0
            color = {
                r: parseInt(match[1] + match[1], 16),
                g: parseInt(match[2] + match[2], 16),
                b: parseInt(match[3] + match[3], 16)
            };
        } else if ((match = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d\.]+%?))?\)/.exec(color))) {
            // rgb(255,0,0)，rgba(255,0,0,0.9)
            color = {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3]),
                a: match[4] ? parsePercent(match[4]) : undefined
            };
        } else {
            return {
                h: 0,
                s: 0,
                l: 0
            };
        }
    }

    if (typeof (color as HSV).v === "number") {
        color = toRGB(color);
    }

    if (typeof (color as RGB).r === "number") {
        return rgbToHSL((color as RGB).r, (color as RGB).g, (color as RGB).b, (color as RGB).a);
    }

    return color as HSL;
}

/**
 * 将任意颜色格式转为 HSV 对象格式。
 * @param color 要转换的颜色。
 * @return 返回包含 HSV 信息的对象。
 * @example toHSV("#000") // {h: 0, s: 0, v: 0}
 */
export function toHSV(color: Color): HSV {
    color = toRGB(color);
    return rgbToHSV(color.r, color.g, color.b, color.a);
}

/**
 * 将任意格式的颜色转为 32 位整数。
 * @param color 要转换的颜色。
 * @return 返回 32 位整数，从高位到地位分别是：1 - 透明度、红值、绿值、蓝值。
 * @example toInt("#000") // {h: 0, s: 0, v: 0}
 */
export function toInt(color: Color) {
    const rgb = toRGB(color);
    return rgbToInt(rgb.r, rgb.g, rgb.b, rgb.a);
}

function parsePercent(value: string) {
    const num = parseFloat(value);
    return /%$/.test(value) ? num / 100 : num;
}

function hslToRGB(h: number, s: number, l: number, a: number | undefined) {
    let r: number;
    let g: number;
    let b: number;
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
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

function hueToRGB(p: number, q: number, t: number) {
    if (t < 0) t++;
    if (t > 1) t--;
    if (t * 6 < 1) return p + (q - p) * 6 * t;
    if (t * 2 < 1) return q;
    if (t * 3 < 2) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

function rgbToHSL(r: number, g: number, b: number, a: number | undefined) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number;
    let s: number;
    const l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            default: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }

    return { h, s, l, a };
}

function rgbToHSV(r: number, g: number, b: number, a: number | undefined) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number;
    let s: number;
    const v = max;

    const d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            default: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return { h, s, v, a };
}

function hsvToRGB(h: number, s: number, v: number, a: number | undefined) {
    let r: number;
    let g: number;
    let b: number;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        default: r = v; g = p; b = q; break;
    }

    return {
        r: r * 255,
        g: g * 255,
        b: b * 255,
        a: a
    };
}

function rgbToInt(r: number, g: number, b: number, a: number | undefined) {
    return r << 16 | g << 8 | b | (a == undefined ? 0 : 1 - a) << 24;
}

function intToRGB(v: number) {
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
export function format(color: Color, format: "auto" | "hex" | "hex6" | "hex8" | "rgb" | "rgba" | "hsl" | "hsla" = "auto"): string {
    if (format === "hsl" || format === "hsla") {
        color = toHSL(color);
        if (color.a! < 1 || format === "hsla") {
            return `hsla(${color.h},${color.s},${color.l},${color.a == undefined ? 1 : color.a})`;
        } else {
            return `hsl(${color.h},${color.s},${color.l})`;
        }
    } else {
        color = toRGB(color);
        if (color.a! < 1 && (format === "auto" || format === "rgb") || format === "rgba") {
            return `rgba(${color.r},${color.g},${color.b},${color.a == undefined ? 1 : color.a})`;
        }

        if (format === "rgb") {
            return `rgb(${color.r},${color.g},${color.b})`;
        }

        let r = `#${hex(color.r)}${hex(color.g)}${hex(color.b)}`;
        if (color.a! < 1) {
            r += hex(Math.round(color.a! * 255));
        } else if (format === "hex") {
            r = r.replace(/#(.)\1(.)\2(.)\3/, "#$1$2$3");
        }
        return r;
    }
}

function hex(num: number) {
    if (num <= 0) return "00";
    if (num > 255) return "ff";
    const str = Math.round(num).toString(16);
    return str.length < 2 ? "0" + str : str;
}

/**
 * 调整颜色的色相。
 * @param color 颜色。
 * @param value 要增加的色相值。范围为 -359 到 359。
 * @return 返回新颜色，格式同原颜色。
 * @example spin("#666", 50) // "#666666"
 */
export function spin<T extends Color>(color: T, value: number) {
    const hsl = toHSL(color);
    hsl.h += value;
    return convert(hsl, color);
}

/**
 * 调整颜色的饱和度。
 * @param color 颜色。
 * @param value 要增加的饱和度。范围为 -1 到 1。
 * @return 返回新颜色，格式同原颜色。
 * @example saturate("#666", 0.5) // "#993333"
 */
export function saturate<T extends Color>(color: T, value: number) {
    const hsl = toHSL(color);
    hsl.s += value;
    return convert(hsl, color);
}

/**
 * 减少颜色的亮度。
 * @param color 颜色。
 * @param value 要减少的亮度。范围为 0 到 1。
 * @return 返回新颜色，格式同原颜色。
 * @example darken("#666", 0.5) // "#000000"
 */
export function darken<T extends Color>(color: T, value: number) {
    const hsl = toHSL(color);
    hsl.l -= value;
    return convert(hsl, color);
}

/**
 * 增加颜色的亮度。
 * @param color 颜色。
 * @param value 要增加的亮度。范围为 0 到 1。
 * @return 返回新颜色，格式同原颜色。
 * @example lighten("#666", 0.5) // "#e6e6e6"
 */
export function lighten<T extends Color>(color: T, value: number) {
    const hsl = toHSL(color);
    hsl.l += value;
    return convert(hsl, color);
}

/**
 * 调整颜色的透明度。
 * @param color 颜色。
 * @param value 要增加的透明度。范围为 -1 到 1。
 * @return 返回新颜色，格式同原颜色。
 * @example fade("#666", 0.5) // "rgba(102,102,102,0.5)"
 */
export function fade<T extends Color>(color: T, value: number) {
    const hsl = toHSL(color);
    hsl.a = (hsl.a == undefined ? 1 : 0) - value;
    return convert(hsl, color);
}

/**
 * 设置颜色的透明度。
 * @param color 颜色。
 * @param value 要设置的透明度。范围为 -1 到 1。
 * @return 返回新颜色，格式同原颜色。
 * @example alpha("#666", 0.5) // "rgba(102,102,102,0.5)"
 */
export function alpha<T extends Color>(color: T, value: number) {
    const rgb = toRGB(color);
    rgb.a = value;
    return convert(rgb, color);
}

/**
 * 获取颜色的反色。
 * @param color 颜色。
 * @return 返回新颜色，格式同原颜色。
 * @example invert("#666") // "#999999"
 */
export function invert<T extends Color>(color: T) {
    const rgb = toRGB(color);
    return convert({
        r: 255 - rgb.r,
        g: 255 - rgb.g,
        b: 255 - rgb.b,
        a: rgb.a
    }, color);
}

/**
 * 叠加两个颜色并返回新颜色。
 * @param color1 要叠加的第一个颜色。
 * @param color2 要叠加的第二个颜色。
 * @param weight 第二个颜色的透明度。
 * @return 返回新颜色，格式同第一个颜色。
 * @example mix("#0f0", "#f00") // "#808000"
 */
export function mix<T extends Color>(color1: T, color2: Color, weight = 0.5) {
    const rgb1 = toRGB(color1);
    const rgb2 = toRGB(color2);
    const w = weight * 2 - 1;
    const alpha1 = rgb1.a == undefined ? 1 : rgb1.a;
    const alpha2 = rgb2.a == undefined ? 1 : rgb2.a;
    const a = alpha1 - alpha2;
    const w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
    const w2 = 1 - w1;
    return convert({
        r: rgb1.r * w1 + rgb2.r * w2,
        g: rgb1.g * w1 + rgb2.g * w2,
        b: rgb1.b * w1 + rgb2.b * w2,
        a: alpha1 * weight + alpha2 * (1 - weight)
    }, color1);
}

/**
 * 获取颜色的亮度。
 * @param color 颜色。
 * @return 返回亮度，值越大亮度越高（越接近白色），范围为 0 到 1（含）。
 * @example luma("#666") // 0.13286832155381795
 */
export function luma(color: Color) {
    color = toRGB(color);
    let r = color.r / 255;
    let g = color.g / 255;
    let b = color.b / 255;
    r = (r <= 0.03928) ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4);
    g = (g <= 0.03928) ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4);
    b = (b <= 0.03928) ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * 计算和指定颜色对比度最大的颜色。
 * @param color 颜色。
 * @param color1 要比较的第一个颜色。
 * @param color2 要比较的第二个颜色。
 * @param threshold 对比度阀值。将优先选择亮度高于此值的颜色。
 * @return 返回给定两个颜色中的其中一个。
 * @example contrast("#666", "#000", "#fff") // "#ffffff"
 */
export function contrast<T extends Color, U extends Color = T>(color: Color, color1: T, color2: U, threshold = 0.43) {
    return (luma(color) < threshold) === (luma(color1) <= luma(color2)) ? color2 : color1;
}

/**
 * 将一个 HSL 或 RGB 颜色对象转为和指定颜色格式相同的格式。
 * @param color HSL 或 RGB 颜色对象。
 * @param type 目标颜色格式。
 * @return 返回指定格式的颜色。
 */
function convert<T extends Color>(color: HSL | RGB, type: T) {
    if (typeof type !== "string") {
        if (typeof type === "number") {
            return toInt(color);
        }
        const isRGB = typeof (color as RGB).r === "number";
        if ((typeof (type as RGB).r === "number") === isRGB) {
            return color;
        }
        return isRGB ? toRGB(color) : toHSL(color);
    }
    return format(color, /^#/.test(type) ? "auto" : /^hsl/.test(type) ? "hsl" : "rgb");
}
