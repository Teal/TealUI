
/**
 * 将指定的货币格式化为字符串。
 * @param value 要处理的值。
 * @returns 返回格式化后的字符串。字符串保留两位小数，整数部分每 3 位包含一个逗号分隔符。
 * @example Currency.format(86234.245) // "86,234.25"
 */
export default function formatCurrency(value: number) {
    let t = Math.round(Math.abs(value) * 100);
    let result = Math.floor(value) + '';
    let c = (result.length - 1) % 3 + (value < 0 ? 2 : 1);

    return result.substr(0, c) + result.substr(c).replace(/(\d{3})/g, ',$1') + '.' + Math.floor(t / 10) % 10 + t % 10;
}
