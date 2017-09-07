/**
 * 线性渐变。
 * @param x 要渐变的值。
 * @return 返回渐变后的值。
 */
export function linear(x: number) {
    return x;
}

/**
 * 抛物线渐变。
 * @param x 要渐变的值。
 * @param base 渐变的基数。
 * @return 返回渐变后的值。
 */
export function power(x: number, base = 3) {
    return Math.pow(x, base);
}

/**
 * 指数渐变。
 * @param x 要渐变的值。
 * @return 返回渐变后的值。
 */
export function exponential(x: number) {
    return Math.pow(2, 8 * (x - 1));
}

/**
 * 双三角渐变。
 * @param x 要渐变的值。
 * @return 返回渐变后的值。
 */
export function circular(x: number) {
    return 1 - Math.sin(Math.acos(x));
}

/**
 * 上三角渐变。
 * @param x 要渐变的值。
 * @return 返回渐变后的值。
 */
export function sinusoidal(x: number) {
    return 1 - Math.sin((1 - x) * Math.PI / 2);
}

/**
 * 后退渐变。
 * @param x 要渐变的值。
 * @param base 渐变的基数。
 * @return 返回渐变后的值。
 */
export function back(x: number, base = 1.618) {
    return Math.pow(x, 2) * ((base + 1) * x - base);
}

/**
 * 弹跳渐变。
 * @param x 要渐变的值。
 * @return 返回渐变后的值。
 */
export function bounce(x: number) {
    for (let i = 0, j = 1; 1; i += j, j /= 2) {
        if (x >= (7 - 4 * i) / 11) {
            return j * j - Math.pow((11 - 6 * i - 11 * x) / 4, 2);
        }
    }
}

/**
 * 弹力渐变。
 * @param x 要渐变的值。
 * @param base 渐变的基数。
 * @return 返回渐变后的值。
 */
export function elastic(x: number, base = 1) {
    return Math.pow(2, 10 * --x) * Math.cos(20 * x * Math.PI * x / 3);
}

/**
 * 返回一个源渐变曲线。
 * @param transition 渐变函数。
 * @return 返回渐变函数。
 */
export function easeIn(transition: (x: number) => number) {
    return transition;
}

/**
 * 返回一个反向渐变曲线。
 * @param transition 渐变函数。
 * @return 返回渐变函数。
 */
export function easeOut(transition: (x: number) => number) {
    return function (x: number) {
        return 1 - transition(1 - x);
    };
}

/**
 * 返回一个先正向再反向渐变曲线。
 * @param transition 渐变函数。
 * @return 返回渐变函数。
 */
export function easeInOut(transition: (x: number) => number) {
    return function (x: number) {
        return (x <= 0.5) ? transition(2 * x) / 2 : (2 - transition(2 * (1 - x))) / 2;
    };
}
