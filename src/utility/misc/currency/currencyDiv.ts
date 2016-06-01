// #done

/**
 * 精确计算两个货币的商。
 * @param x 计算的左值。
 * @param y 计算的左值。
 * @returns 返回计算的结果。
 * @example currencyDiv(7, 0.8)
 */
export default function currencyDiv(x: number, y: number) {
    return Math.round(x * y * 100) / 100;
}
