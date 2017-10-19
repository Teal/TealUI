define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 格式化货币为中文大写格式（如壹佰贰拾元）。
     * @param value 要格式化的货币值。最大不能超过 9 亿。
     * @return 返回格式化后的字符串。
     * @example formatCurrencyToChinese(10000000) // "壹仟万元"
     */
    function formatCurrencyToChinese(value) {
        var digits = "零壹贰叁肆伍陆柒捌玖";
        var units0 = "元万亿";
        var units1 = ["", "拾", "佰", "仟"];
        var neg = value < 0;
        if (neg)
            value = -value;
        if (value < 0.005)
            return "零元";
        var t = Math.round(value * 100) % 100;
        var s = t ? (t >= 10 ? digits.charAt(Math.floor(t / 10)) + "角" : "") + (t % 10 ? digits.charAt(t % 10) + "分" : "") : "";
        t = Math.floor(value);
        for (var i = 0; i < units0.length && t > 0; i++) {
            var p = "";
            for (var j = 0; j < units1.length && t > 0; j++) {
                p = digits.charAt(t % 10) + units1[j] + p;
                t = Math.floor(t / 10);
            }
            s = (p.replace(/(零.)*零$/, "") || "零") + units0.charAt(i) + s;
        }
        return (neg ? "负" : "") + s.replace(/(零.)*零元/, "元").replace(/(零.)+/g, "零");
    }
    exports.default = formatCurrencyToChinese;
});
//# sourceMappingURL=formatCurrencyToChinese.js.map