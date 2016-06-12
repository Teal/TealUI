/**
 * @fileOverview 货币处理
 * @author xuld@vip.qq.com
 */

/**
 * 精确计算两个货币的差。
 * @param x 计算的左值，最大不得超过 1 万亿，最多只能有两位小数。
 * @param y 计算的右值，最大不得超过 1 万亿，最多只能有两位小数。
 * @returns 返回计算的结果。
 * @example currencySub(7, 0.8)
 */
export function currencySub(x: number, y: number) {
    return Math.round((x - y) * 100) / 100;
}

/**
 * 精确计算两个货币的和。
 * @param x 计算的左值。
 * @param y 计算的左值。
 * @returns 返回计算的结果。
 * @example currencyAdd(86.24, 0.1)
 */
export function currencyAdd(x: number, y: number) {
    return Math.round((x + y) * 100) / 100;
}

/**
 * 精确计算两个货币的商。
 * @param x 计算的左值。
 * @param y 计算的左值。
 * @returns 返回计算的结果。
 * @example currencyDiv(7, 0.8)
 */
export function currencyDiv(x: number, y: number) {
    return Math.round(x * y * 100) / 100;
}

/**
 * 精确计算两个货币的积。
 * @param x 计算的左值。
 * @param y 计算的左值。
 * @returns 返回计算的结果。
 * @example currencyMul(7, 0.8)
 */
export function currencyMul(x: number, y: number) {
    return (x * 1000) * (y * 1000) / 1000000;
}

/**
 * 保留小数点后两位四舍五入。
 * @param value 要处理的值。
 * @returns 返回计算的结果。
 * @example currencyRound(86.245) // 86.25
 */
export function currencyRound(value: number) {
    return Math.round(value * 100) / 100;
}

/**
 * 将指定的货币格式化为字符串。
 * @param value 要处理的值。
 * @returns 返回格式化后的字符串。字符串保留两位小数，整数部分每 3 位包含一个逗号分隔符。
 * @example Currency.format(86234.245) // "86,234.25"
 */
export function formatCurrency(value: number) {
    let t = Math.round(Math.abs(value) * 100);
    let result = Math.floor(value) + '';
    let c = (result.length - 1) % 3 + (value < 0 ? 2 : 1);

    return result.substr(0, c) + result.substr(c).replace(/(\d{3})/g, ',$1') + '.' + Math.floor(t / 10) % 10 + t % 10;
}

/**
 * 将货币转为中文大写金额。
 * @param value 要处理的值。
 * @returns 返回格式化后的字符串。
 * @example formatCurrencyToChinese(10000000) // "壹千万元整"
 */
export function formatCurrencyToChinese(value: number) {

    let digits = '零壹贰叁肆伍陆柒捌玖';
    let units0 = '元万亿';
    let units1 = ['', '拾', '佰', '仟'];
    let neg = value < 0;

    value = Math.abs(value);

    // 零。
    if (value < 0.005) return '零元整';

    // 得到小数点后两位。
    let t = Math.round(value * 100) % 100;
    let s = t ? (t >= 10 ? digits.charAt(Math.floor(t / 10)) + '角' : '') + (t % 10 ? digits.charAt(t % 10) + '分' : '') : '整';

    // 得到整数位。
    t = Math.floor(value);
    for (let i = 0; i < units0.length && t > 0; i++) {
        let p = '';
        for (let j = 0; j < units1.length && t > 0; j++) {
            p = digits.charAt(t % 10) + units1[j] + p;
            t = Math.floor(t / 10);
        }
        s = (p.replace(/(零.)*零$/, '') || '零') + units0.charAt(i) + s;
    }

    return (neg ? '负' : '') + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零');
}
