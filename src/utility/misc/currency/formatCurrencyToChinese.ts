/**
 * @fileOverview 将货币转为中文大写金额。
 * @author xuld@vip.qq.com
 */

/**
 * 将货币转为中文大写金额。
 * @param value 要处理的值。
 * @returns 返回格式化后的字符串。
 * @example formatCurrencyToChinese(10000000) // "壹千万元整"
 */
export default function formatCurrencyToChinese(value: number) {

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
