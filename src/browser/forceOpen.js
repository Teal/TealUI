/** * @author xuld *//**
 * 强制打开指定页面。
 * @param {String} url 要打开的地址。
 */function forceOpen(url) {    if (!window.open(url)) {
        var oldOnClick = document.onclick;
        document.onclick = function () {
            document.onclick = oldOnClick;
            forceOpen(url);
            oldOnClick && oldOnClick.apply(document, arguments);
        };
    }
}