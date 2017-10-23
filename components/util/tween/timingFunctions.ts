/**
 * 线性渐变。
 * @param value 渐变因子。
 * @return 返回更新后的渐变因子。
 */
export function linear(value: number) {
    return value;
}

/**
 * 抛物线渐变。
 * @param value 渐变因子。
 * @param base 指数。
 * @return 返回更新后的渐变因子。
 */
export function power(value: number, base = 3) {
    return Math.pow(value, base);
}

/**
 * 指数渐变。
 * @param value 渐变因子。
 * @return 返回更新后的渐变因子。
 */
export function exponential(value: number) {
    return Math.pow(2, 8 * (value - 1));
}

/**
 * 双三角渐变。
 * @param value 渐变因子。
 * @return 返回更新后的渐变因子。
 */
export function circular(value: number) {
    return 1 - Math.sin(Math.acos(value));
}

/**
 * 上三角渐变。
 * @param value 渐变因子。
 * @return 返回更新后的渐变因子。
 */
export function sinusoidal(value: number) {
    return 1 - Math.sin((1 - value) * Math.PI / 2);
}

/**
 * 后退渐变。
 * @param value 渐变因子。
 * @param base 渐变的基数。
 * @return 返回更新后的渐变因子。
 */
export function back(value: number, base = 1.618) {
    return Math.pow(value, 2) * ((base + 1) * value - base);
}

/**
 * 弹跳渐变。
 * @param value 渐变因子。
 * @return 返回更新后的渐变因子。
 */
export function bounce(value: number) {
    for (let i = 0, j = 1; 1; i += j, j /= 2) {
        if (value >= (7 - 4 * i) / 11) {
            return j * j - Math.pow((11 - 6 * i - 11 * value) / 4, 2);
        }
    }
}

/**
 * 弹力渐变。
 * @param value 渐变因子。
 * @param base 渐变的基数。
 * @return 返回更新后的渐变因子。
 */
export function elastic(value: number, base = 1) {
    return Math.pow(2, 10 * --value) * Math.cos(20 * value * Math.PI * value / 3);
}

/**
 * 创建一个反向渐变曲线。
 * @param timingFunction 渐变函数。
 * @return 返回新渐变函数。
 */
export function easeOut(timingFunction: (value: number) => number) {
    return (value: number) => 1 - timingFunction(1 - value);
}

/**
 * 返回一个先正向再反向的渐变曲线。
 * @param timingFunction 渐变函数。
 * @return 返回新渐变函数。
 */
export function easeInOut(timingFunction: (value: number) => number) {
    return (value: number) => (value <= 0.5) ? timingFunction(2 * value) / 2 : (2 - timingFunction(2 * (1 - value))) / 2;
}
