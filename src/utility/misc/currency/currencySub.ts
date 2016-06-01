// #done

/**
 * 精确计算两个货币的差。
 * @param x 计算的左值，最大不得超过 1 万亿，最多只能有两位小数。
 * @param y 计算的右值，最大不得超过 1 万亿，最多只能有两位小数。
 * @returns 返回计算的结果。
 * @example currencySub(7, 0.8)
 */
export default function currencySub(x: number, y: number) {
    return Math.round((x - y) * 100) / 100;
}
