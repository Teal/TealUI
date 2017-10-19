define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 计算两个大正整数的和。
     * @param x 要计算的第一个值。
     * @param y 要计算的第二个值。
     * @return 返回计算的结果。
     * @example add("1", "2") // "3"
     */
    function add(x, y) {
        var r = [];
        var m = x.split("").reverse();
        var n = y.split("").reverse();
        var s = 0;
        for (var i = 0; i < x.length || i < y.length; i++) {
            var t = (+m[i] || 0) + (+n[i] || 0) + s;
            r.push(t % 10);
            s = (t / 10) | 0;
        }
        s && r.push(s);
        return r.reverse().join("");
    }
    exports.add = add;
    /**
     * 计算两个大正整数的积。
     * @param x 要计算的第一个值。
     * @param y 要计算的第二个值。
     * @return 返回计算的结果。
     * @example mul("1", "2") // "2"
     */
    function mul(x, y) {
        var r = "0";
        var p = x.match(/\d{1,4}/g).reverse();
        var q = y.match(/\d{1,4}/g).reverse();
        var f1 = 0;
        for (var _i = 0, p_1 = p; _i < p_1.length; _i++) {
            var pi = p_1[_i];
            var f2 = 0;
            for (var _a = 0, q_1 = q; _a < q_1.length; _a++) {
                var qi = q_1[_a];
                r = add(r, +pi * +qi + new Array(f1 + f2 + 1).join("0"));
                f2 += qi.length;
            }
            f1 += pi.length;
        }
        return r;
    }
    exports.mul = mul;
});
//# sourceMappingURL=bigInteger.js.map