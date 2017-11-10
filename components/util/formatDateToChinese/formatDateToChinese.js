define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 格式化时间为中文可读格式（如“3 分钟前”）。
     * @param date 要格式化的日期对象。
     * @param now 当前时间。
     * @return 根据指定的时间与当前时间的差距，返回以下格式之一：“刚刚”、“N 秒前”、“N 分钟前”、“N 小时前”、“昨天”、“N 天前”、“N月N日”或“N年N月N日”。
     * @example formatDateToChinese(new Date("2000/1/1"), new Date("2000/1/2")) // "昨天"
     * @example formatDateToChinese(new Date("2000/1/1"), new Date("2000/1/3")) // "2 天前"
     */
    function formatDateToChinese(date, now) {
        if (now === void 0) { now = new Date(); }
        if (now >= date && date.getFullYear() === now.getFullYear()) {
            if (date.getMonth() === now.getMonth()) {
                var delta = Math.floor((now - date) / 1000);
                if (delta < 1) {
                    return "\u521A\u521A";
                }
                if (delta < 60) {
                    return delta + "\u79D2\u524D";
                }
                if (delta < 60 * 60) {
                    return Math.floor(delta / 60) + "\u5206\u949F\u524D";
                }
                if (delta < 60 * 60 * 24) {
                    return Math.floor(delta / (60 * 60)) + "\u5C0F\u65F6\u524D";
                }
                if (delta < 60 * 60 * 24 * 2) {
                    return "\u6628\u5929";
                }
                return Math.floor(delta / (60 * 60 * 24)) + "\u5929\u524D";
            }
            return date.getMonth() + 1 + "\u6708" + date.getDate() + "\u65E5";
        }
        return date.getFullYear() + "\u5E74" + (date.getMonth() + 1) + "\u6708" + date.getDate() + "\u65E5";
    }
    exports.default = formatDateToChinese;
});
//# sourceMappingURL=formatDateToChinese.js.map