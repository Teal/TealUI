/**
 * @fileOverview 让浏览器强制打开指定网页。
 * @author xuld
 */

/**
 * 强制打开指定网页。
 * @param {String} url 要打开的地址。
 * @example forceOpen("http://teal.github.io/TealUI")
 */
function forceOpen(url) {
    if (!window.open(url)) {
        var oldOnClick = document.onclick;
        document.onclick = function () {
            document.onclick = oldOnClick;
            window.open(url);
            return oldOnClick && oldOnClick.apply(document, arguments);
        };
    }
}