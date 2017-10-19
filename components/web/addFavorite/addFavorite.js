define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 打开添加到收藏夹对话框。
     * @param title 要显示的标题。默认为当前网页标题。
     * @param url 要收藏的地址。默认为当前网页地址。
     * @example addFavorite() // 添加当前网页到收藏夹。
     * @example addFavorite("TealUI", "http://tealui.com") // 添加指定网页到收藏夹。
     * @desc 由于安全问题，最新浏览器不允许使用此功能，这时函数会提示用户手动操作。
     */
    function addFavorite(title, url) {
        if (title === void 0) { title = document.title; }
        if (url === void 0) { url = location.href; }
        try {
            external.addFavorite(url, title);
        }
        catch (e) {
            alert("您的浏览器不允许自动添加收藏。" + (navigator.maxTouchPoints ? "请手动添加" : "请按 Ctrl+D 添加到收藏夹"));
        }
    }
    exports.addFavorite = addFavorite;
    /**
     * 弹出设置主页对话框。
     * @param url 要设置的主页地址。默认为当前网页地址。
     * @example setHomePage() // 设置当前网页为主页。
     * @example setHomePage("TealUI", "http://tealui.com") // 设置指定网页为主页。
     * @desc 由于安全问题，最新浏览器不允许使用此功能，这时函数会提示用户手动操作。
     */
    function setHomePage(url) {
        try {
            document.body.style.behavior = "url(#default#homepage)";
            document.body.setHomePage(url || location.href);
        }
        catch (e) {
            alert("您的浏览器不允许自动设置主页。请在浏览器设置页中手动设置");
            // 用户也可选择打开以下页面提示用户设置方法。
            // window.open("http://www.hao123.com/redian/sheshouyef.htm");
            // window.open("http://hao.360.cn/sub/sethomepage.html");
        }
    }
    exports.setHomePage = setHomePage;
});
//# sourceMappingURL=addFavorite.js.map