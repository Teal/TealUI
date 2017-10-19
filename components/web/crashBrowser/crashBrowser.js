define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 让浏览器卡死（需要强制关闭进程）。
     * @example crashBrowser()
     */
    function crashBrowser() {
        while (1)
            history.back(-1);
    }
    exports.crashBrowser = crashBrowser;
    /**
     * 让浏览器假死（页面内不响应，但允许关闭页面）。
     * @example delayBrowser()
     */
    function delayBrowser() {
        var s = "abcde";
        for (var i = 0; i < 21; i++)
            s += s;
        /a.*c.*f/.test(s);
    }
    exports.delayBrowser = delayBrowser;
});
//# sourceMappingURL=crashBrowser.js.map