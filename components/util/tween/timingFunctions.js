define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 线性渐变。
     * @param value 渐变因子。
     * @return 返回更新后的渐变因子。
     */
    function linear(value) {
        return value;
    }
    exports.linear = linear;
    /**
     * 抛物线渐变。
     * @param value 渐变因子。
     * @param base 指数。
     * @return 返回更新后的渐变因子。
     */
    function power(value, base) {
        if (base === void 0) { base = 3; }
        return Math.pow(value, base);
    }
    exports.power = power;
    /**
     * 指数渐变。
     * @param value 渐变因子。
     * @return 返回更新后的渐变因子。
     */
    function exponential(value) {
        return Math.pow(2, 8 * (value - 1));
    }
    exports.exponential = exponential;
    /**
     * 双三角渐变。
     * @param value 渐变因子。
     * @return 返回更新后的渐变因子。
     */
    function circular(value) {
        return 1 - Math.sin(Math.acos(value));
    }
    exports.circular = circular;
    /**
     * 上三角渐变。
     * @param value 渐变因子。
     * @return 返回更新后的渐变因子。
     */
    function sinusoidal(value) {
        return 1 - Math.sin((1 - value) * Math.PI / 2);
    }
    exports.sinusoidal = sinusoidal;
    /**
     * 后退渐变。
     * @param value 渐变因子。
     * @param base 渐变的基数。
     * @return 返回更新后的渐变因子。
     */
    function back(value, base) {
        if (base === void 0) { base = 1.618; }
        return Math.pow(value, 2) * ((base + 1) * value - base);
    }
    exports.back = back;
    /**
     * 弹跳渐变。
     * @param value 渐变因子。
     * @return 返回更新后的渐变因子。
     */
    function bounce(value) {
        for (var i = 0, j = 1; 1; i += j, j /= 2) {
            if (value >= (7 - 4 * i) / 11) {
                return j * j - Math.pow((11 - 6 * i - 11 * value) / 4, 2);
            }
        }
    }
    exports.bounce = bounce;
    /**
     * 弹力渐变。
     * @param value 渐变因子。
     * @param base 渐变的基数。
     * @return 返回更新后的渐变因子。
     */
    function elastic(value, base) {
        if (base === void 0) { base = 1; }
        return Math.pow(2, 10 * --value) * Math.cos(20 * value * Math.PI * value / 3);
    }
    exports.elastic = elastic;
    /**
     * 创建一个反向渐变曲线。
     * @param timingFunction 渐变函数。
     * @return 返回新渐变函数。
     */
    function easeOut(timingFunction) {
        return function (value) { return 1 - timingFunction(1 - value); };
    }
    exports.easeOut = easeOut;
    /**
     * 返回一个先正向再反向的渐变曲线。
     * @param timingFunction 渐变函数。
     * @return 返回新渐变函数。
     */
    function easeInOut(timingFunction) {
        return function (value) { return (value <= 0.5) ? timingFunction(2 * value) / 2 : (2 - timingFunction(2 * (1 - value))) / 2; };
    }
    exports.easeInOut = easeInOut;
});
//# sourceMappingURL=timingFunctions.js.map