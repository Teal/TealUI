// #done

/**
 * 精确计算两个货币的和。
 * @param x 计算的左值。
 * @param y 计算的左值。
 * @returns 返回计算的结果。
 * @example currencyAdd(86.24, 0.1)
 */
export default function currencyAdd(x: number, y: number) {
    return Math.round((x + y) * 100) / 100;
}
