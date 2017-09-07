/**
 * 强制打开指定网页。
 * @param url 要打开的地址。
 * @example forceOpen("http://tealui.com/")
 */
export default function forceOpen(url: string) {
    if (!window.open(url)) {
        var oldOnClick = document.onclick;
        document.onclick = function () {
            document.onclick = oldOnClick;
            window.open(url);
            return oldOnClick && oldOnClick.apply(document, arguments);
        };
    }
}
