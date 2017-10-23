/**
 * 精确计算两个货币的和。
 * @param x 要计算的第一个货币值。最大不得超过 1 万亿，最多只能有两位小数。
 * @param y 要计算的第二个货币值。最大不得超过 1 万亿，最多只能有两位小数。
 * @return 返回计算的结果。
 * @example add(86.24, 0.1) // 86.34
 */
export function add(x: number, y: number) {
    return Math.round((x + y) * 100) / 100;
}

/**
 * 精确计算两个货币的差。
 * @param x 要计算的第一个货币值。最大不得超过 1 万亿，最多只能有两位小数。
 * @param y 要计算的第二个货币值。最大不得超过 1 万亿，最多只能有两位小数。
 * @return 返回计算的结果。
 * @example sub(7, 0.8) // 6.2
 */
export function sub(x: number, y: number) {
    return Math.round((x - y) * 100) / 100;
}

/**
 * 精确计算两个货币的积。
 * @param x 要计算的第一个货币值。最大不得超过 10 亿，最多只能有两位小数。
 * @param y 要计算的第二个货币值。最大不得超过 10 亿，最多只能有两位小数。
 * @return 返回计算的结果。
 * @example mul(7, 0.8) // 5.6
 */
export function mul(x: number, y: number) {
    return Math.round((x * 1000) * (y * 1000)) / 1000000;
}

/**
 * 精确计算两个货币的商。
 * @param x 要计算的第一个货币值。最大不得超过 10 亿，最多只能有两位小数。
 * @param y 要计算的第二个货币值。最大不得超过 10 亿，最多只能有两位小数。
 * @return 返回计算的结果。
 * @example div(7, 0.8) // 8.75
 */
export function div(x: number, y: number) {
    return Math.round(x * 1000 / y) / 1000;
}

/**
 * 保留小数点后两位四舍五入。
 * @param value 要计算的货币值。最大不得超过 10 亿。
 * @return 返回计算的结果。
 * @example round(86.245) // 86.25
 */
export function round(value: number) {
    return Math.round(value * 100) / 100;
}

/**
 * 格式化货币为带“,”的字符串（如“86,234.25”）。
 * @param value 要格式化的货币值。最大不得超过 10 亿。
 * @return 返回格式化后的字符串。字符串保留两位小数四舍五入，整数部分每三位有一个“,”分隔符。
 * @example format(86234.245) // "86,234.25"
 */
export function format(value: number) {
    const t = Math.round(Math.abs(value) * 100);
    const r = Math.floor(value) + "";
    const c = (r.length - 1) % 3 + (value < 0 ? 2 : 1);
    return r.substr(0, c) + r.substr(c).replace(/(\d{3})/g, ",$1") + "." + Math.floor(t / 10) % 10 + t % 10;
}
