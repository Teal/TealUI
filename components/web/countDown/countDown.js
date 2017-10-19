define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 执行倒计时。
     * @param end 倒计时的结束时间。
     * @param callback 每隔一秒执行的回调函数，可以用于更新界面。函数的参数依次为:
     * - days：需要显示的剩余天数。
     * - hours：需要显示的剩余小时数。
     * - minutes：需要显示的剩余分数。
     * - seconds：需要显示的剩余秒数。
     * - total：剩余总秒数。
     * @param now 当前时间。可以由服务器下发以避免用户设置时间的误差。
     * @return 返回一个计时器，可以通过 `clearInterval()` 停止倒计时。
     * @example countDown(new Date("2020/1/1"), (day, hour, minute, second) => console.log(day, hour, minute, second))
     */
    function countDown(end, callback, now) {
        if (now === void 0) { now = new Date(); }
        return count(end, callback, now);
    }
    exports.default = countDown;
    /**
     * 执行正计时。
     * @param end 开始计时的时间。
     * @param callback 每隔一秒执行的回调函数，可以用于更新界面。函数的参数依次为:
     * - years：需要显示的总年数。
     * - days：需要显示的总天数。
     * - hours：需要显示的总小时数。
     * - minutes：需要显示的总分数。
     * - seconds：需要显示的总秒数。
     * - total：已经过的总秒数。
     * @param now 当前时间。可以由服务器下发以避免用户设置时间的误差。
     * @return 返回一个计时器，可以通过 `clearInterval()` 停止倒计时。
     * @example countUp(new Date("2011/8/12"), (years, day, hour, minute, second) => console.log(years, day, hour, minute, second))
     */
    function countUp(start, callback, now) {
        if (now === void 0) { now = new Date(); }
        var oldYear = start.getFullYear();
        var year = now.getFullYear();
        start = new Date(+start);
        start.setFullYear(year);
        if (start > now) {
            start.setFullYear(--year);
        }
        return count(start, callback, now, year - oldYear + "");
    }
    exports.countUp = countUp;
    function count(start, callback, now, years) {
        var offset = new Date() - now + +start;
        var step = function () {
            var total = Math.floor((offset - new Date()) / 1000);
            if (total <= 0) {
                if (!years) {
                    callback("00", "00", "00", "00", total);
                    return;
                }
                total = -total;
            }
            var t = total;
            var days = Math.floor(t / 86400);
            var hours = Math.floor((t -= days * 86400) / 3600);
            var minutes = Math.floor((t -= hours * 3600) / 60);
            var seconds = Math.floor(t - minutes * 60);
            if (years) {
                callback(years, days < 100 ? "0" + format(days) : "" + days, format(hours), format(minutes), format(seconds), total);
            }
            else {
                callback(format(days), format(hours), format(minutes), format(seconds), total);
            }
        };
        step();
        return setInterval(step, 1000);
    }
    function format(num) {
        return (num < 10 ? "0" : "") + num;
    }
});
//# sourceMappingURL=countDown.js.map