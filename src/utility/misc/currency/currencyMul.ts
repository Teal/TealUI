// #todo

// #done

/**
 * 精确计算两个货币的积。
 * @param x 计算的左值。
 * @param y 计算的左值。
 * @returns 返回计算的结果。
 * @example currencyMul(7, 0.8)
 */
export default function currencyMul(x: number, y: number) {
    return (x * 1000) * (y * 1000) / 1000000;
}
