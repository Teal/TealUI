
/**
 * 保留小数点后两位四舍五入。
 * @param value 要处理的值。
 * @returns 返回计算的结果。
 * @example currencyRound(86.245) // 86.25
 */
export default function currencyRound(value: number) {
    return Math.round(value * 100) / 100;
}
