
(function (ua) {

    var match = ua.match(/(IE|Firefox|Chrome|Safari|Opera)[\/\s](\d*)/i) || ua.match(/(WebKit|Gecko)[\/\s]([\w\.]*)/i) || [0, "Other", 0];

    /**
     * 获取当前浏览器名。
     */
    navigator.browser = match[1];

    /**
     * 获取当前浏览器版本。
     */
    navigator.version = match[2];

})(navigator.userAgent);

/**
 * 获取当前浏览器引擎。
 */
navigator.engine = window.opera ? 'Presto' : window.ActiveXObject ? 'Trident' : document.getBoxObjectFor != null || window.mozInnerScreenX != null ? 'Gecko' : document.childNodes && !document.all && !navigator.taintEnabled ? 'Webkit' : 'Other';
